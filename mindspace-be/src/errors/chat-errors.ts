import { AppError } from "./app-error";

export const noMemoriesError = (): AppError =>
    new AppError({
        message: "You don't have any memories yet — save a few thoughts first.",
        status: 422,
        code: "NO_MEMORIES",
    });
