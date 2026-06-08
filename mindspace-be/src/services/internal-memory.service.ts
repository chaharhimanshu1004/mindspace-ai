import { MemoryModel } from "../models/memory.model";
import { MemoryQueueService } from "./memoryQueue.service";
import type { UpsertFromSourceInput } from "../schemas/internal-memory.schema";

interface UpsertResult {
    memoryId: string;
    changed: boolean;
    created: boolean;
}

export class InternalMemoryService {
    public static async upsertFromSource(input: UpsertFromSourceInput): Promise<UpsertResult> {
        const result = await MemoryModel.upsertContentBySource({
            userId: input.userId,
            content: input.content,
            sourceType: input.sourceType,
            sourceRef: input.sourceRef,
            sourceMeta: input.sourceMeta as object,
        });

        if (result.changed) {
            await MemoryQueueService.enqueueForEnrichment({
                memoryId: result.id,
                userId: input.userId,
            });
        }

        return {
            memoryId: result.id,
            changed: result.changed,
            created: result.created,
        };
    }
}
