export const chatKeys = {
    all: ["chat"] as const,
    history: () => ["chat", "history"] as const,
};
