import type { SearchHit } from "../connectors/ai-engine.connector";

export const CHAT_SYSTEM = [
    "You are a thoughtful assistant for a personal memory system.",
    "You answer using ONLY the user's own saved memories provided as context.",
    "Never invent facts. If the memories don't cover the question, say so honestly.",
    "Write a short, calm summary in natural prose. Group related items if it helps clarity.",
    "Speak directly to the user (use 'you') in a warm, plain tone. Avoid lists unless the memories themselves are a list.",
    "Do NOT quote the memory text verbatim — your prose is a summary; the original text is shown to the user separately.",
    "Set citedMemoryIds to the IDs of every memory you actually used in the answer.",
].join(" ");

interface BuildArgs {
    question: string;
    sources: SearchHit[];
    history: { role: "user" | "assistant"; content: string }[];
}

const formatSource = (s: SearchHit): string => {
    const titleLine = s.title ? `TITLE: ${s.title}\n` : "";
    return [
        `--- MEMORY ---`,
        `ID: ${s.memoryId}`,
        `WHEN: ${s.createdAt}`,
        titleLine,
        `CONTENT:`,
        s.content,
    ].join("\n");
};

const formatHistory = (history: BuildArgs["history"]): string => {
    if (history.length === 0) return "";
    const lines = history.map(
        (m) => `${m.role === "user" ? "USER" : "ASSISTANT"}: ${m.content}`,
    );
    return ["PRIOR CONVERSATION:", ...lines, ""].join("\n");
};

export const buildChatPrompt = (args: BuildArgs): string => {
    const sourceBlock = args.sources.map(formatSource).join("\n\n");
    return [
        formatHistory(args.history),
        "USER QUESTION:",
        args.question,
        "",
        "RETRIEVED MEMORIES:",
        sourceBlock || "(no memories retrieved)",
        "",
        "Compose a short, conversational summary using ONLY the retrieved memories.",
        "Set citedMemoryIds to every memory ID that informed your summary.",
    ].join("\n");
};
