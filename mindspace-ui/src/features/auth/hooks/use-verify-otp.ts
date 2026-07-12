"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { verifyOtpApi } from "../api/verify-otp.api";
import { useAuth } from "../use-auth";
import { ApiError } from "@/lib/api-error";

export const useVerifyOtp = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: (args: { tempToken: string; otp: string }) => verifyOtpApi(args),
        onSuccess: (session) => {
            sessionStorage.removeItem("otp_temp_token");
            sessionStorage.removeItem("otp_email");
            setUser(session.user);
            router.push("/memories");
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
