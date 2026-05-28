import { AppError } from "./app-error";

export const memoryNotFoundError = (): AppError =>
    new AppError({
        message: "Memory not found.",
        status: 404,
        code: "MEMORY_NOT_FOUND",
    });
