import type { LifecycleStage } from "./lifecycle.types";

export const lifecycleStages: LifecycleStage[] = [
    { label: "pending", note: "written and queued", tone: "progress" },
    { label: "embedded", note: "chunks vectorised", tone: "progress" },
    { label: "enriched", note: "title, topics, entities", tone: "success" },
    { label: "linked", note: "memory graph", tone: "accent", reserved: true },
];
