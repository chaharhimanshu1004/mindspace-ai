import type { ComponentType } from "react";

export interface SurfaceItem {
    icon: ComponentType<{ className?: string }>;
    title: string;
    where: string;
    body: string;
    example: string;
}
