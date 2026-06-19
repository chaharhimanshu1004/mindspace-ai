export interface GuideNavItem {
    id: string;
    label: string;
}

export interface GuideNavGroup {
    title: string;
    items: GuideNavItem[];
}

export const guideNav: GuideNavGroup[] = [
    {
        title: "Getting started",
        items: [
            { id: "overview", label: "Overview" },
            { id: "quickstart", label: "Quickstart" },
        ],
    },
    {
        title: "Integrations",
        items: [
            { id: "claude", label: "Claude Code (MCP)" },
            { id: "slack", label: "Slack" },
            { id: "telegram", label: "Telegram" },
            { id: "calendar", label: "Google Calendar" },
        ],
    },
    {
        title: "Using MindSpace",
        items: [
            { id: "capturing", label: "Capturing memories" },
            { id: "asking", label: "Asking questions" },
        ],
    },
    {
        title: "Reference",
        items: [
            { id: "lifecycle", label: "Memory lifecycle" },
            { id: "faq", label: "FAQ" },
        ],
    },
];
