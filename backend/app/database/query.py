from .connect import get_pool


async def save_user(user_id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING",
            user_id
        )

async def create_chat(user_id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():

            # ✅ avval user bo‘lsin
            await conn.execute(
                "INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING",
                user_id
            )

            chat_id = await conn.fetchval(
                "INSERT INTO chats (user_id) VALUES ($1) RETURNING id",
                user_id
            )

    return chat_id



async def save_prompt(chat_id: int, prompt_type: str, prompt: str, response: str):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO prompts (chat_id, type, prompt, response)
            VALUES ($1, $2, $3, $4)
            RETURNING id, chat_id, type, prompt, response, created_at
            """,
            chat_id, prompt_type, prompt, response
        )
    return {
        "id": row["id"],
        "chat_id": row["chat_id"],
        "type": row["type"],
        "prompt": row["prompt"],
        "response": row["response"],
        "created_at": row["created_at"]
    }


async def get_user_chats(user_id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, created_at
            FROM chats
            WHERE user_id = $1
            ORDER BY created_at DESC
            """,
            user_id
        )
    return [
        {
            "chat_id": row["id"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]

async def get_chat_prompts(chat_id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT id, chat_id, type, prompt, response, created_at
            FROM prompts
            WHERE chat_id = $1
            ORDER BY created_at ASC
            """,
            chat_id
        )
    return [
        {
            "id": row["id"],
            "chat_id": row["chat_id"],
            "type": row["type"],
            "prompt": row["prompt"],
            "response": row["response"],
            "created_at": row["created_at"]
        }
        for row in rows
    ]


async def delete_chat(chat_id: int, user_id: int) -> str:
    """
    Удаляет чат и все связанные промпты.
    Возвращает:
        - "deleted" если чат был удален
        - "not_found" если чат не найден
        - "forbidden" если чат принадлежит другому пользователю
    """
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Проверяем существование чата и его владельца
        chat = await conn.fetchrow(
            "SELECT user_id FROM chats WHERE id = $1",
            chat_id
        )
        
        if chat is None:
            return "not_found"
        
        if chat["user_id"] != user_id:
            return "forbidden"
        
        async with conn.transaction():
            # Сначала удаляем все промпты этого чата
            await conn.execute(
                "DELETE FROM prompts WHERE chat_id = $1",
                chat_id
            )
            # Затем удаляем сам чат
            await conn.execute(
                "DELETE FROM chats WHERE id = $1",
                chat_id
            )
            return "deleted"