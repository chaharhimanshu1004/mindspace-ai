import { Badge } from "@/components/ui/badge";
import type { BadgeTone } from "@/components/ui/badge.types";

interface Props {
    status: string;
}

const labels: Record<string, string> = {
    pending: "queued",
    embedded: "embedded",
    enriched: "enriched",
    linked: "linked",
    failed: "failed",
};

const tones: Record<string, BadgeTone> = {
    pending: "progress",
    embedded: "progress",
    enriched: "success",
    linked: "accent",
    failed: "danger",
};

const hints: Record<string, string> = {
    pending: "Written and waiting for the worker",
    embedded: "Chunks vectorised, enrichment next",
    enriched: "Title, topics and entities written",
    linked: "Reserved for the memory graph",
    failed: "Enrichment gave up after retries",
};

export function MemoryStatusBadge({ status }: Props) {
    const tone = tones[status] ?? "info";

    return (
        <Badge tone={tone} dot={tone === "progress"} title={hints[status]}>
            <span className="font-mono">{labels[status] ?? status}</span>
        </Badge>
    );
}
