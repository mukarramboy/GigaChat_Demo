from app.database.query import get_user_chats, get_chat_prompts, delete_chat
from app.schemas.chats import ChatResponse, ChatDetailResponse, ChatPrompt


async def fetch_user_chats(user_id: int) -> list[dict]:
    chats = await get_user_chats(user_id)
    return [ChatResponse(**chat) for chat in chats]

async def detail_chat(chat_id: int) -> dict:
    prompts_data = await get_chat_prompts(chat_id)
    prompts = [ChatPrompt(**prompt) for prompt in prompts_data]

    return ChatDetailResponse(chat_id=chat_id, prompts=prompts)


async def remove_chat(chat_id: int, user_id: int) -> str:
    """
    Удаляет чат и все его промпты.
    Возвращает статус: "deleted", "not_found", или "forbidden"
    """
    return await delete_chat(chat_id, user_id)