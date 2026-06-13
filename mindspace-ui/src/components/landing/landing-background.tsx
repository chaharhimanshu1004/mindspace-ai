export function LandingBackground() {
    return (
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(900px 700px at 0% 0%, rgba(99,102,241,0.06), transparent 60%), radial-gradient(900px 700px at 100% 100%, rgba(163,177,138,0.05), transparent 60%)",
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage:
                        "radial-gradient(#2F3441 1px, transparent 1px)",
                    backgroundSize: "3px 3px",
                }}
            />
        </div>
    );
}
