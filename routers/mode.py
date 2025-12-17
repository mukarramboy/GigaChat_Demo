from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from states import Mode

router = Router()

@router.message(Command("text"))
async def set_text_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.text)
    await message.answer("💬 Режим *ТЕКСТ* активирован")

@router.message(Command("image"))
async def set_image_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.image)
    await message.answer("🖼 Режим *ИЗОБРАЖЕНИЙ* активирован")

@router.message(Command("mode"))
async def get_mode(message: Message, state: FSMContext):
    current = await state.get_state()
    await message.answer(f"📌 Текущий режим: `{current}`")
