import type { ComponentType, ReactNode } from "react";

export interface EmptyStateProps {
    icon: ComponentType<{ className?: string }>;
    title: string;
    body: string;
    action?: ReactNode;
    note?: string;
}
