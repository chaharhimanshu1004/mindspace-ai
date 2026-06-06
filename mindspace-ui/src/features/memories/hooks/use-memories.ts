"use client";

import { useQuery } from "@tanstack/react-query";
import { listMemoriesApi } from "../api/list-memories.api";
import { memoryKeys } from "../memory.keys";

export const useMemories = (sourceType?: string) =>
    useQuery({
        queryKey: memoryKeys.list(sourceType),
        queryFn: () => listMemoriesApi({ limit: 50, sourceType }),
    });
