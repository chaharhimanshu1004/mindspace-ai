import type { Request, Response } from "express";
import { ZodError } from "zod";

import { loginSchema, signupSchema, verifyOtpSchema, resendOtpSchema } from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";
import { AuthModel } from "../models/auth.model";
import { AppError } from "../errors/app-error";
import { toPublicUser } from "../utils/auth.mapper";
import { ResponseHandler } from "../utils/responseHandler";
import { clearAuthCookie, setAuthCookie } from "../utils/auth.cookie";
import { env } from "../config/env";

const handleError = (res: Response, error: unknown, fallbackMsg: string): void => {
    if (error instanceof AppError) {
        ResponseHandler.error(res, error.message, null, error.status);
        return;
    }

    if (error instanceof ZodError) {
        ResponseHandler.error(res, "Invalid request payload", error.flatten().fieldErrors, 400);
        return;
    }

    console.error(fallbackMsg, error);
    ResponseHandler.error(res, fallbackMsg, null, 500);
};

export class AuthController {
    public static async signup(req: Request, res: Response): Promise<void> {
        try {
            const input = signupSchema.parse(req.body);
            const pending = await AuthService.signup(input);
            ResponseHandler.success(res, pending, "Verification code sent", 200);
        } catch (error) {
            handleError(res, error, "Signup failed");
        }
    }

    public static async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const input = verifyOtpSchema.parse(req.body);
            const session = await AuthService.verifyOtp(input);
            setAuthCookie(res, session.token, session.expiresAt);
            ResponseHandler.success(res, session, "Account verified successfully", 200);
        } catch (error) {
            handleError(res, error, "OTP verification failed");
        }
    }

    public static async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const input = resendOtpSchema.parse(req.body);
            await AuthService.resendOtp(input);
            ResponseHandler.success(res, null, "Verification code resent", 200);
        } catch (error) {
            handleError(res, error, "Resend OTP failed");
        }
    }

    public static async login(req: Request, res: Response): Promise<void> {
        try {
            const input = loginSchema.parse(req.body);
            const session = await AuthService.login(input);

            setAuthCookie(res, session.token, session.expiresAt);
            ResponseHandler.success(res, session, "Login successful", 200);
        } catch (error) {
            handleError(res, error, "Login failed");
        }
    }

    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            const auth = req.auth;

            if (auth) {
                await AuthService.logout(auth.tokenId).catch(() => {});
            }

            clearAuthCookie(res);
            ResponseHandler.success(res, null, "Logged out successfully", 200);
        } catch (error) {
            handleError(res, error, "Logout failed");
        }
    }

    public static async googleRedirect(_req: Request, res: Response): Promise<void> {
        try {
            const url = await AuthService.googleRedirect();
            res.redirect(url);
        } catch (error) {
            handleError(res, error, "Google sign-in failed");
        }
    }

    public static async googleCallback(req: Request, res: Response): Promise<void> {
        const { code, state, error } = req.query as {
            code?: string;
            state?: string;
            error?: string;
        };

        if (error || !code || !state) {
            res.redirect(`${env.CORS_ORIGIN}/login?error=google_cancelled`);
            return;
        }

        try {
            const session = await AuthService.googleCallback({ code, state });
            setAuthCookie(res, session.token, session.expiresAt);
            res.redirect(`${env.CORS_ORIGIN}/memories`);
        } catch (err) {
            console.error("Google callback failed", err);
            res.redirect(`${env.CORS_ORIGIN}/login?error=google_failed`);
        }
    }

    public static async verifySession(req: Request, res: Response): Promise<void> {
        try {
            const auth = req.auth;

            if (!auth) {
                ResponseHandler.error(res, "Authentication required", null, 401);
                return;
            }

            const user = await AuthModel.findUserById(auth.userId);

            if (!user) {
                ResponseHandler.error(res, "User not found", null, 404);
                return;
            }

            ResponseHandler.success(res, toPublicUser(user), "User fetched successfully", 200);
        } catch (error) {
            handleError(res, error, "Failed to fetch user");
        }
    }
}
