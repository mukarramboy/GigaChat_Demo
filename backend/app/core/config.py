import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
GENERATE_URL = "https://api.nanobanana.ai/v1/generate"
STATUS_URL = "https://api.nanobanana.ai/v1/record-info"