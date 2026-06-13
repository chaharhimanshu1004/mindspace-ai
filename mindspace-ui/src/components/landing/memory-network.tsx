import { Database } from "lucide-react";

const C = { x: 240, y: 215 };

const nodes: Record<
    string,
    { x: number; y: number; r: number; tone: string }
> = {
    A: { x: 240, y: 55, r: 10, tone: "indigo" },
    B: { x: 95, y: 130, r: 5, tone: "faint" },
    L: { x: 55, y: 250, r: 8, tone: "indigo" },
    D: { x: 150, y: 385, r: 5, tone: "faint" },
    E: { x: 300, y: 420, r: 6, tone: "faint" },
    F: { x: 430, y: 250, r: 11, tone: "indigo" },
    G: { x: 390, y: 110, r: 5, tone: "faint" },
    H: { x: 180, y: 255, r: 5, tone: "sage" },
    I: { x: 205, y: 320, r: 6, tone: "sage" },
    J: { x: 330, y: 300, r: 5, tone: "peach" },
    K: { x: 345, y: 360, r: 5, tone: "peach" },
};

const edges: [string, string][] = [
    ["A", "C"], ["A", "B"], ["A", "G"], ["A", "F"], ["A", "L"],
    ["B", "L"], ["B", "C"], ["B", "G"],
    ["L", "C"], ["L", "D"], ["L", "H"],
    ["D", "C"], ["D", "E"], ["D", "I"],
    ["E", "C"], ["E", "F"], ["E", "K"], ["E", "J"],
    ["F", "C"], ["F", "G"], ["F", "J"],
    ["G", "C"], ["H", "C"], ["I", "C"], ["J", "C"], ["K", "C"],
    ["H", "I"], ["J", "K"],
];

const fills: Record<string, string> = {
    indigo: "#6366F1",
    faint: "#C7C9EE",
    sage: "#A3B18A",
    peach: "#E8A87C",
};

function point(key: string) {
    return key === "C" ? C : nodes[key];
}

export function MemoryNetwork() {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 blur-2xl"
                style={{
                    background:
                        "radial-gradient(300px 300px at 55% 45%, rgba(99,102,241,0.18), transparent 70%)",
                }}
            />
            <svg viewBox="0 0 480 460" fill="none" className="h-full w-full overflow-visible">
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
                            stroke="#6366F1"
                            strokeOpacity="0.16"
                            strokeWidth="1"
                        />
                    );
                })}

                {Object.entries(nodes).map(([key, node]) => {
                    const fill = fills[node.tone];
                    const isIndigo = node.tone === "indigo";
                    return (
                        <g key={key}>
                            {isIndigo ? (
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.r * 2.4}
                                    fill={fill}
                                    fillOpacity="0.12"
                                />
                            ) : null}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.r}
                                fill={fill}
                                style={
                                    isIndigo
                                        ? {
                                              filter: `drop-shadow(0 0 6px ${fill}aa) drop-shadow(0 0 16px ${fill}55)`,
                                          }
                                        : undefined
                                }
                            />
                            {isIndigo ? (
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.r}
                                    fill={fill}
                                    fillOpacity="0.3"
                                    className="animate-pulse-ring"
                                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                                />
                            ) : null}
                        </g>
                    );
                })}
            </svg>

            <span className="absolute left-1/2 top-[46%] inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#6366F1] text-white shadow-[0_12px_30px_rgba(99,102,241,0.4)]">
                <Database className="h-7 w-7" />
            </span>

            <Pill className="left-[24%] top-[28%] animate-float">Pipeline</Pill>
            <Pill className="right-[-4%] top-[22%]">Real-time thoughts…</Pill>
            <Pill className="left-[22%] top-[76%]">Pipeline</Pill>
            <Pill className="bottom-[2%] left-1/2 -translate-x-1/2 animate-float">
                Real-time thought streams
            </Pill>
        </div>
    );
}

function Pill({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`absolute whitespace-nowrap rounded-full border border-[#E9E8E2] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2F3441] shadow-soft ${className}`}
        >
            {children}
        </span>
    );
}
