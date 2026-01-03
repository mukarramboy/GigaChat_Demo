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
        await conn.execute(
            """
            INSERT INTO prompts (chat_id, type, prompt, response)
            VALUES ($1, $2, $3, $4)
            """,
            chat_id, prompt_type, prompt, response
        )


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
