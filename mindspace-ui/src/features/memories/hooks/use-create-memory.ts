"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createMemoryApi } from "../api/create-memory.api";
import { memoryKeys } from "../memory.keys";
import { ApiError } from "@/lib/api-error";
import type { Memory, MemoryListPage } from "../memory.types";

export const useCreateMemory = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (args: { content: string }) => createMemoryApi(args),
        onSuccess: (memory: Memory) => {
            qc.setQueryData<MemoryListPage>(memoryKeys.list(), (prev) => {
                if (!prev) return { items: [memory], nextCursor: null };
                return { ...prev, items: [memory, ...prev.items] };
            });
        },
        onError: (error) => {
            const message =
                error instanceof ApiError
                    ? error.message
                    : "Could not save that — try again?";
            toast.error(message);
        },
    });
};
