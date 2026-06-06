import { prisma } from "../db/prisma";

export class MemorySourceModel {
    public static async findAll() {
        return prisma.memorySource.findMany({ orderBy: { sortOrder: "asc" } });
    }
}
