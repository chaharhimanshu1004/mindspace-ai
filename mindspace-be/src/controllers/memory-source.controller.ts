import type { Request, Response } from "express";
import { MemorySourceModel } from "../models/memory-source.model";
import { ResponseHandler } from "../utils/responseHandler";

export class MemorySourceController {
    public static async list(_req: Request, res: Response): Promise<void> {
        try {
            const sources = await MemorySourceModel.findAll();
            ResponseHandler.success(res, sources, "Sources fetched", 200);
        } catch (error) {
            console.error("Failed to fetch memory sources", error);
            ResponseHandler.error(res, "Failed to fetch memory sources", null, 500);
        }
    }
}
