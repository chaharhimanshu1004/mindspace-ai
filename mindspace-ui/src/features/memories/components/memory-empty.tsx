import { Sparkles, Plug, Hash } from "lucide-react";

export interface SlackEmptyContext {
    connected: boolean;
    hasSubscriptions: boolean;
    onConnect: () => void;
    onOpenPicker: () => void;
}

interface Props {
    slackContext?: SlackEmptyContext;
}

function SlackEmpty({ connected, hasSubscriptions, onConnect, onOpenPicker }: SlackEmptyContext) {
    if (!connected) {
        return (
            <div className="text-center pt-8 pb-20 sm:pt-10 sm:pb-28">
                <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F5FF] border border-[#6366F1]/20 text-[#6366F1]">
                    <Plug className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#2F3441]">
                    Slack isn&rsquo;t connected
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                    Connect your Slack workspace so MindSpace can start capturing your team conversations automatically.
                </p>
                <button
                    type="button"
                    onClick={onConnect}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6366F1] px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft hover:bg-[#4F46E5] transition-colors"
                >
                    Connect Slack →
                </button>
                <p className="mt-3 text-[11px] text-[#9CA3AF]">
                    Go to Profile → Integrations → Slack
                </p>
            </div>
        );
    }

    if (!hasSubscriptions) {
        return (
            <div className="text-center py-20 sm:py-28">
                <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                    <Hash className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#2F3441]">
                    No channels selected yet
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                    Slack is connected but you haven&rsquo;t subscribed to any channels. Pick the ones you want MindSpace to watch.
                </p>
                <button
                    type="button"
                    onClick={onOpenPicker}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-soft hover:bg-amber-600 transition-colors"
                >
                    Select channels to sync →
                </button>
                <p className="mt-3 text-[11px] text-[#9CA3AF]">
                    Go to Profile → Integrations → Slack → Select channels
                </p>
            </div>
        );
    }

    return (
        <div className="text-center py-20 sm:py-28">
            <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)]">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#6366F1]/25" />
                <Sparkles className="relative h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2F3441]">
                Syncing soon
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                Your channels are subscribed. New messages will appear here automatically after the next sync.
            </p>
        </div>
    );
}

export function MemoryEmpty({ slackContext }: Props) {
    if (slackContext) {
        return <SlackEmpty {...slackContext} />;
    }

    return (
        <div className="text-center py-20 sm:py-28">
            <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)]">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#6366F1]/25" />
                <Sparkles className="relative h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2F3441]">
                A quiet beginning
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                Write your first thought below. It&rsquo;ll quietly find its
                place among everything else you save.
            </p>
        </div>
    );
}
