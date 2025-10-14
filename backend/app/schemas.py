from datetime import datetime
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    chat_id: str 
class ChatResponse(BaseModel):
    response: str

class ChatHistoryItem(BaseModel):
    id: int
    message: str
    response: str
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }


class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserLogin(BaseModel):
    username: str
    password: str
