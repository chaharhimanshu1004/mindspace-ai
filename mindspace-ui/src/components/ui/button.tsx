"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const variants: Record<Variant, string> = {
    primary:
        "bg-indigo-soft text-white hover:bg-indigo-hover shadow-soft hover:shadow-lift",
    secondary:
        "bg-white text-ink border border-border-subtle hover:bg-canvas hover:border-ink/20",
    ghost: "text-ink hover:bg-indigo-tint",
};

const sizes: Record<Size, string> = {
    md: "h-10 px-4 text-sm rounded-xl",
    lg: "h-12 px-6 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
    { variant = "primary", size = "md", loading, className, children, disabled, ...rest },
    ref,
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={[
                "inline-flex items-center justify-center gap-2 font-medium",
                "transition-all duration-300 ease-calm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                variants[variant],
                sizes[size],
                className ?? "",
            ].join(" ")}
            {...rest}
        >
            {loading ? <span className="opacity-80">…</span> : children}
        </button>
    );
});
