from aiogram import Router, F, Bot
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram.fsm.context import FSMContext
from states import Mode

router = Router()

@router.message(CommandStart())
async def start_handler(message, state: FSMContext):
    await state.clear()

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💬 Генерировать текст", callback_data="cmd_text")],
        [InlineKeyboardButton(text="🖼 Генерировать изображение", callback_data="cmd_image")],
        [InlineKeyboardButton(text="🔄 Текущий режим", callback_data="cmd_mode")],
    ])

    await message.answer(
        "👋 *AI Assistant Bot*\n\n"
        "Выбери команду ниже, чтобы она была выполнена сразу:",
        reply_markup=keyboard
    )

# Обработчики логики команд
async def activate_text(bot: Bot, chat_id: int):
    await bot.send_message(chat_id, "💬 Режим ТЕКСТА активирован")

async def activate_image(bot: Bot, chat_id: int):
    await bot.send_message(chat_id, "🖼 Режим ИЗОБРАЖЕНИЙ активирован")

async def activate_mode(bot: Bot, chat_id: int):
    await bot.send_message(chat_id, "🔄 Текущий режим отображается")

# Обработчик нажатий кнопок
@router.callback_query(F.data.startswith("cmd_"))
async def command_button_handler(callback: CallbackQuery, bot: Bot, state: FSMContext):
    if callback.data == "cmd_text":
        await state.set_state(Mode.text)
        await callback.message.edit_text("💬 Режим *ТЕКСТ* активирован")
    elif callback.data == "cmd_image":
        await state.set_state(Mode.image)
        await callback.message.edit_text("🖼 Режим *ИЗОБРАЖЕНИЙ* активирован")
    elif callback.data == "cmd_mode":
        current = await state.get_state()
        await callback.message.edit_text(f"📌 Текущий режим: `{current}`")
    
    # убираем "часики" после нажатия
    await callback.answer()
