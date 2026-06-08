import type { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
    interface Request {
        rawBody?: string;
    }
}

export const captureRawBody = (
    req: Request,
    _res: Response,
    next: NextFunction,
): void => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk: string) => {
        data += chunk;
    });
    req.on("end", () => {
        req.rawBody = data;
        try {
            req.body = data.length > 0 ? JSON.parse(data) : {};
        } catch {
            req.body = {};
        }
        next();
    });
    req.on("error", (err) => next(err));
};
