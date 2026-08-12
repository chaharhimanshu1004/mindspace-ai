"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    labelledBy?: string;
}

export function Modal({ open, onClose, children, labelledBy }: Props) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);

        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
        };
    }, [open, onClose]);

    if (!open || !mounted) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={[
                "fixed inset-0 z-50",
                "flex items-stretch sm:items-center justify-center",
                "p-0 sm:p-6",
            ].join(" ")}
        >
            <button
                aria-label="Close"
                tabIndex={-1}
                onClick={onClose}
                className={[
                    "absolute inset-0 w-full h-full",
                    "bg-ink/30 backdrop-blur-md",
                    "transition-opacity duration-base ease-standard",
                ].join(" ")}
            />

            <div
                ref={panelRef}
                className={[
                    "relative",
                    "w-full sm:w-[720px]",
                    "h-full sm:h-[476px]",
                    "sm:rounded-card overflow-hidden",
                    "border-0 sm:border sm:border-ink/10",
                    "shadow-[0_24px_80px_-20px_rgba(36,35,31,0.35)]",
                    "flex flex-col",
                    "bg-[#FAF7F0]",
                ].join(" ")}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}
