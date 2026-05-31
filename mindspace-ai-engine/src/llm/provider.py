from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Generic, TypeVar

from pydantic import BaseModel


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


T = TypeVar("T", bound=BaseModel)


@dataclass(slots=True)
class StructuredRequest(Generic[T]):
    prompt: str
    schema: type[T]
    wire_schema: object | None = None
    model: str | None = None
    system: str | None = None
    temperature: float = 0.2
    max_output_tokens: int | None = None


@dataclass(slots=True)
class StructuredResponse(Generic[T]):
    parsed: T
    model: str


class LLMProvider(ABC):
    name: str

    @abstractmethod
    async def embed(self, req: EmbedRequest) -> EmbedResponse:
        ...

    @abstractmethod
    async def complete(self, req: CompleteRequest) -> CompleteResponse:
        ...

    @abstractmethod
    async def complete_structured(self, req: StructuredRequest[T]) -> StructuredResponse[T]:
        ...
