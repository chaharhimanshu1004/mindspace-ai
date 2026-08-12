export type NodeTone = "strong" | "mid" | "faint";

export interface GraphNode {
    x: number;
    y: number;
    r: number;
    tone: NodeTone;
}

export type GraphEdge = [string, string];
