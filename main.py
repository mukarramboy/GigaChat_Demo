import aiohttp, asyncio

async def test():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.nanobanana.ai") as resp:
            print(resp.status)
            print(await resp.text())

asyncio.run(test())
