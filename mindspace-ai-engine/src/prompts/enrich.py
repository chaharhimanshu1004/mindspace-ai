ENRICH_SYSTEM = (
    "You are a thoughtful librarian for a personal memory system. "
    "Given a short note written by the user (a thought, reflection, or idea), "
    "you produce a small, faithful structured summary. "
    "Never invent facts. Never speculate. Use the user's own vocabulary where possible."
)


ENRICH_INSTRUCTIONS = """\
Read the memory and produce:

- title: A short, evocative title (3-8 words). No quotes, no trailing punctuation.
- summary: One or two calm, plain-prose sentences (max 50 words) that capture the essence.
- topics: 1-5 lowercase topic tags (single words or short phrases). Stable across re-runs of similar memories.
- entities: 0-8 concrete entities mentioned or strongly implied. Each entity has a name,
  an entity_type from {concept, person, project, place, tool}, and a salience from 0.0 to 1.0
  indicating how central the entity is to this memory.

Rules:
- If the memory is empty or trivial, return minimal but valid output (e.g. title="Quick note", empty entities).
- entities[].name must be the canonical noun form (e.g. "FastAPI" not "fastapi", "Claude" not "claude code").
- Do not include the user themself as a person entity.
- Do not echo the full memory in the summary; distill it.
"""


def build_enrich_prompt(content: str) -> str:
    return (
        f"{ENRICH_INSTRUCTIONS}\n\n"
        f"---\n"
        f"MEMORY:\n{content.strip()}\n"
        f"---"
    )
