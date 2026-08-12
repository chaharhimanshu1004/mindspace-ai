import type { ReactNode } from "react";

export type BadgeTone = "info" | "accent" | "success" | "progress" | "danger";

export interface BadgeProps {
    tone?: BadgeTone;
    dot?: boolean;
    title?: string;
    children: ReactNode;
}
