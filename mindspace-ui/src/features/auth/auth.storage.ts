const KEY = "mindspace.token";

export const authStorage = {
    get: (): string | null => {
        if (typeof window === "undefined") return null;
        return window.localStorage.getItem(KEY);
    },
    set: (token: string): void => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(KEY, token);
    },
    clear: (): void => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(KEY);
    },
};
