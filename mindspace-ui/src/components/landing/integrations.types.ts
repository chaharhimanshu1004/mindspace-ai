import type { ComponentType } from "react";

export interface Integration {
    icon: ComponentType<{ className?: string }>;
    brand: boolean;
    title: string;
    body: string;
    status: "live" | "soon";
}
