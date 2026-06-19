import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";
import { GuideCallout } from "../guide-callout";
import { IntegrationHeader } from "../integration-header";
import { GoogleCalendarIcon } from "@/components/landing/icons/google-calendar-icon";

export function CalendarSection() {
    return (
        <GuideSection
            id="calendar"
            eyebrow="integration"
            title="Google Calendar"
            intro="When a thought carries a deadline, MindSpace can place it on your calendar — so intentions you jot down don't quietly slip away."
        >
            <div className="rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
                <IntegrationHeader
                    icon={GoogleCalendarIcon}
                    brand
                    title="Deadline sync"
                    tagline="Enriched notes become calendar events"
                />

                <div className="mt-8">
                    <GuideStep n={1} title="Connect your Google account">
                        <p>
                            Open Settings → Integrations → Google Calendar and
                            press Connect. Approve the Google consent screen to
                            grant calendar access.
                        </p>
                    </GuideStep>

                    <GuideStep n={2} title="Write thoughts with deadlines">
                        <p>
                            Capture a note that mentions a due date — for
                            example{" "}
                            <span className="italic">
                                “ship the reconciliation worker by Friday”
                            </span>
                            .
                        </p>
                    </GuideStep>

                    <GuideStep n={3} title="Watch it land on your calendar" last>
                        <p>
                            During enrichment, MindSpace detects the deadline
                            and creates a matching calendar event automatically
                            — no manual entry.
                        </p>
                    </GuideStep>
                </div>

                <div className="mt-2">
                    <GuideCallout>
                        Calendar sync applies to thoughts you type yourself.
                        It triggers only when a real deadline is detected, so
                        your calendar stays clean.
                    </GuideCallout>
                </div>
            </div>
        </GuideSection>
    );
}
