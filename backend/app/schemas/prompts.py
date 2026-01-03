from pydantic import BaseModel
from typing import List, Optional


class PromtResponse(BaseModel):
    id: int
    chat_id: int
    type: str
    prompt: str
    response: str
    created_at: str
    