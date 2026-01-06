from fastapi import APIRouter, Query, HTTPException
from app.schemas.chats import ChatResponse
from app.services.chat_service import fetch_user_chats, detail_chat, remove_chat

router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)

@router.get("", response_model=list[ChatResponse])
async def get_chats_by_user(user_id: int = Query(..., description="ID of the user")):
    return await fetch_user_chats(user_id)

@router.get("/{chat_id}")
async def get_chat_details(chat_id: int):
    return await detail_chat(chat_id)


@router.delete("/{chat_id}")
async def delete_chat_endpoint(chat_id: int, user_id: int = Query(..., description="ID of the user")):
    """
    Удаляет чат и все его промпты.
    Пользователь может удалить только свой чат.
    """
    result = await remove_chat(chat_id, user_id)
    
    if result == "not_found":
        raise HTTPException(status_code=404, detail="Chat not found")
    
    if result == "forbidden":
        raise HTTPException(status_code=403, detail="You can only delete your own chats")
    
    return {"message": "Chat deleted successfully", "chat_id": chat_id}