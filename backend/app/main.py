from fastapi import FastAPI

from app.core.database import startup_db, shutdown_db
from app.api.v1.chats import router as chats_router

app = FastAPI()

app.add_event_handler("startup", startup_db)
app.add_event_handler("shutdown", shutdown_db)

app.include_router(chats_router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"Hello": "World"}