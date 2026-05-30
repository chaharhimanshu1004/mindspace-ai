export const StreamKeys = {
    MEMORY_ENRICH: "memory.enrich",
    MEMORY_ENRICH_DEAD: "memory.enrich.dead",
} as const;

export const ConsumerGroups = {
    AI_ENGINE: "ai-engine",
} as const;

export type StreamKey = (typeof StreamKeys)[keyof typeof StreamKeys];
export type ConsumerGroup = (typeof ConsumerGroups)[keyof typeof ConsumerGroups];