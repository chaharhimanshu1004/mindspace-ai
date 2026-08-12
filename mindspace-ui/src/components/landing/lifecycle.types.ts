import type { BadgeTone } from "@/components/ui/badge.types";

export interface LifecycleStage {
    label: string;
    note: string;
    tone: BadgeTone;
    reserved?: boolean;
}
