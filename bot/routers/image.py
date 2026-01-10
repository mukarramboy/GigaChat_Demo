from aiogram import Router, F
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from states import Mode
from config import NANO_BANANA_API_KEY
import aiohttp
import asyncio

from database.query import save_prompt

router = Router()

GENERATE_URL = "https://api.nanobananaapi.ai/api/v1/nanobanana/generate"
STATUS_URL = "https://api.nanobananaapi.ai/api/v1/nanobanana/record-info"


async def wait_for_image(session, task_id, timeout=60):
    start = asyncio.get_event_loop().time()
    
    while True:
        async with session.get(
            f"{STATUS_URL}?taskId={task_id}",
            headers={"Authorization": f"Bearer {NANO_BANANA_API_KEY}"}
        ) as resp:
            data = await resp.json()
            data_content = data.get("data") or {}        # <- безопасно
            response = data_content.get("response") or {}  # <- безопасно

            # Если изображение готово — возвращаем URL
            result_url = response.get("resultImageUrl")
            if result_url:
                return result_url

            # Если есть явная ошибка
            if data_content.get("errorCode"):
                raise RuntimeError(f"Generation failed: {data_content.get('errorMessage', 'Unknown error')}")

        # Проверка таймаута
        if asyncio.get_event_loop().time() - start > timeout:
            raise TimeoutError("Превышено время ожидания генерации изображения")

        await asyncio.sleep(2)


@router.message(Mode.image, F.text)
async def image_handler(message: Message,state: FSMContext):
    """
    Хэндлер для генерации изображения по текстовому промту через Nanobanana.
    """

    data = await state.get_data()
    chat_id = data.get("chat_id")

    loading_msg = await message.answer("🎨 Генерирую изображение...")

    try:
        async with aiohttp.ClientSession() as session:
            # 1️⃣ Создаём задачу генерации
            async with session.post(
                GENERATE_URL,
                headers={
                    "Authorization": f"Bearer {NANO_BANANA_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "prompt": message.text,
                    "numImages": 1,
                    "type": "TEXTTOIAMGE",
                    "image_size": "16:9"
                }
            ) as resp:
                result = await resp.json()

            task_id = result["data"]["taskId"]

            # 2️⃣ Ждём завершения генерации
            image_url = await wait_for_image(session, task_id, timeout=60)

        # 3️⃣ Отправляем пользователю
        await message.answer_photo(photo=image_url, caption="🖼 Готово!")

        await save_prompt(
            chat_id=chat_id,
            prompt_type="image",
            prompt=message.text,
            response=image_url
        )

    except TimeoutError:
        await message.answer("⏱ Превышено время ожидания генерации изображения. Попробуйте снова.")

    except Exception as e:
        await message.answer(f"❌ Ошибка генерации изображения: {e}")

    finally:
        await loading_msg.delete()
