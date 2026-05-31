"use client";

import { useQuery } from "@tanstack/react-query";
import { historyApi } from "../api/history.api";
import { chatKeys } from "../chat.keys";

export const useChatHistory = () =>
    useQuery({
        queryKey: chatKeys.history(),
        queryFn: () => historyApi({ limit: 50 }),
        staleTime: 30_000,
    });
