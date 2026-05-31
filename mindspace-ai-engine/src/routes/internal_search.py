from fastapi import APIRouter, Depends

from src.config import env
from src.db.postgres import SessionFactory
from src.middlewares.internal_auth import require_internal_token
from src.schemas.search import SearchRequest, SearchResponse
from src.services.search_service import SearchService

router = APIRouter(prefix="/internal", tags=["internal"])


@router.post(
    "/search",
    response_model=SearchResponse,
    dependencies=[Depends(require_internal_token)],
)
async def internal_search(req: SearchRequest) -> SearchResponse:
    limit = min(req.limit, env.SEARCH_TOP_K)
    async with SessionFactory() as session:
        hits = await SearchService.search(
            session=session,
            user_id=req.user_id,
            query=req.query,
            limit=limit,
        )
    return SearchResponse(hits=hits)
