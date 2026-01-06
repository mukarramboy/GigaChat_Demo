from fastapi import HTTPException
from app.schemas.prompts import PromtResponse, PromptCreateRequest
from app.database.query import save_prompt
import aiohttp
import aiohttp 
from app.core.config import NANO_BANANA_API_KEY


async def add_prompt(request: PromptCreateRequest, response: str) -> PromtResponse:
    prompt_record = await save_prompt(
        chat_id=request.chat_id,
        prompt_type=request.type,
        prompt=request.prompt,
        response=response
    )
    if not prompt_record:
        raise HTTPException(status_code=500, detail="Failed to save prompt in database")

    return PromtResponse(**prompt_record)
