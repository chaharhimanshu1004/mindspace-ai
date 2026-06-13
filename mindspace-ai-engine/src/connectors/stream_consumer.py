from dataclasses import dataclass

from redis.exceptions import ResponseError

from src.db.redis import redis
from src.utils.logger import get_logger

logger = get_logger(__name__)


@dataclass(slots=True)
class StreamMessage:
    message_id: str
    fields: dict[str, str]


class StreamConsumer:
    def __init__(self, stream: str, group: str, consumer: str) -> None:
        self._stream = stream
        self._group = group
        self._consumer = consumer

    @property
    def stream(self) -> str:
        return self._stream

    @property
    def group(self) -> str:
        return self._group

    @property
    def consumer(self) -> str:
        return self._consumer

    async def ensure_group(self) -> None:
        try:
            await redis.xgroup_create(
                name=self._stream,
                groupname=self._group,
                id="$",
                mkstream=True,
            )
            logger.info(
                "Created consumer group '%s' on stream '%s'",
                self._group,
                self._stream,
            )
        except ResponseError as e:
            if "BUSYGROUP" in str(e):
                return
            raise

    async def read_one(self, block_ms: int) -> StreamMessage | None:
        result = await redis.xreadgroup(
            groupname=self._group,
            consumername=self._consumer,
            streams={self._stream: ">"},
            count=1,
            block=block_ms,
        )

        if not result:
            return None

        _stream_name, entries = result[0]
        if not entries:
            return None

        message_id, fields = entries[0]
        return StreamMessage(message_id=message_id, fields=dict(fields))

    async def autoclaim(
        self, min_idle_ms: int, count: int, start: str = "0-0"
    ) -> tuple[str, list[StreamMessage]]:
        response = await redis.xautoclaim(
            name=self._stream,
            groupname=self._group,
            consumername=self._consumer,
            min_idle_time=min_idle_ms,
            start_id=start,
            count=count,
        )
        cursor = response[0]
        entries = response[1] if len(response) > 1 else []
        messages = [
            StreamMessage(message_id=message_id, fields=dict(fields))
            for message_id, fields in entries
        ]
        return cursor, messages

    async def ack(self, message_id: str) -> None:
        await redis.xack(self._stream, self._group, message_id)

    async def delivery_count(self, message_id: str) -> int:
        result = await redis.xpending_range(
            name=self._stream,
            groupname=self._group,
            min=message_id,
            max=message_id,
            count=1,
        )
        if not result:
            return 0
        return int(result[0]["times_delivered"])
