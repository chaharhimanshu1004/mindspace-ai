export interface SlackEmptyContext {
    connected: boolean;
    hasSubscriptions: boolean;
    onConnect: () => void;
    onOpenPicker: () => void;
}

export interface TelegramEmptyContext {
    connected: boolean;
    onConnect: () => void;
}

export interface MemoryEmptyProps {
    sourceType?: string;
    slack?: SlackEmptyContext;
    telegram?: TelegramEmptyContext;
}
