_SINGLE_CHUNK_THRESHOLD = 2400
_TARGET_CHUNK_CHARS = 1500
_OVERLAP_CHARS = 200


def _split_paragraphs(text: str) -> list[str]:
    blocks: list[str] = []
    for block in text.split("\n\n"):
        stripped = block.strip()
        if stripped:
            blocks.append(stripped)
    return blocks or [text.strip()]


def chunk_content(content: str) -> list[str]:
    text = content.strip()
    if not text:
        return []

    if len(text) < _SINGLE_CHUNK_THRESHOLD:
        return [text]

    paragraphs = _split_paragraphs(text)
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        if not current:
            current = para
            continue

        if len(current) + len(para) + 2 <= _TARGET_CHUNK_CHARS:
            current = f"{current}\n\n{para}"
        else:
            chunks.append(current)
            overlap = current[-_OVERLAP_CHARS:] if len(current) > _OVERLAP_CHARS else current
            current = f"{overlap}\n\n{para}" if overlap else para

    if current:
        chunks.append(current)

    return chunks if chunks else [text]
