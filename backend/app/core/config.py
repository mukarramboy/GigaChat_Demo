import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
NANO_BANANA_API_URL = "https://api.nanobanana.ai/v1"