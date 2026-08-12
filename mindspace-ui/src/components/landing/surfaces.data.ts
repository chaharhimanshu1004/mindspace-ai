import { MessagesSquare, Send, Terminal } from "lucide-react";
import type { SurfaceItem } from "./surfaces.types";

export const surfaceItems: SurfaceItem[] = [
    {
        icon: MessagesSquare,
        title: "Web chat",
        where: "in the app",
        body: "Answers cite the notes they came from.",
        example: "what did we settle on for pricing?",
    },
    {
        icon: Send,
        title: "Telegram",
        where: "from your phone",
        body: "Save or ask without leaving the chat.",
        example: "/save ship date moved to the 14th",
    },
    {
        icon: Terminal,
        title: "Claude Code",
        where: "in your terminal",
        body: "Four MCP tools, scoped by OAuth.",
        example: 'search_memories("pricing")',
    },
];
