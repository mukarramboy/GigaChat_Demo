from fastapi import APIRouter, HTTPException
from app.services.nanobanana_service import NanoBananaAPI
from app.services.promt_service import add_prompt
from app.schemas.prompts import PromptCreateRequest, PromtResponse
from app.core.config import NANO_BANANA_API_KEY

router = APIRouter(
    prefix="/prompts",
    tags=["Prompts"],
)

nano_api = NanoBananaAPI(NANO_BANANA_API_KEY)


@router.post("/generate_image", response_model=PromtResponse)
async def generate_image_endpoint(request: PromptCreateRequest):
    """
    Генерирует изображение и возвращает результат сразу
    (без callback URL)
    """
    try:
        task_id = await nano_api.generate_image(
            prompt=request.prompt,
            numImages=1
        )
        image_url = await nano_api.wait_for_completion(task_id)

        if not image_url:
            raise HTTPException(status_code=500, detail="Image URL not found")

        request.type = "image"
        prompt_record = await add_prompt(request, image_url)

        return prompt_record

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
