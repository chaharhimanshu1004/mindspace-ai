import type { ThemeTokens } from "./tokens.types";

export const tokens: ThemeTokens = {
    surface: {
        paper: "#FAF7F0",
        s1: "#FFFEFA",
        s2: "#F3EFE5",
        s3: "#EBE6D9",
    },
    ink: {
        base: "#24231F",
        muted: "#57524A",
        subtle: "#625C51",
        disabled: "#A9A294",
    },
    line: {
        subtle: "#E5DFD1",
        strong: "#D3CBB6",
        interactive: "#8A8271",
    },
    accent: {
        t50: "#F1EEE6",
        t100: "#E7E2D6",
        t200: "#D6D0C0",
        t400: "#8A8271",
        t500: "#24231F",
        t600: "#15140F",
        t700: "#24231F",
    },
    success: { fg: "#4F6B3E", tint: "#ECF0E1", line: "#CFDCBE" },
    progress: { fg: "#825313", tint: "#F8EFDC", line: "#E9D6AE" },
    danger: { fg: "#B3261E", tint: "#FBEBE7", line: "#F0C7C1" },
    source: {
        user: "#24231F",
        claude: "#8F5436",
        slack: "#714881",
        telegram: "#1B6874",
    },
};
