import { SLACK_SYNC } from "./constants";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SLACK_SYNC.DAY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export const tsToIstDate = (ts: string): string => {
    const ms = Math.floor(Number(ts) * 1000);
    return dateFormatter.format(new Date(ms));
};

export const tsToIsoString = (ts: string): string =>
    new Date(Math.floor(Number(ts) * 1000)).toISOString();
