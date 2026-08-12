"use client";

import { env } from "@/config/env";
import { GoogleGlyph } from "./google-glyph";

interface Props {
    label?: string;
}

export function GoogleSigninButton({ label = "Continue with Google" }: Props) {
    const handleClick = () => {
        window.location.href = `${env.apiUrl}/auth/google`;
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-control border border-border-interactive bg-surface-1 text-body font-semibold text-ink transition-colors duration-fast ease-standard hover:bg-surface-3 focus:outline-none focus-visible:shadow-ring"
        >
            <GoogleGlyph />
            {label}
        </button>
    );
}
