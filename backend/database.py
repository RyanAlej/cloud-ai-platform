# creates the object Python uses to talk to PostgreSQL
from sqlalchemy import create_engine

# creates a session conversation (session) for reading/writing data to the database (subpackage = orm)
from sqlalchemy.orm import sessionmaker

# gets the database connection string from config.py
from backend.config import DATABASE_URL

# parent class that all database tables will inherit from (subpackage = orm)
from sqlalchemy.orm import DeclarativeBase

# creates an engine object from SQLAlchemy that knows how to connect to PostgreSQL
engine = create_engine(DATABASE_URL)


# this does not create session, it creates a session factory that knows how to make sessions
SessionLocal = sessionmaker(
    # use this engine whenever someone creates a session
    bind=engine,
    # don't automatically send changes to the database
    autoflush=False,
    # don't automatically save every change
    autocommit=False
)
# FOR ABOVE --> 
# DATABASE_URL = the address
# engine = the car
# SessionLocal = the driver

#XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Base inherits from DeclarativeBase
class Base(DeclarativeBase):
    pass


# this function is actually creating the table in PostgreSQL
def create_tables():
    # Base = creates every table that inherits from Base
    # .metadata = created automatically by SQLAlchemy. stores the blueprint of every table from Base
    # .create_all() = create every table inside my metadata
    # Base inherited metadata from DeclartiveBase
    Base.metadata.create_all(bind=engine)

