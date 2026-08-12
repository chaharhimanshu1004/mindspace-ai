import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string;
}

export function GraphPill({ children, className }: Props) {
    return (
        <span
            className={`absolute whitespace-nowrap rounded-full border border-border-subtle bg-surface-1 px-3 py-1 font-mono text-[11px] text-ink-muted shadow-xs ${className ?? ""}`}
        >
            {children}
        </span>
    );
}
