"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginValues } from "../auth.schemas";
import { useLogin } from "../hooks/use-login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleSigninButton } from "./google-signin-button";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const mutation = useLogin();

    const onSubmit = (values: LoginValues) => mutation.mutate(values);

    return (
        <div className="space-y-5">
            <GoogleSigninButton />

            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-[12px] font-medium text-[#9CA3AF]">or</span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-2"
                    loading={mutation.isPending}
                >
                    Continue
                </Button>
            </form>
        </div>
    );
}
