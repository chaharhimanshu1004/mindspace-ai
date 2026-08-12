import type { EmptyStateProps } from "./empty-state.types";

export function EmptyState({ icon: Icon, title, body, action, note }: EmptyStateProps) {
    return (
        <div className="mx-auto max-w-md rounded-card border border-border-subtle bg-surface-1 px-6 py-14 text-center shadow-sm">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-strong text-ink-muted">
                <Icon aria-hidden className="h-[18px] w-[18px]" />
            </span>

            <h2 className="ink-weight mt-5 font-display text-display-sm text-ink">
                {title}
            </h2>
            <p className="mx-auto mt-3 max-w-[36ch] text-body-sm text-ink-muted">{body}</p>

            {action ? <div className="mt-7 flex justify-center">{action}</div> : null}
            {note ? (
                <p className="mt-4 font-mono text-[12px] text-ink-subtle">{note}</p>
            ) : null}
        </div>
    );
}
