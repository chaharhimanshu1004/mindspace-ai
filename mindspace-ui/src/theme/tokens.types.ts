export interface SurfaceTokens {
    paper: string;
    s1: string;
    s2: string;
    s3: string;
}

export interface InkTokens {
    base: string;
    muted: string;
    subtle: string;
    disabled: string;
}

export interface LineTokens {
    subtle: string;
    strong: string;
    interactive: string;
}

export interface AccentTokens {
    t50: string;
    t100: string;
    t200: string;
    t400: string;
    t500: string;
    t600: string;
    t700: string;
}

export interface SemanticTriple {
    fg: string;
    tint: string;
    line: string;
}

export interface SourceTokens {
    user: string;
    claude: string;
    slack: string;
    telegram: string;
}

export interface ThemeTokens {
    surface: SurfaceTokens;
    ink: InkTokens;
    line: LineTokens;
    accent: AccentTokens;
    success: SemanticTriple;
    progress: SemanticTriple;
    danger: SemanticTriple;
    source: SourceTokens;
}
