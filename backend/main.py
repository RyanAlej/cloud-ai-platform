# HANDLES HTTP REQUESTS

# fastAPI routes between python functions like load balancer/manager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.models import (
    QuestionRequest, 
    ConversationResponse, 
    ChatSessionResponse, 
    ChatSession, 
    RenameChatRequest
)

from backend.ai_service import (
    ask_openai, 
    get_history, 
    delete_history, 
    get_conversation, 
    get_chat_sessions,
    get_chat
)

from backend.database import create_tables, SessionLocal

# creates fastAPI application object
# runs in RAM, not the server
# when typing uvicorn backend.main:app this means...
# go into backend/main.py and find the variable named app, now Uvicorn has FastAPI object
app = FastAPI()

# enable CORS so browsers allow the frontend to sent HTTP requests to this backend
# allow the front end (JS) to communicate with this FastAPI backend through the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_tables()


# this is calling a URL. so https://127.0.0.10/ or https://127.0.0.10/ask, etc.
# one HTTP request --> one database session
@app.get("/")
def home():
    return {"message": "API is running"}


@app.post("/ask")
# QuestionRequest is question: str. so request now contains the object which contains question: "how are you?"
# fastAPI takes the ask_ai value (question: "how are you?"). 
def ask_ai(request: QuestionRequest):
    print(request.chat_id)
    result = ask_openai(

        request.question,
        request.chat_id
    )

    return result


# if someone sends a GET request to /history, run the function below
# response_model is from FastAPI library
# list[ConversationResponse] = expect a Python list where each item is a ConversationResponse
    # ConversationResponse = one conversation
    # list[ConversationResponse] = many conversations
@app.get("/history", response_model=list[ConversationResponse])
def history():
    return get_history()


# @app... is called a decorator. it means the function below me has this property. NOT A BLOCK
@app.delete("/history")
def delete():
    return delete_history()


@app.get("/chat-sessions", response_model=list[ChatSessionResponse])
def chat_sessions():
    return get_chat_sessions()

@app.get("/chat-sessions/{chat_id}")
def get_chat_by_id(chat_id: int):

    # this calls the get_chat function AND returns its value which is the chat_id
    return get_chat(chat_id)


@app.patch("/chat-sessions/{chat_id}")
def rename_chat(chat_id: int, request: RenameChatRequest):

    db = SessionLocal()

    try: 
        current_chat = (

            db.query(ChatSession)
            .filter(ChatSession.id == chat_id)
            .first()
        )

        if current_chat is None:
            return {"message": "Chat not found."}

        current_chat.title = request.title

        db.commit()

        return {"message": "Chat renamed successfully."}

    finally:
        db.close()


@app.delete("/chat-sessions/{chat_id}")
def delete_chat(chat_id: int):

    db = SessionLocal()

    try: 

        current_chat = (
                   
            db.query(ChatSession)
                    
            .filter(ChatSession.id == chat_id)
                    
            .first()
        )

        if current_chat is None:
            return {"message": "Chat not found."}

        db.delete(current_chat)

        db.commit()

        return {"message": "Chat deleted."}

    finally: 

        db.close()

    