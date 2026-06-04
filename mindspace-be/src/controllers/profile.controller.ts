import type { Request, Response } from "express";
import { ZodError } from "zod";
import { updateProfileSchema } from "../schemas/profile.schema";
import { ProfileService } from "../services/profile.service";
import { AppError } from "../errors/app-error";
import { ResponseHandler } from "../utils/responseHandler";

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

export class ProfileController {
    public static async update(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.auth!.userId;
            const input = updateProfileSchema.parse(req.body);
            const user = await ProfileService.update({ userId, input });
            ResponseHandler.success(res, user, "Profile updated", 200);
        } catch (error) {
            handleError(res, error, "Failed to update profile");
        }
    }
}
