"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteMemoryApi } from "../api/delete-memory.api";
import { memoryKeys } from "../memory.keys";
import { ApiError } from "@/lib/api-error";
import type { MemoryListPage } from "../memory.types";

export const useDeleteMemory = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMemoryApi(id),
        onSuccess: (_, id) => {
            // Optimistically update memories list by filtering out the deleted memory
            qc.invalidateQueries({ queryKey: memoryKeys.all });
            qc.setQueryData<MemoryListPage>(memoryKeys.list(undefined), (prev) => {
                if (!prev) return { items: [], nextCursor: null };
                return {
                    ...prev,
                    items: prev.items.filter((m) => m.id !== id),
                };
            });
            toast.success("Memory deleted");
        },
        onError: (error) => {
            const message =
                error instanceof ApiError
                    ? error.message
                    : "Could not delete memory — try again?";
            toast.error(message);
        },
    });
};
