export function LandingBackground() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-paper">
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(1100px 800px at 78% -8%, rgb(var(--accent-500) / 0.04), transparent 62%)",
                }}
            />
            <div className="grain absolute inset-0 opacity-100" />
        </div>
    );
}
