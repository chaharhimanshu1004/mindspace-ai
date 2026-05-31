"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { askApi } from "../api/ask.api";
import { chatKeys } from "../chat.keys";

export const useAsk = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (message: string) => askApi({ message }),
        onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.history() }),
    });
};
