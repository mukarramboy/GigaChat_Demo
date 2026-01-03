from pydantic import BaseModel
from datetime import datetime
from typing import List


class ChatPrompt(BaseModel):
    id: int
    type: str
    prompt: str
    response: str
    created_at: datetime

class ChatResponse(BaseModel):
    chat_id: int
    created_at: datetime


class ChatDetailResponse(BaseModel):
    chat_id: int
    prompts: List[ChatPrompt]