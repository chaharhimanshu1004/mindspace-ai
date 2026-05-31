import { env } from "../config/env";
import { prisma } from "../db/prisma";
import {
    AiEngineConnector,
    type SearchHit,
} from "../connectors/ai-engine.connector";
import { GeminiConnector } from "../connectors/gemini.connector";
import { noMemoriesError } from "../errors/chat-errors";
import { ChatModel } from "../models/chat.model";
import {
    chatAnswerSchema,
    chatGeminiResponseSchema,
    type ChatAnswerLLM,
} from "../utils/chat.geminiSchema";
import { CHAT_SYSTEM, buildChatPrompt } from "../utils/chat.prompt";
import type {
    ChatAnswer,
    ChatHistoryPage,
    ChatSource,
} from "../schemas/chat.types";

interface AskArgs {
    userId: number;
    message: string;
}

interface HistoryArgs {
    userId: number;
    limit: number;
    cursor?: string;
}

const HISTORY_CONTEXT_LIMIT = 6;

const toSources = (
    hits: SearchHit[],
    citedIds: string[],
): ChatSource[] => {
    const cited = new Set(citedIds);
    return hits.map((hit) => ({
        memoryId: hit.memoryId,
        title: hit.title,
        content: hit.content,
        cited: cited.has(hit.memoryId),
        createdAt: hit.createdAt,
    }));
};

const callLlm = (
    question: string,
    hits: SearchHit[],
    history: { role: "user" | "assistant"; content: string }[],
): Promise<ChatAnswerLLM> =>
    GeminiConnector.completeStructured<ChatAnswerLLM>({
        system: CHAT_SYSTEM,
        prompt: buildChatPrompt({ question, sources: hits, history }),
        schema: chatGeminiResponseSchema,
        parse: (raw) => chatAnswerSchema.parse(JSON.parse(raw)),
    });

export class ChatService {
    public static async ask(args: AskArgs): Promise<ChatAnswer> {
        const conversation = await ChatModel.findOrCreateConversation(args.userId);

        const hits = await AiEngineConnector.search({
            userId: args.userId,
            query: args.message,
            limit: env.CHAT_TOP_K,
        });

        if (hits.length === 0) throw noMemoriesError();

        const recent = await ChatModel.listRecentForContext({
            conversationId: conversation.id,
            limit: HISTORY_CONTEXT_LIMIT,
        });
        const history = recent
            .slice()
            .reverse()
            .map((m) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            }));

        const llm = await callLlm(args.message, hits, history);
        const sources = toSources(hits, llm.citedMemoryIds);

        await ChatModel.appendMessage({
            conversationId: conversation.id,
            role: "user",
            content: args.message,
        });

        const assistantMsg = await ChatModel.appendMessage({
            conversationId: conversation.id,
            role: "assistant",
            content: llm.answer,
            retrievedIds: llm.citedMemoryIds,
        });

        return {
            messageId: assistantMsg.id,
            answer: llm.answer,
            sources,
            createdAt: assistantMsg.createdAt.toISOString(),
        };
    }

    public static async history(args: HistoryArgs): Promise<ChatHistoryPage> {
        const conversation = await ChatModel.findOrCreateConversation(args.userId);
        const { items, nextCursor } = await ChatModel.listMessages({
            conversationId: conversation.id,
            limit: args.limit,
            cursor: args.cursor,
        });

        const memoryIds = Array.from(
            new Set(items.flatMap((m) => m.retrievedIds))
        );

        const memories = memoryIds.length > 0
            ? await prisma.memory.findMany({
                  where: { id: { in: memoryIds } },
                  select: {
                      id: true,
                      title: true,
                      content: true,
                      createdAt: true,
                  },
              })
            : [];

        const memoryMap = new Map(memories.map((m) => [m.id, m]));

        return {
            items: items.map((m) => {
                const sources = m.retrievedIds
                    .map((id) => {
                        const memory = memoryMap.get(id);
                        if (!memory) return null;
                        return {
                            memoryId: id,
                            title: memory.title,
                            content: memory.content,
                            cited: true,
                            createdAt: memory.createdAt.toISOString(),
                        };
                    })
                    .filter((s): s is NonNullable<typeof s> => s !== null);

                return {
                    id: m.id,
                    role: m.role as "user" | "assistant",
                    content: m.content,
                    sources,
                    createdAt: m.createdAt.toISOString(),
                };
            }),
            nextCursor,
        };
    }
}
