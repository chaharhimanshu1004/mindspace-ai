import { redis } from "../db/redis";

type StreamFieldValue = string | number;
type StreamPayload = Record<string, StreamFieldValue>;

interface PublishArgs {
    stream: string;
    payload: StreamPayload;
}

const flattenPayload = (payload: StreamPayload): string[] => {
    const out: string[] = [];
    for (const [key, value] of Object.entries(payload)) {
        out.push(key, String(value));
    }
    return out;
};

export class QueueConnector {
    public static async publish(args: PublishArgs): Promise<string> {
        const fields = flattenPayload(args.payload);
        const id = await redis.xadd(args.stream, "*", ...fields);
        if (!id) {
            throw new Error(`XADD returned no id for stream ${args.stream}`);
        }
        return id;
    }
}
