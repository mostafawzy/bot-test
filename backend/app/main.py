from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, chat, users  # Import your routers


# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chatbot Backend")

""" 
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
 """
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Chatbot backend is running 🚀"}
