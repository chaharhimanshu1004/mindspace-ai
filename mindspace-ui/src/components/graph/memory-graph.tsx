import { tokens } from "@/theme/tokens";
import { centre, graphEdges, graphNodes } from "./memory-graph.data";
import type { NodeTone } from "./memory-graph.types";
import { GraphPill } from "./graph-pill";

const fills: Record<NodeTone, string> = {
    strong: tokens.ink.base,
    mid: tokens.line.interactive,
    faint: tokens.line.strong,
};

function point(key: string) {
    return key === "C" ? centre : graphNodes[key];
}

function Edges() {
    return (
        <g stroke={tokens.line.strong} strokeWidth="1">
            {graphEdges.map(([a, b], index) => {
                const p1 = point(a);
                const p2 = point(b);
                return <line key={index} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
            })}
        </g>
    );
}

function Nodes() {
    return (
        <g>
            {Object.entries(graphNodes).map(([key, node]) => (
                <g key={key}>
                    {node.tone === "strong" ? (
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill={fills.strong}
                            fillOpacity="0.28"
                            className="animate-pulse-ring"
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                    ) : null}
                    <circle cx={node.x} cy={node.y} r={node.r} fill={fills[node.tone]} />
                </g>
            ))}
        </g>
    );
}

export function MemoryGraph() {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[440px]">
            <svg
                viewBox="0 0 480 460"
                fill="none"
                aria-hidden
                className="h-full w-full overflow-visible"
            >
                <Edges />
                <Nodes />
            </svg>

            <span className="absolute left-1/2 top-[46%] inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-paper font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                768D
            </span>

            <GraphPill className="left-[4%] top-[24%] animate-float">
                slack · #product
            </GraphPill>
            <GraphPill className="right-[-2%] top-[16%]">/save</GraphPill>
            <GraphPill className="bottom-[4%] left-1/2 -translate-x-1/2">
                search_memories
            </GraphPill>
        </div>
    );
}
