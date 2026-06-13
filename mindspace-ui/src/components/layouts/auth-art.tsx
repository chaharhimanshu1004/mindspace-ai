const C = { x: 240, y: 230 };

const nodes: Record<string, { x: number; y: number; r: number; big?: boolean }> = {
    A: { x: 240, y: 70, r: 7, big: true },
    B: { x: 90, y: 150, r: 4 },
    L: { x: 60, y: 290, r: 6, big: true },
    D: { x: 165, y: 410, r: 4 },
    E: { x: 320, y: 420, r: 5 },
    F: { x: 430, y: 280, r: 7, big: true },
    G: { x: 400, y: 130, r: 4 },
    H: { x: 185, y: 285, r: 4 },
    I: { x: 215, y: 350, r: 5 },
};

const edges: [string, string][] = [
    ["A", "C"], ["A", "B"], ["A", "G"], ["A", "F"],
    ["B", "L"], ["B", "C"], ["L", "C"], ["L", "D"], ["L", "H"],
    ["D", "C"], ["D", "E"], ["D", "I"], ["E", "C"], ["E", "F"],
    ["F", "C"], ["F", "G"], ["G", "C"], ["H", "C"], ["I", "C"], ["H", "I"],
];

function point(key: string) {
    return key === "C" ? C : nodes[key];
}

export function AuthArt() {
    return (
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#5457E0]">
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(600px 400px at 20% 15%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(500px 500px at 85% 90%, rgba(163,177,138,0.25), transparent 60%)",
                }}
            />

            <svg
                viewBox="0 0 480 480"
                fill="none"
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-90"
            >
                {edges.map(([a, b], index) => {
                    const p1 = point(a);
                    const p2 = point(b);
                    return (
                        <line
                            key={index}
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#fff"
                            strokeOpacity="0.25"
                            strokeWidth="1"
                        />
                    );
                })}
                {Object.entries(nodes).map(([key, node]) => (
                    <g key={key}>
                        {node.big ? (
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.r * 2.6}
                                fill="#fff"
                                fillOpacity="0.15"
                            />
                        ) : null}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill="#fff"
                            fillOpacity={node.big ? 1 : 0.7}
                            style={
                                node.big
                                    ? { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }
                                    : undefined
                            }
                        />
                        {node.big ? (
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.r}
                                fill="#fff"
                                fillOpacity="0.4"
                                className="animate-pulse-ring"
                                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                            />
                        ) : null}
                    </g>
                ))}
            </svg>

            <span className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
                <span className="h-3 w-3 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)]" />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-12">
                <p className="max-w-sm text-[26px] font-semibold leading-tight tracking-tight text-white">
                    Where every thought finds its place.
                </p>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
                    A continuous, intelligent memory that captures and connects
                    everything you think.
                </p>
            </div>
        </div>
    );
}
