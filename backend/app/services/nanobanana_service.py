import aiohttp
import asyncio
from typing import Optional

class NanoBananaAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://api.nanobananaapi.ai/api/v1/nanobanana'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        self._session: Optional[aiohttp.ClientSession] = None

    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()

    async def generate_image(
        self,
        prompt: str,
        type: str = "TEXTTOIAMGE", 
        numImages: int = 1,
    ) -> str:
        payload = {"prompt": prompt, "type": type}

        if numImages and 1 <= numImages <= 4:
            payload["numImages"] = numImages

        session = await self._get_session()
        async with session.post(f"{self.base_url}/generate", headers=self.headers, json=payload) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise Exception(f"API request failed with status {resp.status}: {text}")
            result = await resp.json()
            if result.get("code") != 200:
                raise Exception(f"Generation failed: {result.get('msg', 'Unknown error')}")
            task_id = result.get("data", {}).get("taskId")
            if not task_id:
                raise Exception("Failed to create image generation task")
            return task_id

    async def get_task_status(self, task_id: str) -> dict:
        url = f"{self.base_url}/record-info?taskId={task_id}"
        session = await self._get_session()
        async with session.get(url, headers=self.headers) as resp:
            if resp.status != 200:
                text = await resp.text()
                raise Exception(f"API request failed with status {resp.status}: {text}")
            return await resp.json()

    async def wait_for_completion(self,task_id: str,timeout: int = 60, interval: int = 3
    ) -> str:
        loop = asyncio.get_event_loop()
        start_time = loop.time()

        while loop.time() - start_time < timeout:
            status = await self.get_task_status(task_id)
            
            data = status.get("data", {})
            success_flag = data.get("successFlag", 0)

            if success_flag == 0:
                await asyncio.sleep(3)
                continue

            if success_flag == 1:
                response = data.get("response", {})
                
                # Пробуем разные возможные поля для URL
                image_url = (
                    response.get("resultImageUrl") or 
                    response.get("imageUrl") or 
                    response.get("url") or
                    data.get("resultImageUrl") or
                    data.get("imageUrl")
                )
                
                if not image_url:
                    raise Exception(f"Image URL not found in response. Available fields: {list(response.keys())}")
                
                return image_url

            raise Exception(data.get("errorMessage", "Generation failed"))

        raise Exception("Generation timeout")