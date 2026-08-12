export function MemorySkeletonGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-card border border-border-subtle bg-surface-1 p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="h-3 w-20 rounded-full bg-surface-3" />
                        <div className="h-4 w-16 rounded-chip bg-surface-3" />
                    </div>
                    <div className="mt-5 h-4 w-3/4 rounded-full bg-surface-3" />
                    <div className="mt-4 space-y-2">
                        <div className="h-2.5 w-full rounded-full bg-surface-2" />
                        <div className="h-2.5 w-11/12 rounded-full bg-surface-2" />
                        <div className="h-2.5 w-2/3 rounded-full bg-surface-2" />
                    </div>
                    <div className="mt-6 h-2.5 w-24 rounded-full bg-surface-2" />
                </div>
            ))}
        </div>
    );
}
