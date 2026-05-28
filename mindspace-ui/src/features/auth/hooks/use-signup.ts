"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signupApi } from "../api/signup.api";
import { useAuth } from "../use-auth";
import { ApiError } from "@/lib/api-error";

export const useSignup = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: (args: { email: string; password: string }) => signupApi(args),
        onSuccess: (session) => {
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
