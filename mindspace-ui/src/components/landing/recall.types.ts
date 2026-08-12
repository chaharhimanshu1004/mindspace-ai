import type { ComponentType } from "react";

export interface RecallItem {
    icon: ComponentType<{ className?: string }>;
    brand: boolean;
    context: string;
    question: string;
}
