from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class PromptCreateRequest(BaseModel):
    chat_id: int
    type: Optional[str] = "text"
    prompt: str


class PromtResponse(BaseModel):
    id: int
    chat_id: int
    type: str
    prompt: str
    response: str
    created_at: datetime


    