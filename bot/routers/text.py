from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from states import Mode
from config import QWEN_API_TOKEN
from database.query import save_prompt
from bytez import Bytez

router = Router()

@router.message(Mode.text, F.text)
async def text_handler(message: Message, state: FSMContext):
    data = await state.get_data()
    chat_id = data.get("chat_id")


    msg = await message.answer("⏳ Генерирую текст...")

    input_data = {
        "prompt": message.text,
        "max_length": 2048,
        "temperature": 0.1
    }
    prompt = input_data["prompt"]

    try:
        sdk = Bytez(QWEN_API_TOKEN)

        # choose Qwen2.5-7B-Instruct
        model = sdk.model("Qwen/Qwen2.5-7B-Instruct")

        # send input to model
        output = model.run([
        {
            "role": "user",
            "content": prompt
        }
        ])

        content = output.output["content"]
        text = content.strip()

        if len(text) > 4096:
            text = text[:4093] + "..."

        await msg.edit_text(text)

        # ✅ DB’ga saqlash
        await save_prompt(
            chat_id=chat_id,
            prompt_type="text",
            prompt=message.text,
            response=text
        )

    except Exception as e:
        await msg.edit_text(f"❌ Ошибка при генерации: {str(e)}")
