import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { NotificationCard } from "@/app/components/shared/notification-card";
import type { NotificationCardProps } from "@/shared/types";

const notifications: NotificationCardProps[] = [
  {
    severity: "urgent",
    severityLabel: "URGENT",
    context: "Risk of Delayed MRI",
    title: "Imaging RFIs Approaching SLA Breach",
    description:
      "7 Imaging prior authorization cases have open RFIs with less than 24 hours remaining before payer deadlines.",
    recommendation:
      "Escalate all Imaging RFIs older than 48 hours and prioritize agent-led follow-up.",
    meta: "Payer SLA",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Increased appeals workload",
    title: "Orthopedics MRI Denial Spike Detected",
    description:
      "Orthopedics MRI approvals dropped by 18% this week, primarily due to missing conservative therapy documentation.",
    recommendation:
      "Enable stricter pre-submit documentation checks for Orthopedics MRI cases.",
    meta: "Payer SLA",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Potential patient care delays",
    title: "Stalled Prior Authorizations",
    description:
      '5 prior authorization requests across multiple payers have remained in "In Review" status for more than 7 business days.',
    recommendation:
      "Authorize escalation calls to payer representatives for all stalled cases.",
    meta: "Payer SLA",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Potential uncovered device costs",
    title: "Partial Approval Risk Identified",
    description:
      "2 upcoming joint replacement authorizations were approved without explicit confirmation of implant coverage.",
    recommendation:
      "Initiate clarification requests with payers before procedures are scheduled.",
    meta: "Payer SLA",
  },
];

export function NeedsAttention({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useClickOutside(sortRef, () => setSortOpen(false));

  return (
    <div className="bg-surface-bg w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            Needs Attention
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Here's some issues needing your attention
          </p>
        </div>
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]"
          >
            <span
              className="text-[14px] leading-[18px] text-[#111417] font-semibold"
            >
              Sort by
            </span>
            <ChevronDown size={16} className="text-[#111417]" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-border-default rounded-lg shadow-lg z-20 w-[140px]">
              {["Priority", "Date", "Department"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-bg text-text-secondary cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NotificationCard {...notifications[0]} onAskAgent={onAskAgent} />
          <NotificationCard {...notifications[1]} onAskAgent={onAskAgent} />
        </div>
        <div className="flex gap-4">
          <NotificationCard {...notifications[2]} onAskAgent={onAskAgent} />
          <NotificationCard {...notifications[3]} onAskAgent={onAskAgent} />
        </div>
      </div>
    </div>
  );
}
