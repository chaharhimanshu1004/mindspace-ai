import type { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";

export const notFoundHandler = (req: Request, res: Response): void => {
    ResponseHandler.error(res, `Route ${req.method} ${req.path} not found`, null, 404);
};
