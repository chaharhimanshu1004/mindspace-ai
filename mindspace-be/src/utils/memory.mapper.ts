import type { Memory } from "@prisma/client";
import type { PublicMemory } from "../schemas/memory.types";

export const toPublicMemory = (memory: Memory): PublicMemory => ({
    id: memory.id,
    content: memory.content,
    title: memory.title,
    summary: memory.summary,
    topics: memory.topics,
    status: memory.status,
    sourceType: memory.sourceType,
    createdAt: memory.createdAt,
    updatedAt: memory.updatedAt,
});
