# TALKS TO OPENAI

from backend.config import client

# starts conversation with PostgreSQL
from backend.database import SessionLocal

# importing the Conversation class
from backend.models import Conversation

def ask_openai(question: str):

    try:
        response = client.responses.create(
            model="gpt-5.5",
            input=question
        )

        # creates database session object CONNECTION. opens a conversation with PostgreSQL
        # the session object has add(), commit(), close()
        db = SessionLocal()

        # creates a python object that represents one row
        # sitting in python memory. PostgreSQL does not know it exists yet
        conversation = Conversation(
            # left side question = from the Conversation object --> question variable
            # right side question = use passed in question variable from the ask_openai function above
            question=question,
            answer=response.output_text
        )
        # adds but does not save
        db.add(conversation)

        # means save/permanently store this
        db.commit()

        return response.output_text

    except Exception:
        return "Sorry, something went wrong."

    # finally ALWAYS runs
    finally:
            db.close()


def get_history():
         # SQLAlchemy opened a connection (session) to PostgreSQL
         db = SessionLocal()

        # using my database session (db), query the Conversation table and return all rows as list
        # this is SQLAlchemy library 
         history = db.query(Conversation).all()

         db.close()

         return history


# IMPORTANT*************************************************************

def delete_history():

    # create a new database session
    db = SessionLocal()

    try:
        # delete every row in the Conversation table
        db.query(Conversation).delete()

        # permanently save the deletion
        db.commit()

        # return a success message
        return {"message": "History deleted successfully."}

    # catch whatever error happened and store in variable e
    except Exception as e:

        # undo chagnes only if an error occurs
        db.rollback()

        # return the error message only not the error class
        # error class = ZeroDivisionError: 
        # error message string = division by zero
        return {"error": str(e)}

    finally: 
        # always close the db session
        db.close()


def get_conversation(conversation_id):
    db = SessionLocal()

    try: 
        # query the Conversation table for one row with the matching ID
        conversation = db.query(Conversation).filter(
             # compare the database ID to the passed-in ID
             Conversation.id == conversation_id
        # return the first matching row
        ).first()

        # return the conversation object
        return conversation

    finally:
         db.close()