export function ChatEmpty() {
    return (
        <div className="h-full min-h-[40vh] flex items-center justify-center text-center px-6">
            <div className="max-w-md">
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-ink-subtle">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    ask your second brain
                </span>
                <h2 className="mt-5 text-2xl tracking-tight text-ink font-medium">
                    What were you thinking about?
                </h2>
                <p className="mt-3 text-ink-muted text-[15px] leading-relaxed">
                    Ask anything about the thoughts you&rsquo;ve saved. Your memories
                    will quietly surface the relevant pieces.
                </p>
            </div>
        </div>
    );
}
