interface Props {
    label: string;
}

export function Divider({ label }: Props) {
    return (
        <div className="flex items-center gap-4">
            <span aria-hidden className="h-px flex-1 bg-border-subtle" />
            <span className="text-overline font-semibold uppercase text-ink-subtle">
                {label}
            </span>
            <span aria-hidden className="h-px flex-1 bg-border-subtle" />
        </div>
    );
}
