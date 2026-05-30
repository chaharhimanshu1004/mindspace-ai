import math

from google import genai
from google.genai import types as gtypes

from src.config import env

from .provider import (
    CompleteRequest,
    CompleteResponse,
    EmbedRequest,
    EmbedResponse,
    LLMProvider,
)


def _l2_normalize(vector: list[float]) -> list[float]:
    norm = math.sqrt(sum(v * v for v in vector))
    if norm == 0.0:
        return vector
    return [v / norm for v in vector]


class GeminiProvider(LLMProvider):
    name = "gemini"

    def __init__(self) -> None:
        self._client = genai.Client(api_key=env.GEMINI_API_KEY)
        self._default_chat = env.GEMINI_CHAT_MODEL
        self._default_embed = env.GEMINI_EMBED_MODEL

    async def embed(self, req: EmbedRequest) -> EmbedResponse:
        model = req.model or self._default_embed

        config = gtypes.EmbedContentConfig(
            output_dimensionality=env.EMBED_DIM,
        )
        result = await self._client.aio.models.embed_content(
            model=model,
            contents=req.texts,
            config=config,
        )

        vectors = [list(item.values or []) for item in (result.embeddings or [])]
        if not vectors or any(len(v) == 0 for v in vectors):
            raise RuntimeError(f"Gemini returned no embeddings for model {model}")

        normalized = [_l2_normalize(v) for v in vectors]
        return EmbedResponse(vectors=normalized, model=model, dim=len(normalized[0]))

    async def complete(self, req: CompleteRequest) -> CompleteResponse:
        model = req.model or self._default_chat

        config = gtypes.GenerateContentConfig(
            temperature=req.temperature,
            max_output_tokens=req.max_output_tokens,
            system_instruction=req.system,
        )
        result = await self._client.aio.models.generate_content(
            model=model,
            contents=req.prompt,
            config=config,
        )

        text = (result.text or "").strip()
        if not text:
            raise RuntimeError(f"Gemini returned empty completion for model {model}")

        return CompleteResponse(text=text, model=model)
