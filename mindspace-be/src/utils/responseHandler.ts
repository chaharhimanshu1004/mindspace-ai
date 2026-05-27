import type { Response } from "express";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: unknown;
    code: number;
}

export class ResponseHandler {
    public static success<T>(
        res: Response,
        data: T,
        message = "Request successful",
        code = 200
    ) {
        const response: ApiResponse<T> = {
            success: true,
            message,
            code,
            data,
        };
        return res.status(code).json(response);
    }

    public static error(
        res: Response,
        message = "Something went wrong",
        error: unknown = null,
        code = 500
    ) {
        const response: ApiResponse<null> = {
            success: false,
            message,
            code,
            error,
        };
        return res.status(code).json(response);
    }
}
