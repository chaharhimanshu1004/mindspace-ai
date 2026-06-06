import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { McpMemoryService } from "../services/mcp-memory.service";
import { AuthModel } from "../models/auth.model";
import { insufficientScopeError } from "../errors/oauth-errors";

interface AuthInfo {
    userId: number;
    scopes: string[];
}

export const buildMcpServer = (authInfo: AuthInfo): McpServer => {
    const { userId, scopes } = authInfo;

    const server = new McpServer({
        name: "mindspace",
        version: "1.0.0",
    });

    server.tool(
        "checkin",
        "Get current user info, memory count, and usage instructions. Call this first.",
        {},
        async () => {
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const user = await AuthModel.findUserById(userId);
            const result = await McpMemoryService.checkIn({
                userId,
                userEmail: user?.email ?? "",
            });
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        },
    );

    server.tool(
        "save_memory",
        "Save a thought, insight, decision, or idea to MindSpace. Min 40 characters.",
        {
            content: z.string().min(1).describe("The memory content to save"),
            kind: z.string().optional().describe("Type: reflection, idea, task, code, decision"),
            session_id: z.string().optional().describe("Current session or conversation ID"),
        },
        async (args) => {
            if (!scopes.includes("memories:write")) throw insufficientScopeError();

            const result = await McpMemoryService.save({
                userId,
                content: args.content,
                kind: args.kind,
                sessionId: args.session_id,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        },
    );

    server.tool(
        "search_memories",
        "Search the user's memories using semantic search.",
        {
            query: z.string().min(1).describe("Natural language search query"),
            limit: z.number().int().min(1).max(20).optional().describe("Max results, default 8"),
        },
        async (args) => {
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const results = await McpMemoryService.search({
                userId,
                query: args.query,
                limit: args.limit,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
            };
        },
    );

    server.tool(
        "get_memory",
        "Get full content of a specific memory by ID.",
        {
            memory_id: z.string().uuid().describe("The memory ID to retrieve"),
        },
        async (args) => {
            if (!scopes.includes("memories:read")) throw insufficientScopeError();
            const memory = await McpMemoryService.get({ userId, memoryId: args.memory_id });
            return {
                content: [{ type: "text", text: memory ? JSON.stringify(memory, null, 2) : "Memory not found" }],
            };
        },
    );

    return server;
};
