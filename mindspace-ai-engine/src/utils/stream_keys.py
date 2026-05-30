from enum import StrEnum


class StreamKeys(StrEnum):
    MEMORY_ENRICH = "memory.enrich"
    MEMORY_ENRICH_DEAD = "memory.enrich.dead"


class ConsumerGroups(StrEnum):
    AI_ENGINE = "ai-engine"
