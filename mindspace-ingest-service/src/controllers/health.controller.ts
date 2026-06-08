import type { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";

export class HealthController {
    public static get(_req: Request, res: Response): void {
        ResponseHandler.success(res, { status: "ok" }, "Crons service healthy", 200);
    }
}
