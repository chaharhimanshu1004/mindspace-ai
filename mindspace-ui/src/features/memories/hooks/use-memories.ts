"use client";

import { useQuery } from "@tanstack/react-query";

import { listMemoriesApi } from "../api/list-memories.api";
import { memoryKeys } from "../memory.keys";

export const useMemories = () =>
    useQuery({
        queryKey: memoryKeys.list(),
        queryFn: () => listMemoriesApi({ limit: 50 }),
    });
