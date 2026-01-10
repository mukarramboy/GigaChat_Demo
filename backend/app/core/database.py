from app.database.connect import init_db, close_db

async def startup_db():
    await init_db()

async def shutdown_db():
    await close_db()
