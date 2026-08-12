import type { GraphEdge, GraphNode } from "./memory-graph.types";

export const centre = { x: 240, y: 215, r: 0, tone: "strong" } as const;

export const graphNodes: Record<string, GraphNode> = {
    A: { x: 240, y: 55, r: 9, tone: "strong" },
    B: { x: 95, y: 130, r: 5, tone: "faint" },
    L: { x: 55, y: 250, r: 7, tone: "mid" },
    D: { x: 150, y: 385, r: 5, tone: "faint" },
    E: { x: 300, y: 420, r: 6, tone: "mid" },
    F: { x: 430, y: 250, r: 9, tone: "strong" },
    G: { x: 390, y: 110, r: 5, tone: "mid" },
    H: { x: 180, y: 255, r: 5, tone: "faint" },
    I: { x: 205, y: 320, r: 6, tone: "mid" },
    J: { x: 330, y: 300, r: 5, tone: "faint" },
    K: { x: 345, y: 360, r: 5, tone: "faint" },
};

export const graphEdges: GraphEdge[] = [
    ["A", "C"], ["A", "B"], ["A", "G"], ["A", "F"], ["A", "L"],
    ["B", "L"], ["B", "C"], ["B", "G"],
    ["L", "C"], ["L", "D"], ["L", "H"],
    ["D", "C"], ["D", "E"], ["D", "I"],
    ["E", "C"], ["E", "F"], ["E", "K"], ["E", "J"],
    ["F", "C"], ["F", "G"], ["F", "J"],
    ["G", "C"], ["H", "C"], ["I", "C"], ["J", "C"], ["K", "C"],
    ["H", "I"], ["J", "K"],
];
