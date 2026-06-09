ENRICH_SYSTEM = (
    "You are a thoughtful librarian for a personal memory system. "
    "Given a memory (a user's own thought, an AI session summary, or a Slack conversation transcript), "
    "you produce a faithful structured summary. "
    "Never invent facts. Never speculate. Use the original vocabulary where possible."
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

_SLACK_EXTRA = """\
This memory is a Slack conversation transcript. Each line is formatted "Name: message text".
Multiple humans are talking. Treat their words as reported speech, never as the user's own thoughts.

The conversation took place around the CURRENT DATETIME provided above. When the transcript uses
relative time references ("today", "tomorrow", "next week", "in 2 days", "EOD", "this Friday",
"yesterday"), resolve them to absolute dates using that CURRENT DATETIME and use the absolute
form in your summary. For example, if CURRENT DATETIME is 2026-06-09 and the transcript says
"tomorrow's deployment", your summary should say "the June 10 deployment".

- title: Name the topic of the conversation, not the participants. 3-8 words. No quotes.
- summary: 2-3 plain-prose sentences (max 80 words) that capture: what was discussed, what was
  decided or concluded (if anything), and any unresolved question or follow-up. Resolve all
  relative time references to absolute dates. Mention people by name only when a specific person
  did or said something notable; otherwise describe collectively ("the team", "they"). Do not
  transcribe — distill.
- topics: 1-5 lowercase topic tags reflecting subjects raised in the conversation.
- entities: extract people mentioned by name (entity_type=person), projects, tools, concepts.
  Include speakers as person entities only when they materially shaped the conversation.
- calendarEvent: Set hasDeadline=false. Do not extract calendar events from Slack conversations
  even if a date is mentioned — those are team coordination, not personal commitments.
"""


def _extra_for(source_type: str) -> str:
    if source_type == "claude_code":
        return _CLAUDE_CODE_EXTRA
    if source_type == "slack":
        return _SLACK_EXTRA
    return _USER_TEXT_EXTRA


def build_enrich_prompt(content: str, now_iso: str, source_type: str = "user_text") -> str:
    instructions = _BASE_INSTRUCTIONS + _extra_for(source_type)
    return (
        f"CURRENT DATETIME: {now_iso}\n\n"
        f"{instructions}\n\n"
        f"---\n"
        f"MEMORY:\n{content.strip()}\n"
        f"---"
    )
