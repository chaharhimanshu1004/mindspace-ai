"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { loginApi } from "../api/login.api";
import { authStorage } from "../auth.storage";
import { useAuth } from "../use-auth";
import { ApiError } from "@/lib/api-error";

export const useLogin = () => {
    const router = useRouter();
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: (args: { email: string; password: string }) => loginApi(args),
        onSuccess: (session) => {
            authStorage.set(session.token);
            setUser(session.user);
            router.push("/app");
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
