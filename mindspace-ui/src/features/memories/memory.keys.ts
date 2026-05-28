export const memoryKeys = {
    all: ["memories"] as const,
    list: () => [...memoryKeys.all, "list"] as const,
    detail: (id: string) => [...memoryKeys.all, "detail", id] as const,
};
