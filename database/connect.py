import asyncpg
from config import DATABASE_URL

pool: asyncpg.Pool | None = None

async def get_pool() -> asyncpg.Pool:
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            user='postgres',
            password='12345',
            database='gigachat_db',
            host='localhost',
            port=5432
        )
    return pool

async def init_db():
    global pool
    pool = await asyncpg.create_pool(
        user = 'postgres',
        password = '12345',
        database = 'gigachat_db',
        host = 'localhost',
        port = 5432
    )

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
        CREATE TABLE IF NOT EXISTS promts (
            id SERIAL PRIMARY KEY,
            chat_id INT REFERENCES chats(id),
            type ENUM('text', 'image'),
            prompt TEXT,
            response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );""")