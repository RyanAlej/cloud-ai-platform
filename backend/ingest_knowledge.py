from openai import OpenAI

from backend.database import SessionLocal
from backend.models import KnowledgeChunk


client = OpenAI()

source_text = """
This is temporary test content for MagHub knowledge base.
"""

# convert the source text into an embedding vector
embedding_response = client.embeddings.create(

    model="text-embedding-3-small",
    input=source_text
)

# get the actual list of embedding numbers from the OpenAI response
embedding_vector = embedding_response.data[0].embedding

# create a new knowledge chunk using the source text and its embedding
knowledge_chunk = KnowledgeChunk(

    source_name="Test source",
    source_url="https://example.com",
    content=source_text,
    embedding=embedding_vector
)

# opens a db session so the knowledge chunk can be saved to PostgreSQL
db = SessionLocal()

# stage the new row
db.add(knowledge_chunk)

# actually save it
db.commit()

# close the session
db.close()

print("knowledge chunk saved.")