import type { ComponentType } from "react";

interface Props {
    icon: ComponentType<{ className?: string }>;
    brand: boolean;
}

export function BrandTile({ icon: Icon, brand }: Props) {
    if (brand) {
        return (
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border-subtle bg-surface-1">
                <Icon className="h-6 w-6" />
            </span>
        );
    }

    return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-control border border-border-strong text-ink-muted">
            <Icon className="h-[18px] w-[18px]" />
        </span>
    );
}
