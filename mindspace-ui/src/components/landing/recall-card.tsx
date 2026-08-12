import type { RecallItem } from "./recall.types";

interface Props {
    item: RecallItem;
}

export function RecallCard({ item }: Props) {
    return (
        <article className="flex w-[19rem] shrink-0 items-start gap-3.5 rounded-card border border-border-subtle border-l-[3px] border-l-ink bg-surface-1 p-4 shadow-sm sm:w-[21rem]">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border-subtle bg-paper text-ink-muted">
                <item.icon className={item.brand ? "h-5 w-5" : "h-4 w-4"} />
            </span>
            <div className="min-w-0">
                <p className="font-mono text-[12px] text-ink-subtle">{item.context}</p>
                <p className="mt-1 text-body-sm text-ink">{item.question}</p>
            </div>
        </article>
    );
}
