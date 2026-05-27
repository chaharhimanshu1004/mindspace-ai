import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
});

export type SignupInput = z.infer<typeof signupSchema>;
