import { Badge } from "@/components/ui/badge";
import type { LifecycleStage as Stage } from "./lifecycle.types";

interface Props {
    stage: Stage;
}

export function LifecycleStage({ stage }: Props) {
    return (
        <div className="flex min-w-0 flex-col items-start gap-2">
            <Badge tone={stage.tone} dot={stage.tone === "progress"}>
                <span className="font-mono">{stage.label}</span>
            </Badge>
            <p className="text-meta text-ink-subtle">
                {stage.note}
                {stage.reserved ? " · reserved" : ""}
            </p>
        </div>
    );
}
