"use client";

import { useQuery } from "@tanstack/react-query";
import { listSourcesApi } from "../api/list-sources.api";

export const useMemorySources = () =>
    useQuery({
        queryKey: ["memory-sources"],
        queryFn: listSourcesApi,
        staleTime: Infinity,
    });
