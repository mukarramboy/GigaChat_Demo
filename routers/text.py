from aiogram import Router, F
from aiogram.types import Message
import os
import replicate
from states import Mode
from config import REPLICATE_TOKEN

os.environ["REPLICATE_API_TOKEN"] = REPLICATE_TOKEN
router = Router()

@router.message(Mode.text, F.text)
async def text_handler(message: Message):
    msg = await message.answer("⏳ Генерирую текст...")

    input_data = {
        "prompt": message.text,
        "max_length": 2048,
        "temperature": 0.1
    }

    try:
        # 👇 указываем точную модель с конкретным version hash
        output = replicate.run(
            "replicate/flan-t5-xl:YOUR_VERSION_HASH",
            input=input_data
        )

        text = output if isinstance(output, str) else "".join(output)

        if len(text) > 4096:
            text = text[:4093] + "..."

        await msg.edit_text(text)

    except Exception as e:
        await msg.edit_text(f"❌ Ошибка при генерации: {str(e)}")
