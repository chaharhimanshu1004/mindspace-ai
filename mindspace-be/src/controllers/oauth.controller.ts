import type { Request, Response } from "express";
import { ZodError } from "zod";
import { OAuthService } from "../services/oauth.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";
import { authorizeQuerySchema, authorizeActionSchema, tokenBodySchema } from "../schemas/oauth.schema";
import { env } from "../config/env";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }
    if (error instanceof ZodError) {
        ResponseHandler.error(res, "Invalid request", error.flatten().fieldErrors, 400);
        return;
    }
    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class OAuthController {
    private static redirectWithError(
        res: Response,
        redirectUri: string,
        error: string,
        state: string | undefined,
        description?: string,
    ): void {
        try {
            const url = new URL(redirectUri);
            url.searchParams.set("error", error);
            if (state) url.searchParams.set("state", state);
            if (description) url.searchParams.set("error_description", description);
            res.redirect(url.toString());
        } catch {
            ResponseHandler.error(res, description ?? error, null, 400);
        }
    }

    public static async authorizeGet(req: Request, res: Response): Promise<void> {
        let query;
        try {
            query = authorizeQuerySchema.parse(req.query);
        } catch (error) {
            handleError(res, error, "OAuth authorize: invalid query");
            return;
        }

        try {
            const client = await OAuthService.getClientForConsent({
                clientId: query.client_id,
                redirectUri: query.redirect_uri,
                scope: query.scope,
            });

            const params = new URLSearchParams({
                client_id: query.client_id,
                redirect_uri: query.redirect_uri,
                scope: query.scope,
                state: query.state,
                code_challenge: query.code_challenge,
                code_challenge_method: query.code_challenge_method,
                client_name: client.name,
            });

            res.redirect(`${env.CORS_ORIGIN}/oauth/authorize?${params.toString()}`);
        } catch (error) {
            if (error instanceof AppError) {
                if (error.code === "INVALID_CLIENT" || error.code === "INVALID_REDIRECT_URI") {
                    ResponseHandler.error(res, error.message, null, error.status);
                    return;
                }
                const oauthError =
                    error.code === "INVALID_SCOPE" ? "invalid_scope" : "server_error";
                OAuthController.redirectWithError(
                    res,
                    query.redirect_uri,
                    oauthError,
                    query.state,
                    error.message,
                );
                return;
            }
            handleError(res, error, "OAuth authorize failed");
        }
    }

    public static async authorizePost(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const body = authorizeActionSchema.parse(req.body);

            if (body.action === "deny") {
                const url = new URL(body.redirect_uri);
                url.searchParams.set("error", "access_denied");
                url.searchParams.set("state", body.state);
                res.redirect(url.toString());
                return;
            }

            const { redirectUrl } = await OAuthService.issueAuthCode({
                clientId: body.client_id,
                userId,
                redirectUri: body.redirect_uri,
                scope: body.scope,
                state: body.state,
                codeChallenge: body.code_challenge,
                codeChallengeMethod: body.code_challenge_method,
            });

            res.redirect(redirectUrl);
        } catch (error) {
            handleError(res, error, "OAuth consent failed");
        }
    }

    public static async token(req: Request, res: Response): Promise<void> {
        try {
            const body = tokenBodySchema.parse(req.body);

            if (body.grant_type === "authorization_code") {
                const result = await OAuthService.exchangeCode({
                    code: body.code,
                    clientId: body.client_id,
                    redirectUri: body.redirect_uri,
                    codeVerifier: body.code_verifier,
                });
                res.json({
                    access_token: result.accessToken,
                    refresh_token: result.refreshToken,
                    token_type: "Bearer",
                    expires_in: result.expiresIn,
                });
                return;
            }

            const result = await OAuthService.refreshToken({
                refreshToken: body.refresh_token,
                clientId: body.client_id,
            });
            res.json({
                access_token: result.accessToken,
                refresh_token: result.refreshToken,
                token_type: "Bearer",
                expires_in: result.expiresIn,
            });
        } catch (error) {
            handleError(res, error, "OAuth token exchange failed");
        }
    }

    public static async listTokens(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const tokens = await OAuthService.listTokens(userId);
            ResponseHandler.success(res, tokens, "Tokens fetched", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch tokens");
        }
    }

    public static async revokeToken(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const tokenId = parseInt(req.params.id, 10);
            if (isNaN(tokenId)) {
                ResponseHandler.error(res, "Invalid token id", null, 400);
                return;
            }
            await OAuthService.revokeToken(userId, tokenId);
            ResponseHandler.success(res, null, "Token revoked", 200);
        } catch (error) {
            handleError(res, error, "Failed to revoke token");
        }
    }

    public static discoveryMetadata(_req: Request, res: Response): void {
        res.json({
            issuer: env.API_URL,
            authorization_endpoint: `${env.CORS_ORIGIN}/oauth/authorize`,
            token_endpoint: `${env.API_URL}/api/oauth/token`,
            registration_endpoint: `${env.API_URL}/api/oauth/register`,
            response_types_supported: ["code"],
            grant_types_supported: ["authorization_code", "refresh_token"],
            code_challenge_methods_supported: ["S256"],
            scopes_supported: ["memories:read", "memories:write"],
            token_endpoint_auth_methods_supported: ["none"],
        });
    }

    public static protectedResourceMetadata(_req: Request, res: Response): void {
        res.json({
            resource: `${env.API_URL}/mcp`,
            authorization_servers: [env.API_URL],
            scopes_supported: ["memories:read", "memories:write"],
            bearer_methods_supported: ["header"],
        });
    }

    public static async dynamicClientRegistration(req: Request, res: Response): Promise<void> {
        const body = req.body as { client_name?: string; redirect_uris?: string[]; scope?: string };
        const redirectUris = body.redirect_uris ?? [];

        console.log("[oauth/register] body:", JSON.stringify(body, null, 2));

        await import("../db/prisma").then(({ prisma }) =>
            prisma.oAuthClient.upsert({
                where: { clientId: "claude" },
                create: {
                    name: body.client_name ?? "Claude",
                    clientId: "claude",
                    clientSecret: null,
                    redirectUris,
                    scopes: ["memories:read", "memories:write"],
                },
                update: {
                    redirectUris,
                },
            })
        );

        res.status(201).json({
            client_id: "claude",
            client_name: body.client_name ?? "Claude",
            redirect_uris: redirectUris,
            grant_types: ["authorization_code", "refresh_token"],
            response_types: ["code"],
            token_endpoint_auth_method: "none",
            scope: "memories:read memories:write",
        });
    }
}
