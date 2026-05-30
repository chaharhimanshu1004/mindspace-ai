from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(slots=True)
class EmbedRequest:
    texts: list[str]
    model: str | None = None


@dataclass(slots=True)
class EmbedResponse:
    vectors: list[list[float]]
    model: str
    dim: int


@dataclass(slots=True)
class CompleteRequest:
    prompt: str
    model: str | None = None
    system: str | None = None
    temperature: float = 0.2
    max_output_tokens: int | None = None


@dataclass(slots=True)
class CompleteResponse:
    text: str
    model: str


class LLMProvider(ABC):
    name: str

    @abstractmethod
    async def embed(self, req: EmbedRequest) -> EmbedResponse:
        ...

    @abstractmethod
    async def complete(self, req: CompleteRequest) -> CompleteResponse:
        ...
