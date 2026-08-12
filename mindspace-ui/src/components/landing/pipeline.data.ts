import type { PipelineStep } from "./pipeline.types";

export const pipelineSteps: PipelineStep[] = [
    {
        index: "01",
        title: "Capture",
        body: "Type it, roll up a Slack channel, or message the bot.",
        detail: "user_text · slack · telegram · claude_code",
    },
    {
        index: "02",
        title: "Embed and enrich",
        body: "Chunked and vectorised, then titled and tagged by a model.",
        detail: "768 dimensions · gemini-2.5-flash",
    },
    {
        index: "03",
        title: "Retrieve",
        body: "Ask in plain words. Answers come back cited.",
        detail: "pgvector · cited answers",
    },
];
