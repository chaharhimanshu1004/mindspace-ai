import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { Providers } from "@/providers/providers";
import "./globals.css";

const sans = localFont({
    src: "./fonts/space-grotesk-var.woff2",
    weight: "300 700",
    style: "normal",
    display: "swap",
    variable: "--font-sans",
});

const display = localFont({
    src: "./fonts/faculty-glyphic-400.woff2",
    weight: "400",
    style: "normal",
    display: "swap",
    variable: "--font-display",
});

export const metadata: Metadata = {
    title: "MindSpace — Your second brain",
    description:
        "Notes from the web, Slack, Telegram and Claude Code, embedded into one index you can question.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${sans.variable} ${display.variable} ${GeistMono.variable}`}
        >
            <body
                suppressHydrationWarning
                className="min-h-screen bg-paper font-sans text-ink antialiased"
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
