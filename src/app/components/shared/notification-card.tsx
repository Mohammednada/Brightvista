import { AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import type { NotificationCardProps } from "@/shared/types";

export function NotificationCard({
  severity,
  severityLabel,
  context,
  title,
  description,
  recommendation,
  meta,
  onAskAgent,
}: NotificationCardProps) {
  const severityColors = {
    urgent: "text-[#d02241]",
    high: "text-[#d02241]",
    medium: "text-[#f3903f]",
  };
  const iconColors = {
    urgent: "#D02241",
    high: "#D02241",
    medium: "#F3903F",
  };

  return (
    <div className="flex-1 min-w-0 bg-card-bg rounded-2xl border border-border-default p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle size={16} color={iconColors[severity]} />
          <span className="text-[11px] leading-[18px]">
            <span
              className={`uppercase ${severityColors[severity]} font-semibold`}
            >
              {severityLabel}
            </span>
            {context && (
              <>
                <span className="text-text-secondary uppercase font-semibold">
                  {" "}
                  &middot;{" "}
                </span>
                <span
                  className="text-text-secondary capitalize font-medium"
                >
                  {context}
                </span>
              </>
            )}
          </span>
        </div>
        <span
          className="text-[11px] leading-[18px] text-text-muted shrink-0 font-medium"
        >
          {meta}
        </span>
      </div>
      {/* Body */}
      <div className="flex flex-col gap-1">
        <p
          className="text-[16px] leading-[22px] text-text-primary font-semibold"
        >
          {title}
        </p>
        <p
          className="text-[14px] leading-[1.5] text-text-secondary"
        >
          {description}
        </p>
      </div>
      {/* Footer */}
      <div className="flex-1 bg-surface-bg rounded-lg flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand shrink-0" />
            <span
              className="text-[11px] leading-[20px] text-brand tracking-[1.1px] font-semibold"
            >
              Agent Recommendation
            </span>
          </div>
          <p
            className="text-[12px] leading-[1.5] text-text-secondary tracking-[0.2px] font-semibold"
          >
            {recommendation}
          </p>
        </div>
        <button
          onClick={() => onAskAgent?.(recommendation)}
          className="w-8 h-8 bg-card-bg rounded-lg shadow-sm flex items-center justify-center shrink-0 hover:bg-surface-hover cursor-pointer"
        >
          <ArrowRight size={18} className="text-text-primary" />
        </button>
      </div>
    </div>
  );
}
