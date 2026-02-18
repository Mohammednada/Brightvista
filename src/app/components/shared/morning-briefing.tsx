import { Sparkles } from "lucide-react";
import { morningBriefing } from "@/mock/shared";
import { useDashboardAnalytics, useBackendHealth } from "@/hooks/use-api";

export function MorningBriefing() {
  const { data } = useDashboardAnalytics();
  const connected = useBackendHealth();
  const briefing = data.morning_briefing?.heading ? data.morning_briefing : morningBriefing;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={12} className="text-brand" />
        <span
          className="text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-text-muted font-bold"
        >
          Morning Briefing
        </span>
        {connected && (
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-[#059669] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            Live
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="text-[16px] leading-[1.35] text-[#1a1a1a] capitalize font-semibold"
        >
          {briefing.heading}
        </p>
        <p
          className="text-[14px] leading-[22.75px] text-[#737373] font-medium"
        >
          {briefing.description}
        </p>
      </div>
    </div>
  );
}
