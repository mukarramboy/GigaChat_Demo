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

    prompt = message.text



    try:
        sdk = Bytez(QWEN_API_TOKEN)
        model = sdk.model("microsoft/Phi-3-mini-4k-instruct")

        # send input to model
        output = model.run([
            {
                "role": "user",
                "content": prompt,
            }
        ])

        if not output or not hasattr(output, "output") or output.output is None:
            raise Exception("❌ Model javob bermadi")

        result = output.output
        text = result.get("content").strip()

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
