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
    const errorId = error ? `${inputId}-error` : undefined;

    return (
        <div>
            <label
                htmlFor={inputId}
                className="mb-2 block text-body-sm font-semibold text-ink"
            >
                {label}
            </label>
            <input
                id={inputId}
                ref={ref}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId}
                className={[
                    "h-11 w-full rounded-control bg-surface-1 px-3.5 text-body text-ink",
                    "border placeholder:text-ink-subtle",
                    "transition-colors duration-fast ease-standard",
                    "focus:outline-none focus-visible:shadow-ring",
                    error
                        ? "border-danger-line focus:border-danger-fg"
                        : "border-border-interactive focus:border-ink",
                    className ?? "",
                ].join(" ")}
                {...rest}
            />
            {error ? (
                <p id={errorId} className="mt-2 text-body-sm text-danger-fg">
                    {error}
                </p>
            ) : null}
        </div>
    );
});
