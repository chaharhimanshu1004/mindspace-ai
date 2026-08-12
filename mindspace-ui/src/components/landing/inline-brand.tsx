import type { ComponentType } from "react";

interface Props {
    icon: ComponentType<{ className?: string }>;
    label: string;
}

export function InlineBrand({ icon: Icon, label }: Props) {
    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <Icon className="h-[0.95em] w-[0.95em] shrink-0 translate-y-[0.06em]" />
            {label}
        </span>
    );
}
