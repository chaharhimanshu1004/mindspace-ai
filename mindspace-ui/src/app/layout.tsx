import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/providers/providers";
import "./globals.css";

export const metadata: Metadata = {
    title: "MindSpace — Your second brain",
    description:
        "A calm, AI-native memory sanctuary where your thoughts find each other.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable} ${GeistMono.variable}`}
        >
            <body suppressHydrationWarning className="min-h-screen bg-canvas text-ink font-sans antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
