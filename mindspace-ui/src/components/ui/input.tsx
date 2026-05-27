"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
    { label, error, id, className, ...rest },
    ref,
) {
    const inputId = id ?? rest.name;
    return (
        <label htmlFor={inputId} className="block">
            <span className="block text-sm text-ink-muted mb-1.5">{label}</span>
            <input
                id={inputId}
                ref={ref}
                className={[
                    "w-full h-11 px-3.5 rounded-xl bg-white",
                    "border border-border-subtle text-ink placeholder-ink-subtle",
                    "transition-all duration-200 ease-calm",
                    "focus:outline-none focus:border-indigo-soft/60 focus:ring-2 focus:ring-indigo-soft/15",
                    error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-200/50" : "",
                    className ?? "",
                ].join(" ")}
                {...rest}
            />
            {error ? (
                <span className="block mt-1.5 text-xs text-rose-500">{error}</span>
            ) : null}
        </label>
    );
});
