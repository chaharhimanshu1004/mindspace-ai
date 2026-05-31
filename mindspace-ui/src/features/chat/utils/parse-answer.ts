export type AnswerSegment =
    | { kind: "prose"; text: string }
    | { kind: "memory"; memoryId: string; fallback: string };

const MARKER_REGEX = /<<<memory:([a-f0-9-]+)>>>([\s\S]*?)<<<end>>>/gi;

export const parseAnswer = (raw: string): AnswerSegment[] => {
    const out: AnswerSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    MARKER_REGEX.lastIndex = 0;
    while ((match = MARKER_REGEX.exec(raw)) !== null) {
        if (match.index > lastIndex) {
            out.push({
                kind: "prose",
                text: raw.slice(lastIndex, match.index),
            });
        }
        out.push({
            kind: "memory",
            memoryId: match[1],
            fallback: match[2],
        });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < raw.length) {
        out.push({ kind: "prose", text: raw.slice(lastIndex) });
    }

    return out;
};
