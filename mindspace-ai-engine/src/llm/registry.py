from src.config import env

from .gemini_provider import GeminiProvider
from .provider import LLMProvider


class LLMRegistry:
    _instances: dict[str, LLMProvider] = {}

    @classmethod
    def get(cls, name: str | None = None) -> LLMProvider:
        key = (name or env.LLM_PROVIDER).lower()
        if key in cls._instances:
            return cls._instances[key]

        provider = cls._build(key)
        cls._instances[key] = provider
        return provider

    @classmethod
    def _build(cls, key: str) -> LLMProvider:
        if key == "gemini":
            return GeminiProvider()
        raise ValueError(f"Unknown LLM provider: {key}")


def get_provider(name: str | None = None) -> LLMProvider:
    return LLMRegistry.get(name)
