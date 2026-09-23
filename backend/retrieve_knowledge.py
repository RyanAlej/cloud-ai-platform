# OpenAI turns the user's question into an embedding
from openai import OpenAI

from backend.database import SessionLocal
from backend.models import KnowledgeChunk


client = OpenAI()

question = "what is maghub knowledge base?"

embedding_response = client.embeddings.create(

    model="text-embedding-3-small",
    input=question
)

question_embedding = embedding_response.data[0].embedding