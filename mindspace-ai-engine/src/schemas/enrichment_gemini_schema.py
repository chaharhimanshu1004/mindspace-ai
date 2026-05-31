from typing import Any

from .enrichment_result import EntityType


def build_enrichment_gemini_schema() -> dict[str, Any]:
    entity_schema: dict[str, Any] = {
        "type": "OBJECT",
        "properties": {
            "name": {"type": "STRING"},
            "entityType": {
                "type": "STRING",
                "enum": [e.value for e in EntityType],
            },
            "salience": {"type": "NUMBER"},
        },
        "required": ["name", "entityType", "salience"],
    }

    return {
        "type": "OBJECT",
        "properties": {
            "title": {"type": "STRING"},
            "summary": {"type": "STRING"},
            "topics": {
                "type": "ARRAY",
                "items": {"type": "STRING"},
            },
            "entities": {
                "type": "ARRAY",
                "items": entity_schema,
            },
        },
        "required": ["title", "summary", "topics", "entities"],
    }
