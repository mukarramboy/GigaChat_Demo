import asyncpg
from config import DATABASE_URL

pool: asyncpg.Pool | None = None

async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL)
    return pool

async def init_db():
    pool = await get_pool()

    async with pool.acquire() as conn:

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)


        await conn.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id SERIAL PRIMARY KEY,
            user_id BIGINT REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );""")


        await conn.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prompt_type') THEN
                CREATE TYPE prompt_type AS ENUM ('text', 'image');
            END IF;
        END$$;
        """)

        await conn.execute("""
        CREATE TABLE IF NOT EXISTS prompts (
            id SERIAL PRIMARY KEY,
            chat_id INT REFERENCES chats(id),
            type prompt_type,
            prompt TEXT,
            response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

async def close_db():
    global pool
    if pool is not None:
        await pool.close()
        pool = None
