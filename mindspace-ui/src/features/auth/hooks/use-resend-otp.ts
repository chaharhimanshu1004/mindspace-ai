"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { resendOtpApi } from "../api/resend-otp.api";
import { ApiError } from "@/lib/api-error";

export const useResendOtp = () => {
    return useMutation({
        mutationFn: (args: { tempToken: string }) => resendOtpApi(args),
        onSuccess: () => {
            toast.success("Code resent. Check your inbox.");
        },
        onError: (error) => {
            const message =
                error instanceof ApiError
                    ? error.message
                    : "Something went wrong. Please try again.";

            toast.error(message);
        },
    });
};
