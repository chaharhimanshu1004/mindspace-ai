import asyncio
from typing import Awaitable, Callable

from src.config import env
from src.connectors.stream_consumer import StreamConsumer, StreamMessage
from src.utils.logger import get_logger

logger = get_logger(__name__)

MessageHandler = Callable[[StreamMessage], Awaitable[None]]


class PELRecoveryWorker:
    def __init__(self, consumer: StreamConsumer, handler: MessageHandler) -> None:
        self._consumer = consumer
        self._handler = handler
        self._stop = asyncio.Event()

    def request_stop(self) -> None:
        self._stop.set()

    async def run(self) -> None:
        logger.info(
            "PEL recovery worker started (interval=%ds, min_idle=%ds) on stream '%s'",
            env.PEL_RECOVERY_INTERVAL_SECONDS,
            env.PEL_RECOVERY_MIN_IDLE_SECONDS,
            self._consumer.stream,
        )

        while not self._stop.is_set():
            await self._wait(env.PEL_RECOVERY_INTERVAL_SECONDS)
            if self._stop.is_set():
                break
            try:
                await self._sweep()
            except Exception:
                logger.exception("PEL recovery sweep failed; retrying next interval")

        logger.info("PEL recovery worker stopped")

    async def _sweep(self) -> None:
        reclaimed = await self._reclaim_all()
        if reclaimed:
            logger.info("PEL recovery worker reclaimed and reprocessed %d message(s)", reclaimed)

    async def _reclaim_all(self) -> int:
        min_idle_ms = env.PEL_RECOVERY_MIN_IDLE_SECONDS * 1000
        cursor = "0-0"
        total = 0

        while not self._stop.is_set():
            cursor, messages = await self._consumer.autoclaim(
                min_idle_ms=min_idle_ms,
                count=env.PEL_RECOVERY_BATCH_SIZE,
                start=cursor,
            )

            for message in messages:
                logger.warning(
                    "Reclaiming idle message %s (fields=%s)",
                    message.message_id,
                    dict(message.fields),
                )
                await self._handler(message)
                total += 1

            if not messages or cursor == "0-0":
                break

        return total

    async def _wait(self, seconds: int) -> None:
        try:
            await asyncio.wait_for(self._stop.wait(), timeout=seconds)
        except asyncio.TimeoutError:
            pass
