const UNITS: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
};

export const parseDurationMs = (input: string): number => {
    const trimmed = input.trim();
    const match = /^(\d+)\s*([smhd])$/i.exec(trimmed);
    if (!match) throw new Error(`Invalid duration: "${input}"`);
    const value = Number(match[1]);
    const unit = match[2].toLowerCase();
    const ms = UNITS[unit];
    if (!ms) throw new Error(`Unknown duration unit: "${unit}"`);
    return value * ms;
};
