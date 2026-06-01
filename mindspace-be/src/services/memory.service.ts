import { MemoryModel } from "../models/memory.model";
import { MemoryQueueService } from "./memoryQueue.service";
import { memoryNotFoundError } from "../errors/memory-errors";
import { toPublicMemory } from "../utils/memory.mapper";

import type { CreateMemoryInput, ListMemoriesInput } from "../schemas/memory.schema";
import type { MemoryListPage, PublicMemory } from "../schemas/memory.types";

interface CreateArgs {
    userId: number;
    input: CreateMemoryInput;
}

interface ListArgs {
    userId: number;
    input: ListMemoriesInput;
}

interface GetArgs {
    userId: number;
    id: string;
}

export class MemoryService {
    public static async create(args: CreateArgs): Promise<PublicMemory> {
        const memory = await MemoryModel.create({
            userId: args.userId,
            content: args.input.content,
        });

        try {
            await MemoryQueueService.enqueueForEnrichment({
                memoryId: memory.id,
                userId: memory.userId,
            });
        } catch (err) {
            console.error("Failed to enqueue memory for enrichment", {
                memoryId: memory.id,
                userId: memory.userId,
                err,
            });
        }

        return toPublicMemory(memory);
    }

    public static async list(args: ListArgs): Promise<MemoryListPage> {
        const { items, nextCursor } = await MemoryModel.listForUser({
            userId: args.userId,
            limit: args.input.limit,
            cursor: args.input.cursor,
        });

        return {
            items: items.map(toPublicMemory),
            nextCursor,
        };
    }

    public static async get(args: GetArgs): Promise<PublicMemory> {
        const memory = await MemoryModel.findByIdForUser({
            id: args.id,
            userId: args.userId,
        });

        if (!memory) throw memoryNotFoundError();

        return toPublicMemory(memory);
    }

    public static async delete(args: GetArgs): Promise<void> {
        const memory = await MemoryModel.findByIdForUser({
            id: args.id,
            userId: args.userId,
        });

        if (!memory) throw memoryNotFoundError();

        await MemoryModel.delete(args);
    }
}
