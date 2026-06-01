"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/features/auth/auth.provider";

export function Providers({ children }: { children: React.ReactNode }) {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
                },
            }),
    );

    return (
        <QueryClientProvider client={client}>
            <AuthProvider>{children}</AuthProvider>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    className: "!border !border-border-subtle/60 !bg-white/90 !backdrop-blur-md !text-ink !text-xs !rounded-2xl !shadow-lift !px-4 !py-3 !font-medium !transition-all !duration-300",
                    success: {
                        iconTheme: {
                            primary: "#A3B18A",
                            secondary: "#FAFAF7",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#FAFAF7",
                        },
                    },
                }}
            />
        </QueryClientProvider>
    );
}
