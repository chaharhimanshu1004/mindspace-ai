export function MemoryEmpty() {
    return (
        <div className="text-center py-20 sm:py-28">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 border border-border-subtle shadow-soft mb-5">
                <span className="w-2 h-2 rounded-full bg-indigo-soft shadow-[0_0_14px_rgba(99,102,241,0.5)]" />
            </div>
            <h2 className="text-ink font-medium text-lg">A quiet beginning</h2>
            <p className="mt-2 text-ink-muted text-sm max-w-sm mx-auto leading-relaxed">
                Write your first thought below. It&rsquo;ll quietly find its place among
                everything else you save.
            </p>
        </div>
    );
}
