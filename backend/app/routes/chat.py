from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import SessionLocal
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.routes.auth import SECRET_KEY, ALGORITHM
from app.services.hf_client import generate_llama_response  

router = APIRouter(prefix="/chat", tags=["Chat"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


memory = {}
MAX_HISTORY = 10


def get_current_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/message", response_model=schemas.ChatResponse)
def chat_message(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    user_msg = request.message
    chat_id = request.chat_id

    chat_history = memory.get(f"{user_id}_{chat_id}", [])

    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for u, b in chat_history[-MAX_HISTORY:]:
        messages.append({"role": "user", "content": u})
        messages.append({"role": "assistant", "content": b})
    messages.append({"role": "user", "content": user_msg})

    #  Call Llama service
    bot_reply = generate_llama_response(messages)

    # Update memory
    chat_history.append((user_msg, bot_reply))
    memory[f"{user_id}_{chat_id}"] = chat_history[-MAX_HISTORY:]

    # Save to database
    try:
        new_msg = models.ChatHistory(
            chat_id=chat_id,
            message=user_msg,
            response=bot_reply,
            user_id=user_id
        )
        db.add(new_msg)
        db.commit()
    except Exception as e:
        db.rollback()
        print("DB Error:", e)
        raise HTTPException(status_code=500, detail="Database error")

    return {"response": bot_reply}


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    chats = db.query(models.ChatHistory).filter(models.ChatHistory.user_id == user_id).all()
    grouped = {}
    for c in chats:
        grouped.setdefault(c.chat_id, []).append({"from": "user", "text": c.message})
        grouped[c.chat_id].append({"from": "bot", "text": c.response})

    return [{"chat_id": k, "messages": v} for k, v in grouped.items()]
