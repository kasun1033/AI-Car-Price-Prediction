from ..db.redis import redis

WINDOW_SECONDS = 60
DEFAULT_MAX_ATTEMPTS = 3

# identifier: unique identifier for the request (ip address)
async def rate_limit(identifier: str, max_attempts: int = DEFAULT_MAX_ATTEMPTS) -> bool:
    key = f"rate_limit:{identifier}"

    attempts = await redis.incr(key)

    # set ttl only when key is first created
    if attempts == 1:
        await redis.expire(key, WINDOW_SECONDS)

    return attempts <= max_attempts