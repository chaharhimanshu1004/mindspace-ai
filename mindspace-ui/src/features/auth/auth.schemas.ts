import { z } from "zod";

export const signupSchema = z
    .object({
        email: z.string().trim().toLowerCase().email("Enter a valid email"),
        password: z
            .string()
            .min(8, "At least 8 characters")
            .max(128, "Too long"),
        confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, {
        message: "Passwords don't match",
        path: ["confirm"],
    });

export type SignupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(1, "Required"),
});

export type LoginValues = z.infer<typeof loginSchema>;
