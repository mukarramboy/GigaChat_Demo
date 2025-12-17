import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
REPLICATE_TOKEN = os.getenv("REPLICATE_API_TOKEN")

if not BOT_TOKEN or not REPLICATE_TOKEN:
    raise RuntimeError("❌ BOT_TOKEN или REPLICATE_API_TOKEN не установлен")
