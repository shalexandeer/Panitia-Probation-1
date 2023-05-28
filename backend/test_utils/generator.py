# cara menggunakan
# 1. run backend
# 2. run script ini
# 3. [optional] rubah N atau hilangkan tanda # pada "#@rate_limited(max_concurrent=2,duration=2)" dibawah

# kalo error, pip install Faker
from typing import List
from faker import Faker
import random
f=Faker()

# name, password, email, phone, address 

N=64 #jumlah fake account
table={
    "name":[],
    "password":[],
    "email":[],
    "phone":[],
    "address":[],
}
buffer = ''
def ready() -> List[dict[str,str]]:
    jsonl: List[dict[str,str]] = [] 
    for _ in range(N):
        name: str = f.name()
        password: str= f.password()
        email: str = f.email()
        phone: str = f.basic_phone_number()
        address: str =f.address()
        table={
            "username":name,
            "password":password,
            "email":email,
            "phone":phone,
            "typ":random.choice('UIC'),
            "address":address,
        }.copy()
        jsonl.append(table)
    return jsonl 

import asyncio
import aiohttp
import functools

def rate_limited(max_concurrent, duration):
    def decorator(func):
        semaphore = asyncio.Semaphore(max_concurrent)

        async def dequeue():
            try:
                await asyncio.sleep(duration)
            finally:
                semaphore.release()

        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            await semaphore.acquire()
            asyncio.create_task(dequeue())
            return await func(*args, **kwargs)

        return wrapper
    return decorator


#@rate_limited(max_concurrent=2,duration=2)
async def register(session: aiohttp.ClientSession, data: dict):
    async with session.post(
        "http://0.0.0.0:3030/register", 
        headers={"Content-Type":"application/json"},
        json=data
    ) as response:
        tmp = await response.json()
        print("done")
        return tmp

async def register_all(data_list: List[dict[str,str]],loop):
    async with aiohttp.ClientSession(loop=loop) as session:
        results = await asyncio.gather(*[register(session, data) for data in data_list], return_exceptions=True)
        return results

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    jsonl = ready() 
    output = loop.run_until_complete(register_all(jsonl, loop))
    print()
    print(output)
