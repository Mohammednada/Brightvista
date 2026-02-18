import { Sparkles } from "lucide-react";
import { morningBriefing } from "@/mock/shared";

export function MorningBriefing() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={12} className="text-brand" />
        <span
          className="text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-text-muted font-bold"
        >
          Morning Briefing
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="text-[16px] leading-[1.35] text-[#1a1a1a] capitalize font-semibold"
        >
          {morningBriefing.heading}
        </p>
        <p
          className="text-[14px] leading-[22.75px] text-[#737373] font-medium"
        >
          {morningBriefing.description}
        </p>
      </div>
    </div>
  );
}
