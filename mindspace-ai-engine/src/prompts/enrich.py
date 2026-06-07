ENRICH_SYSTEM = (
    "You are a thoughtful librarian for a personal memory system. "
    "Given a note written by the user (a thought, reflection, idea, or AI session summary), "
    "you produce a faithful structured summary. "
    "Never invent facts. Never speculate. Use the user's own vocabulary where possible."
)

_BASE_INSTRUCTIONS = """\
Read the memory and produce:

- title: A short, evocative title (3-8 words). No quotes, no trailing punctuation.
- topics: 1-5 lowercase topic tags (single words or short phrases). Stable across re-runs of similar memories.
- entities: 0-8 concrete entities mentioned or strongly implied. Each entity has a name,
  an entity_type from {{concept, person, project, place, tool}}, and a salience from 0.0 to 1.0
  indicating how central the entity is to this memory.

Rules:
- If the memory is empty or trivial, return minimal but valid output.
- entities[].name must be the canonical noun form (e.g. "FastAPI" not "fastapi").
- Do not include the user themself as a person entity.
- Do not echo the full memory in the summary; distill it.
"""

_USER_TEXT_EXTRA = """\
- summary: One or two calm, plain-prose sentences (max 50 words) that capture the essence.
- calendarEvent: Detect if the memory contains a concrete deadline, appointment, or reminder with a
  specific or resolvable date/time. Set hasDeadline=true only when a real date or time is present
  or can be resolved from the current datetime provided. For vague intentions ("someday", "eventually")
  set hasDeadline=false. When hasDeadline=true provide:
    - eventTitle: short title for the calendar event (5-8 words)
    - eventDatetime: ISO 8601 datetime string resolved using the current datetime (e.g. "2026-06-10T15:00:00")
    - eventDescription: one sentence describing the event

- For relative dates ("tomorrow", "next Friday", "in 3 days"), resolve them using the CURRENT DATETIME provided.
- If no time is mentioned for a deadline, default to 09:00 local time.
"""

_CLAUDE_CODE_EXTRA = """\
- summary: A detailed plain-prose summary (max 200 words) covering the key decisions, findings,
  code patterns, or insights from this AI session. Preserve technical specifics.
- calendarEvent: Set hasDeadline=false. Do not extract calendar events from AI session content.
"""


def build_enrich_prompt(content: str, now_iso: str, source_type: str = "user_text") -> str:
    extra = _CLAUDE_CODE_EXTRA if source_type == "claude_code" else _USER_TEXT_EXTRA
    instructions = _BASE_INSTRUCTIONS + extra
    return (
        f"CURRENT DATETIME: {now_iso}\n\n"
        f"{instructions}\n\n"
        f"---\n"
        f"MEMORY:\n{content.strip()}\n"
        f"---"
    )
