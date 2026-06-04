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

    calendar_event_schema: dict[str, Any] = {
        "type": "OBJECT",
        "properties": {
            "hasDeadline": {"type": "BOOLEAN"},
            "eventTitle": {"type": "STRING"},
            "eventDatetime": {"type": "STRING"},
            "eventDescription": {"type": "STRING"},
        },
        "required": ["hasDeadline"],
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
            "calendarEvent": calendar_event_schema,
        },
        "required": ["title", "summary", "topics", "entities", "calendarEvent"],
    }
