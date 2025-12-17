from aiogram import Router, F
from aiogram.types import Message, BufferedInputFile
from states import Mode

import replicate
from io import BytesIO
from PIL import Image


router = Router()


@router.message(Mode.image, F.text)
async def image_handler(message: Message):
    loading_msg = await message.answer("🎨 Генерирую изображение...")

    try:
        result = replicate.run(
            "stability-ai/stable-diffusion-3.5-large-turbo",
            input={
                "prompt": message.text,
                "aspect_ratio": "16:9",
                "output_format": "jpg",
                "safety_filter_level": "block_medium_and_above",
            }
        )
        
        if hasattr(result, "read"):
            image_bytes = result.read()
        elif isinstance(result, list):
            image_bytes = result[0].read() if hasattr(result[0], "read") else result[0]
        else:
            image_bytes = result

        image = Image.open(BytesIO(image_bytes)).convert("RGB")

        buffer = BytesIO()
        image.save(buffer, format="JPEG", quality=90)
        buffer.seek(0)

        photo = BufferedInputFile(
            buffer.read(),
            filename="generated.jpg"
        )

        await message.answer_photo(photo)

    except Exception as e:
        await message.answer(
            f"❌ Ошибка генерации:\n<code>{e}</code>"
        )

    finally:
        await loading_msg.delete()
