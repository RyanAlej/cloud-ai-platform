# TALKS TO OPENAI

from backend.config import client

# starts conversation with PostgreSQL
from backend.database import SessionLocal

# importing the Conversation class
from backend.models import Conversation, ChatSession

from typing import Optional

def ask_openai(question: str, chat_id: Optional[int] = None):

    try:

        # creates database session object CONNECTION. opens a conversation with PostgreSQL
        # the session object has add(), commit(), close()
        db = SessionLocal()

        # look inside the chat_sessions table and give me the first row
        # current_chat = db.query(ChatSession).first()

        if chat_id is None:
            current_chat = ChatSession(

                title="New Chat"
            )

            db.add(current_chat)
            db.commit()
            db.refresh(current_chat)

            title = generate_chat_title(question)
            
            current_chat.title = title
            
            db.commit()

        else: 
            current_chat = (
                # look in the chat_sessions table
                db.query(ChatSession)
                # .filter() keep only rows matching this condition
                # ChatSession.id == chat_id = where the row's id equals chat_id the frontend sent
                .filter(ChatSession.id == chat_id)
                # give me the first (and only) matching row
                .first()
            )

        history = (

            db.query(Conversation)
            .filter(Conversation.chat == current_chat)
            .all()
        )

        conversation_history = ""

        for convo in history:
            conversation_history += f"User: {convo.question}\n"
            conversation_history += f"Assistant: {convo.answer}\n"

        prompt = (

            conversation_history
            + f"\nUser: {question}\n"
            + "Assistant:"
        )

        # User: "How are you?"
        # Assistant: ...
        # PLUS all the conversation history from before

        response = client.responses.create(

                    model="gpt-5.5",
                    input=prompt
                )

        # creates a python object that represents one row
        # sitting in python memory. PostgreSQL does not know it exists yet
        conversation = Conversation(
            # left side question = from the Conversation object --> question variable
            # right side question = use passed in question variable from the ask_openai function above
            chat=current_chat,
            question=question,
            answer=response.output_text
        )

        # adds but does not save
        db.add(conversation)

        # means save/permanently store this
        db.commit()

        return {

            "answer": response.output_text,
            "chat_id": current_chat.id
        }

    except Exception as e:
        print(e)
        raise

    # finally ALWAYS runs
    finally:
        db.close()


def get_history():
         # SQLAlchemy opened a connection (session) to PostgreSQL
         db = SessionLocal()

        # using my database session (db), query the Conversation table and return all rows as list
        # this is SQLAlchemy library 
        # queries the db and returns conversation ordered from highest ID to lowest ID
         history = db.query(Conversation).order_by(Conversation.id.desc()).all()

         db.close()

         return history


def get_chat_sessions():

    db = SessionLocal()

    chat_sessions = db.query(ChatSession).order_by(ChatSession.id.desc()).all()

    db.close()

    return chat_sessions


# return every conversation that belongs to the selected chat
def get_chat(chat_id: int):

    db = SessionLocal()

    conversations = db.query(Conversation).filter(

        # give me all Conversation rows where the chat_id column equals the chat_id passsed into this function
        Conversation.chat_id == chat_id

    # all() tells SQLAlchemy to run the query and give every matching row
    ).all()

    db.close()

    return conversations


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


def generate_chat_title(question):

    # client is your OpenAI connection with API key
    # responses is built in to OpenAI that handles AI requests
    response = client.responses.create(
        model="gpt-5.5",
        input=f"""
        generate a short chat title (2-5 words) for the following user question.

        question:
        {question}

        only return the title. Do not include quotes or any explanation.
        """
    )
    return response.output_text