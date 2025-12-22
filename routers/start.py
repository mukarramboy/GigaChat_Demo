from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    Message
)
from aiogram.fsm.context import FSMContext

from states import Mode

router = Router()


def main_menu():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="💬 Текст"), KeyboardButton(text="🖼 Изображение")],
            [KeyboardButton(text="📚 История"), KeyboardButton(text="🆕 Новый чат")],
        ],
        resize_keyboard=True,
        input_field_placeholder="Сообщение..."
    )


@router.message(CommandStart())
async def start_handler(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "👋 *AI Assistant Bot*\n\nВыбери действие:",
        reply_markup=main_menu()
    )


@router.message(F.text == "💬 Текст")
async def set_text_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.text)
    await message.answer(
        "💬 Режим *ТЕКСТ* активирован\n\nНапиши запрос:",
        reply_markup=main_menu()
    )


@router.message(F.text == "🖼 Изображение")
async def set_image_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.image)
    await message.answer(
        "🖼 Режим *ИЗОБРАЖЕНИЙ* активирован\n\nОпиши изображение:",
        reply_markup=main_menu()
    )

@router.message(F.text == "🆕 Новый чат")
async def new_chat(message: Message, state: FSMContext):
    await state.clear()
    await message.answer(
        "🆕 Новый чат создан. Выбери режим:",
        reply_markup=main_menu()
    )