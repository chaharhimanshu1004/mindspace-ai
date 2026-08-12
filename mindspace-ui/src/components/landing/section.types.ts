import type { ReactNode } from "react";

export interface SectionProps {
    id?: string;
    children: ReactNode;
    className?: string;
}

export interface SectionHeaderProps {
    overline: string;
    title: string;
}
