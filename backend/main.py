# HANDLES HTTP REQUESTS

# fastAPI routes between python functions like load balancer/manager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.models import QuestionRequest, ConversationResponse
from backend.ai_service import ask_openai, get_history, delete_history, get_conversation

from backend.database import create_tables

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
# this means "I want a QuestionRequest object"
def ask_ai(request: QuestionRequest):
    answer = ask_openai(request.question)
    return {"answer": answer}


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


# if someone sends GET /history/{id}, run the function below
@app.get("/history/{conversation_id}", response_model=ConversationResponse)

# conversation_id is taken from the URL and passed into the function
def history_by_id(conversation_id: int):

    # pass the ID to the db function and return the result
    return get_conversation(conversation_id)