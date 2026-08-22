# DEFINES THE DATA (THE REQUEST BODY)

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base

# base model is a pydantic library class. gives your class auto data validation, parsing, & JSON conversion
# pydantic is a python library that validates, parses, and converts data into python objects
# from pydantic = library
# import BaseModel = class inside that library
from pydantic import BaseModel


# this expects data from the user
class QuestionRequest(BaseModel):
    # every request should have a field called question, and it must be a string
    question: str

# QuestionRequest = your own class that represents what data you expect from the user
# BaseModel = Pydantic's class that gives your class the ability to automatically convert and validate JSON

# need jSON input? --> use a BaseModel
# need JSON output? --> Return a dictionary or BaseModel


#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


# this will send data back to the user
class ConversationResponse(BaseModel):
    id: int
    question: str
    answer: str


# DEFINING THE SCHEMA OF THE TABLE

# conversation inherits from Base
class Conversation(Base):
    # when you create this model in PostgreSQL, name the table conversations
    __tablename__ = "conversations"

    # id = the column name
    # Mapped[int] = this column stores integers
    # mapped_column(...) = tells SQLAlchemy "this is a database column"
    # primary_key=True = every row gets a unique ID
    id: Mapped[int] = mapped_column(primary_key=True)

    # question = column name
    # Mapped[str] = column stores Python strings
    # mapped_column(String) = tells SQLAlchemy to create a PostgreSQL TEXT/VARCHAR-type column
    question: Mapped[str] = mapped_column(String)

    answer: Mapped[str] = mapped_column(String)