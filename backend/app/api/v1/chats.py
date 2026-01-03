from fastapi import APIRouter, Query
from app.schemas.chats import ChatResponse
from app.services.chat_service import fetch_user_chats, detail_chat

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