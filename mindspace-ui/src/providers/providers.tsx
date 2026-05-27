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
                    style: { fontSize: "0.875rem" },
                }}
            />
        </QueryClientProvider>
    );
}
