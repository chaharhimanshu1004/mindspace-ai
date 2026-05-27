import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={[
                "bg-white/80 backdrop-blur-sm",
                "border border-border-subtle rounded-3xl shadow-soft",
                "p-8 sm:p-10",
                className ?? "",
            ].join(" ")}
            {...rest}
        />
    );
}
