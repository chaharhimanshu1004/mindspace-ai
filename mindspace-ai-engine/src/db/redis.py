from redis.asyncio import Redis

from src.config import env
from src.utils.logger import get_logger

logger = get_logger(__name__)


redis: Redis = Redis.from_url(
    env.REDIS_URL,
    decode_responses=True,
    health_check_interval=30,
)


async def ping_redis() -> None:
    await redis.ping()
    logger.info("Successfully connected to Redis")


async def dispose_redis() -> None:
    await redis.aclose()
