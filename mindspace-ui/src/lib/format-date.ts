const IST_OPTS_FULL: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
};

const IST_OPTS_DATE_ONLY: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
};

const IST_OPTS_TIME_ONLY: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
};

export const formatIst = (iso: string): string =>
    new Date(iso).toLocaleString("en-IN", IST_OPTS_FULL);

export const formatIstDate = (iso: string): string =>
    new Date(iso).toLocaleDateString("en-IN", IST_OPTS_DATE_ONLY);

export const formatIstTime = (iso: string): string =>
    new Date(iso).toLocaleTimeString("en-IN", IST_OPTS_TIME_ONLY);
