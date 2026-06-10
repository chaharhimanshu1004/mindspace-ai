import asyncio
import os
import socket
from uuid import UUID, uuid4

from src.config import env
from src.connectors.stream_consumer import StreamConsumer, StreamMessage
from src.db.postgres import SessionFactory
from src.db.redis import redis
from src.models import Memory, MemoryStatus
from src.schemas.enrich_job import EnrichJobPayload
from src.services.calendar_service import sync_calendar_event
from src.services.embed_service import EmbedResult, EmbedService
from src.services.enrichment_service import EnrichmentBundle, EnrichmentService
from src.services.integration_repo import IntegrationRepo
from src.services.memory_service import MemoryService
from src.utils.logger import get_logger
from src.utils.stream_keys import ConsumerGroups, StreamKeys

logger = get_logger(__name__)


def _consumer_name() -> str:
    return f"worker-{socket.gethostname()}-{os.getpid()}-{uuid4().hex[:6]}"


class EnrichmentWorker:
    def __init__(self) -> None:
        self._consumer = StreamConsumer(
            stream=StreamKeys.MEMORY_ENRICH.value,
            group=ConsumerGroups.AI_ENGINE.value,
            consumer=_consumer_name(),
        )
        self._stop = asyncio.Event()

    @property
    def consumer_name(self) -> str:
        return self._consumer.consumer

    @property
    def consumer(self) -> StreamConsumer:
        return self._consumer

    def request_stop(self) -> None:
        self._stop.set()

    async def run(self) -> None:
        await self._consumer.ensure_group()
        logger.info(
            "Enrichment worker started as '%s' on stream '%s'",
            self._consumer.consumer,
            self._consumer.stream,
        )

        loop_count = 0
        while not self._stop.is_set():
            loop_count += 1
            logger.info("[loop %d] XREADGROUP block=%dms", loop_count, env.STREAM_BLOCK_MS)
            try:
                message = await self._consumer.read_one(block_ms=env.STREAM_BLOCK_MS)
            except Exception:
                logger.exception("Failed to read from stream; backing off 1s")
                await asyncio.sleep(1.0)
                continue

            if message is None:
                logger.info("[loop %d] no message (timeout)", loop_count)
                continue

            logger.info(
                "Received message id=%s fields=%s",
                message.message_id,
                dict(message.fields),
            )
            await self.handle(message)

        logger.info("Enrichment worker stopped")

    async def handle(self, message: StreamMessage) -> None:
        try:
            payload = EnrichJobPayload.from_stream_fields(message.fields)
        except Exception:
            logger.exception(
                "Invalid payload on %s; dead-lettering message %s",
                self._consumer.stream,
                message.message_id,
            )
            await self._dead_letter(message, reason="invalid-payload")
            await self._consumer.ack(message.message_id)
            return

        try:
            async with asyncio.timeout(env.STAGE_TIMEOUT_SECONDS):
                await self._process(payload)
            await self._consumer.ack(message.message_id)
        except asyncio.TimeoutError:
            logger.error(
                "Processing timed out (>%ds) for memory %s (message %s)",
                env.STAGE_TIMEOUT_SECONDS,
                payload.memoryId,
                message.message_id,
            )
            await self._maybe_dead_letter(message, payload)
        except Exception:
            logger.exception(
                "Processing failed for memory %s (message %s)",
                payload.memoryId,
                message.message_id,
            )
            await self._maybe_dead_letter(message, payload)

    async def _process(self, payload: EnrichJobPayload) -> None:
        snapshot = await self._claim(payload)
        if snapshot is None:
            return

        memory_id, user_id, content, source_type, tz_name = snapshot

        await self._run_stage_a(memory_id=memory_id, user_id=user_id, content=content, source_type=source_type)
        await self._run_stage_b(memory_id=memory_id, user_id=user_id, content=content, source_type=source_type, tz_name=tz_name)

        logger.info("Processing memory %s — done", memory_id)

    async def _run_stage_b(
        self, memory_id: UUID, user_id: int, content: str, source_type: str, tz_name: str
    ) -> None:
        if await self._stage_already_done(memory_id, MemoryStatus.ENRICHED):
            logger.info("Memory %s — Stage B already done; skipping", memory_id)
            return
        logger.info("Memory %s — Stage B: enrich (source_type=%s)", memory_id, source_type)
        bundle = await EnrichmentService.enrich(content=content, source_type=source_type, tz_name=tz_name)
        logger.info(
            "Memory %s — Stage B enrich done (model=%s, entities=%d)",
            memory_id,
            bundle.model,
            len(bundle.result.entities),
        )

        calendar_event = await self._write_enrichment(
            memory_id=memory_id, user_id=user_id, bundle=bundle
        )
        logger.info("Memory %s — Stage B persisted (status=enriched)", memory_id)

        await sync_calendar_event(
            user_id=user_id,
            event=calendar_event,
            tz_name=tz_name,
        )

    _SKIP_STATUSES = frozenset({MemoryStatus.FAILED.value})
    _ALREADY_PROCESSED = frozenset(
        {MemoryStatus.ENRICHED.value, MemoryStatus.LINKED.value}
    )

    async def _reset_to_pending(self, memory_id: UUID) -> None:
        async with SessionFactory() as session, session.begin():
            await MemoryService.set_status(session, memory_id, MemoryStatus.PENDING)

    async def _claim(
        self, payload: EnrichJobPayload
    ) -> tuple[UUID, int, str, str, str] | None:
        async with SessionFactory() as session:
            memory = await MemoryService.get(session, payload.memoryId, payload.userId)

            if memory is None:
                logger.info(
                    "Memory %s not found for user %s; skipping",
                    payload.memoryId,
                    payload.userId,
                )
                return None

            if memory.status in self._SKIP_STATUSES:
                logger.info(
                    "Memory %s in skip status '%s'; skipping",
                    memory.id,
                    memory.status,
                )
                return None

            needs_reset = memory.status in self._ALREADY_PROCESSED

            from src.utils.credentials import decrypt_credentials
            integration = await IntegrationRepo.get_google_calendar(session, memory.user_id)
            tz_name: str = "Asia/Kolkata"
            if integration:
                try:
                    creds = decrypt_credentials(integration.credentials)
                    tz_name = creds.get("timezone", "Asia/Kolkata")
                except Exception:
                    pass

            snapshot = (
                memory.id,
                memory.user_id,
                memory.content,
                memory.source_type,
                tz_name,
            )

        if needs_reset:
            await self._reset_to_pending(snapshot[0])
            logger.info(
                "Memory %s was already processed; reset to pending for re-processing",
                snapshot[0],
            )

        return snapshot

    async def _run_stage_a(
        self, memory_id: UUID, user_id: int, content: str, source_type: str = "user_text"
    ) -> None:
        if await self._stage_already_done(memory_id, MemoryStatus.EMBEDDED):
            logger.info("Memory %s — Stage A already done; skipping", memory_id)
            return
        logger.info(
            "Memory %s — Stage A: embed (content_len=%d, source_type=%s)", memory_id, len(content), source_type
        )
        result = await EmbedService.embed(content=content, source_type=source_type)
        logger.info(
            "Memory %s — Stage A embed done (model=%s, chunks=%d)",
            memory_id,
            result.model,
            len(result.chunks),
        )

        await self._write_embed(memory_id=memory_id, user_id=user_id, result=result)
        logger.info("Memory %s — Stage A persisted (status=embedded)", memory_id)

    _STATUS_ORDER = (
        MemoryStatus.PENDING.value,
        MemoryStatus.EMBEDDED.value,
        MemoryStatus.ENRICHED.value,
        MemoryStatus.LINKED.value,
    )

    async def _stage_already_done(
        self, memory_id: UUID, at_least: MemoryStatus
    ) -> bool:
        async with SessionFactory() as session:
            memory = await session.get(Memory, memory_id)
            if memory is None:
                return False
            try:
                return self._STATUS_ORDER.index(memory.status) >= self._STATUS_ORDER.index(at_least.value)
            except ValueError:
                return False

    async def _write_embed(
        self,
        memory_id: UUID,
        user_id: int,
        result: EmbedResult,
    ) -> None:
        async with SessionFactory() as session, session.begin():
            await EmbedService.persist(
                session=session,
                memory_id=memory_id,
                user_id=user_id,
                result=result,
            )

    async def _write_enrichment(
        self,
        memory_id: UUID,
        user_id: int,
        bundle: EnrichmentBundle,
    ) -> "CalendarEvent":
        from src.schemas.enrichment_result import CalendarEvent
        async with SessionFactory() as session, session.begin():
            return await EnrichmentService.persist(
                session=session,
                memory_id=memory_id,
                user_id=user_id,
                bundle=bundle,
            )

    async def _maybe_dead_letter(
        self,
        message: StreamMessage,
        payload: EnrichJobPayload,
    ) -> None:
        try:
            deliveries = await self._consumer.delivery_count(message.message_id)
        except Exception:
            logger.exception("Could not read delivery count; leaving message in PEL")
            return

        if deliveries < env.MAX_DELIVERIES:
            logger.warning(
                "Memory %s will be retried (deliveries=%d/%d)",
                payload.memoryId,
                deliveries,
                env.MAX_DELIVERIES,
            )
            return

        await self._dead_letter(message, reason="max-deliveries-exceeded")
        await self._mark_failed(payload)
        await self._consumer.ack(message.message_id)

    async def _dead_letter(self, message: StreamMessage, reason: str) -> None:
        fields = dict(message.fields)
        fields["originalId"] = message.message_id
        fields["reason"] = reason
        await redis.xadd(StreamKeys.MEMORY_ENRICH_DEAD.value, fields)
        logger.error(
            "Dead-lettered message %s to %s (reason=%s)",
            message.message_id,
            StreamKeys.MEMORY_ENRICH_DEAD.value,
            reason,
        )

    async def _mark_failed(self, payload: EnrichJobPayload) -> None:
        try:
            async with SessionFactory() as session, session.begin():
                await MemoryService.set_status(session, payload.memoryId, MemoryStatus.FAILED)
        except Exception:
            logger.exception("Failed to mark memory %s as failed", payload.memoryId)
