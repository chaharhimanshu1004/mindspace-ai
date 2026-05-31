import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from src.db.postgres import dispose_postgres, ping_postgres
from src.db.redis import dispose_redis, ping_redis
from src.routes.internal_search import router as internal_search_router
from src.utils.logger import get_logger, setup_logging
from src.workers.enrichment_worker import EnrichmentWorker

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    setup_logging()
    await ping_postgres()
    await ping_redis()

    worker = EnrichmentWorker()
    task = asyncio.create_task(worker.run(), name="enrichment-worker")
    app.state.worker = worker
    app.state.worker_task = task
    logger.info("Lifespan: enrichment worker scheduled")

    try:
        yield
    finally:
        logger.info("Lifespan: shutting down")
        worker.request_stop()
        try:
            await asyncio.wait_for(task, timeout=10)
        except asyncio.TimeoutError:
            logger.warning("Worker did not stop in time; cancelling")
            task.cancel()
        await dispose_redis()
        await dispose_postgres()


def create_app() -> FastAPI:
    app = FastAPI(title="mindspace-ai-engine", lifespan=lifespan)

    @app.get("/health")
    async def health() -> dict[str, str]:
        worker = getattr(app.state, "worker", None)
        return {
            "status": "ok",
            "worker": worker.consumer_name if worker else "not-started",
        }

    app.include_router(internal_search_router)

    return app
