import { z } from "zod";

export const authorizeQuerySchema = z.object({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
    response_type: z.literal("code"),
    scope: z.string().min(1),
    state: z.string().min(1),
    code_challenge: z.string().min(43).max(128),
    code_challenge_method: z.literal("S256"),
});

export const tokenBodySchema = z.discriminatedUnion("grant_type", [
    z.object({
        grant_type: z.literal("authorization_code"),
        code: z.string().min(1),
        redirect_uri: z.string().url(),
        client_id: z.string().min(1),
        code_verifier: z.string().min(43).max(128),
    }),
    z.object({
        grant_type: z.literal("refresh_token"),
        refresh_token: z.string().min(1),
        client_id: z.string().min(1),
    }),
]);

export const authorizeActionSchema = z.object({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
    scope: z.string().min(1),
    state: z.string().min(1),
    code_challenge: z.string().min(43).max(128),
    code_challenge_method: z.literal("S256"),
    action: z.enum(["allow", "deny"]),
});

export type AuthorizeQuery = z.infer<typeof authorizeQuerySchema>;
export type TokenBody = z.infer<typeof tokenBodySchema>;
export type AuthorizeAction = z.infer<typeof authorizeActionSchema>;
