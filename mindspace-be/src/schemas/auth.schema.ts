import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
    tempToken: z.string().min(1),
    otp: z.string().length(6).regex(/^\d{6}$/),
});

export const resendOtpSchema = z.object({
    tempToken: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
