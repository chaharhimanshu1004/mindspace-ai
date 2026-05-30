import { QueueConnector } from "../connectors/queue.connector";
import { StreamKeys } from "../utils/streamKeys";

interface EnqueueArgs {
    memoryId: string;
    userId: number;
}

export class MemoryQueueService {
    public static async enqueueForEnrichment(args: EnqueueArgs): Promise<string> {
        return QueueConnector.publish({
            stream: StreamKeys.MEMORY_ENRICH,
            payload: {
                memoryId: args.memoryId,
                userId: args.userId,
                attempt: 0,
                enqueuedAt: Date.now(),
            },
        });
    }
}
