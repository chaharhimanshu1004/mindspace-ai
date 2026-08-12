import { ArrowRight } from "lucide-react";
import type { SurfaceItem } from "./surfaces.types";

interface Props {
    item: SurfaceItem;
}

export function SurfaceCard({ item }: Props) {
    return (
        <article className="flex flex-col bg-surface-1 p-7 sm:p-8">
            <header className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-ink-muted">
                    <item.icon aria-hidden className="h-4 w-4" />
                </span>
                <span className="text-overline font-semibold uppercase text-ink-subtle">
                    {item.where}
                </span>
            </header>

            <h3 className="ink-weight mt-6 font-display text-display-sm text-ink">
                {item.title}
            </h3>
            <p className="mt-3 flex-1 text-body-sm text-ink-muted">{item.body}</p>

            <p className="mt-6 flex items-start gap-2.5 border-t border-border-subtle pt-5 font-mono text-[13px] text-ink-subtle">
                <ArrowRight aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0">{item.example}</span>
            </p>
        </article>
    );
}
