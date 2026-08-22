# LOADS CONFIGURATION AND CREATES THE OPENAI CLIENT

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_MODEL = "gpt-5.5"

#creates an OpenAI client object
# OpenAI calls the OpenAI class from the OpenAI python library
client = OpenAI(
    # pass YOUR API key into that client, this tells OpenAI who you are and who to bill
    api_key=OPENAI_API_KEY
)

# so it uses the OpenAI library i imported into python and the passes in my api key...
# that i pulled previously from the .env file. and then that client object is stored in the client variable