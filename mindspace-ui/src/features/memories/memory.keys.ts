export const memoryKeys = {
    all: ["memories"] as const,
    list: (sourceType?: string) => [...memoryKeys.all, "list", sourceType ?? "all"] as const,
    detail: (id: string) => [...memoryKeys.all, "detail", id] as const,
};
