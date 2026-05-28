export function MemorySkeletonGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white/60 border border-border-subtle rounded-3xl shadow-soft p-5 sm:p-6 h-40 animate-pulse"
                >
                    <div className="h-3 w-1/2 rounded-full bg-border-softer mb-3" />
                    <div className="h-2 w-full rounded-full bg-border-softer mb-2" />
                    <div className="h-2 w-5/6 rounded-full bg-border-softer mb-2" />
                    <div className="h-2 w-3/4 rounded-full bg-border-softer" />
                </div>
            ))}
        </div>
    );
}
