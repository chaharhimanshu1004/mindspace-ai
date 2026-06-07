import { Router } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildMcpServer } from "../mcp/server";
import { requireOAuthToken } from "../middlewares/require-oauth";
import type { IncomingMessage, ServerResponse } from "http";
import type { Request, Response } from "express";

const router = Router();

router.use(requireOAuthToken);

router.all("/", async (req: Request, res: Response) => {
    const authInfo = {
        userId: req.auth!.userId,
        scopes: req.auth!.scopes ?? [],
    };

    const server = buildMcpServer(authInfo);
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
    });

    res.on("close", () => {
        transport.close();
        server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(
        req as unknown as IncomingMessage,
        res as unknown as ServerResponse,
        req.body,
    );
});

export default router;
