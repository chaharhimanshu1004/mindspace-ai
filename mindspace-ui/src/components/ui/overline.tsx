interface Props {
    children: string;
}

export function Overline({ children }: Props) {
    return (
        <span className="flex items-center gap-3">
            <span aria-hidden className="h-px w-7 bg-border-strong" />
            <span className="text-overline font-semibold uppercase text-ink-subtle">
                {children}
            </span>
        </span>
    );
}
