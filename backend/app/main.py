from fastapi import FastAPI

from app.core.database import startup_db, shutdown_db
from app.api.v1.chats import router as chats_router
from app.api.v1.prompts import router as prompts_router

app = FastAPI()

app.add_event_handler("startup", startup_db)
app.add_event_handler("shutdown", shutdown_db)

app.include_router(chats_router, prefix="/api/v1")
app.include_router(prompts_router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"code":200,"msg":"success","data":{"taskId":"933259930a1fc855a4e3835b7c60a028","paramJson":"{\"numImages\":1,\"prompt\":\"O‘rta asr shahar, tor ko‘chalar, ba’zi binolar ustida sehrli chaqnashlar, odamlar kundalik ishlar bilan band, realistik yorug‘lik, kinocha atmosfera, tafsilotlar juda aniq\",\"type\":\"TEXTTOIAMGE\"}","completeTime":"2026-01-06 08:17:04","response":{"originImageUrl":"null","resultImageUrl":"https://tempfile.aiquickdraw.com/workers/nano/image_1767658623526_gq6m8x.png"},"successFlag":1,"errorCode":"null","errorMessage":"null","operationType":"nanobanana_TEXTTOIAMGE","createTime":"2026-01-06 08:16:56"}}
