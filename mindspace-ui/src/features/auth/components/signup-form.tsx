"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema, type SignupValues } from "../auth.schemas";
import { useSignup } from "../hooks/use-signup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { GoogleSigninButton } from "./google-signin-button";

export function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: "", password: "", confirm: "" },
    });

    const mutation = useSignup();

    const onSubmit = (values: SignupValues) =>
        mutation.mutate({ email: values.email, password: values.password });

    return (
        <div className="space-y-6">
            <GoogleSigninButton label="Sign up with Google" />

            <Divider label="or" />

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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Input
                    label="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    error={errors.confirm?.message}
                    {...register("confirm")}
                />
                <Button
                    type="submit"
                    size="lg"
                    className="mt-2 w-full"
                    loading={mutation.isPending}
                >
                    Create my MindSpace
                </Button>
            </form>
        </div>
    );
}
