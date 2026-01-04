import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
QWEN_API_TOKEN = os.getenv("QWEN_API_TOKEN")
NANO_BANANA_API_KEY = os.getenv("NANO_BANANA_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not BOT_TOKEN or not QWEN_API_TOKEN:
    raise RuntimeError("❌ BOT_TOKEN или QWEN_API_TOKEN не установлен")
