import { Fragment, type ReactNode } from "react";

const STOPWORDS = new Set([
    "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on", "at",
    "for", "with", "from", "by", "as", "is", "are", "was", "were", "be", "been",
    "being", "do", "does", "did", "have", "has", "had", "i", "me", "my", "you",
    "your", "we", "our", "they", "them", "their", "what", "when", "where",
    "which", "who", "how", "this", "that", "these", "those", "it", "its",
    "about", "any", "some", "all", "no", "not", "so", "than", "then", "there",
    "would", "could", "should", "can", "will",
]);

const escapeRegex = (s: string): string =>
    s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const extractQueryTerms = (query: string): string[] => {
    const cleaned = query.toLowerCase().replace(/[^\w\s'-]/g, " ");
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const t of tokens) {
        if (t.length < 3 || STOPWORDS.has(t) || seen.has(t)) continue;
        seen.add(t);
        out.push(t);
    }
    return out;
};

export const highlightContent = (
    content: string,
    terms: string[],
): ReactNode => {
    if (terms.length === 0) return content;
    const pattern = new RegExp(`(${terms.map(escapeRegex).join("|")})`, "gi");
    const parts = content.split(pattern);
    return (
        <>
            {parts.map((part, idx) => {
                if (idx % 2 === 1) {
                    return (
                        <mark
                            key={idx}
                            className="bg-sage/30 text-ink rounded-[3px] px-0.5"
                        >
                            {part}
                        </mark>
                    );
                }
                return <Fragment key={idx}>{part}</Fragment>;
            })}
        </>
    );
};
