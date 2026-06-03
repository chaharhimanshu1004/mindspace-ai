interface Props {
    label: string;
    value: string;
}

export function ProfileField({ label, value }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3 border-b border-ink/6 last:border-b-0">
            <span className="text-[13px] text-ink-muted">{label}</span>
            <span className="text-sm text-ink text-left sm:text-right break-all">
                {value}
            </span>
        </div>
    );
}
