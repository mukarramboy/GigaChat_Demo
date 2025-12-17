from aiogram.fsm.state import StatesGroup, State

class Mode(StatesGroup):
    text = State()
    image = State()
