"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const variants: Record<Variant, string> = {
    primary: "bg-ink text-paper hover:bg-ink/90",
    secondary:
        "bg-surface-1 text-ink border border-border-interactive hover:bg-surface-3",
    ghost: "text-ink-muted hover:bg-surface-3 hover:text-ink",
    danger: "bg-danger-fg text-paper hover:bg-danger-fg/90",
};

const sizes: Record<Size, string> = {
    sm: "h-9 px-3.5 text-body-sm rounded-control",
    md: "h-11 px-5 text-body rounded-control",
    lg: "h-12 px-6 text-body rounded-control",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
    { variant = "primary", size = "md", loading, className, children, disabled, ...rest },
    ref,
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={[
                "relative inline-flex items-center justify-center gap-2 font-semibold",
                "transition-colors duration-fast ease-standard",
                "disabled:cursor-not-allowed disabled:opacity-45",
                "focus:outline-none focus-visible:shadow-ring",
                variants[variant],
                sizes[size],
                className ?? "",
            ].join(" ")}
            {...rest}
        >
            <span className={loading ? "invisible" : undefined}>{children}</span>
            {loading ? (
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </span>
            ) : null}
        </button>
    );
});
