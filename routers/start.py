from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    Message,
    WebAppInfo

)
from aiogram.fsm.context import FSMContext

from states import Mode
from database.query import create_chat, save_user, save_prompt

router = Router()


def main_menu(user_id: int):
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="💬 Текст"), KeyboardButton(text="🖼 Изображение")],
            [KeyboardButton(text="📚 История"), KeyboardButton(text="🆕 Новый чат")],
            [
                KeyboardButton(
                    text ="🔗 Веб-версия",
                    web_app=WebAppInfo(url=f"https://gigachat.sber.ru?user_id={user_id}")
                )
            ]
        ],
        resize_keyboard=True,
        input_field_placeholder="Сообщение..."
    )


@router.message(CommandStart())
async def start_handler(message: Message, state: FSMContext):
    await state.clear()
    user_id = message.from_user.id
    await save_user(user_id)
    await create_chat(user_id)

    await message.answer(
        "👋 *AI Assistant Bot*\n\nВыбери действие:",
        reply_markup=main_menu(user_id)
    )


@router.message(F.text == "💬 Текст")
async def set_text_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.text)
    user_id = message.from_user.id
    
    
    await message.answer(
        "💬 Режим *ТЕКСТ* активирован\n\nНапиши запрос:",
        reply_markup=main_menu(user_id)
    )


@router.message(F.text == "🖼 Изображение")
async def set_image_mode(message: Message, state: FSMContext):
    await state.set_state(Mode.image)
    user_id = message.from_user.id
    await message.answer(
        "🖼 Режим *ИЗОБРАЖЕНИЙ* активирован\n\nОпиши изображение:",
        reply_markup=main_menu(user_id)
    )

@router.message(F.text == "🆕 Новый чат")
async def new_chat(message: Message, state: FSMContext):
    await state.clear()
    user_id = message.from_user.id
    await create_chat(user_id)
    await message.answer(
        "🆕 Новый чат создан. Выбери режим:",
        reply_markup=main_menu(user_id)
    )