import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Sparkles, ArrowRight, ChevronDown } from "lucide-react";

interface NotificationCardProps {
  severity: "urgent" | "high" | "medium";
  severityLabel: string;
  context?: string;
  title: string;
  description: string;
  recommendation: string;
  meta: string;
  onAskAgent?: (text: string) => void;
}

function NotificationCard({
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
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#e5e5e5] p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle size={16} color={iconColors[severity]} />
          <span className="text-[11px] leading-[18px] font-['Ubuntu_Sans',sans-serif]">
            <span
              className={`uppercase ${severityColors[severity]}`}
              style={{ fontWeight: 600 }}
            >
              {severityLabel}
            </span>
            {context && (
              <>
                <span className="text-[#4d595e] uppercase" style={{ fontWeight: 600 }}>
                  {" "}
                  ·{" "}
                </span>
                <span
                  className="text-[#4d595e] capitalize"
                  style={{ fontWeight: 500 }}
                >
                  {context}
                </span>
              </>
            )}
          </span>
        </div>
        <span
          className="text-[11px] leading-[18px] text-[#97a6b4] font-['Ubuntu_Sans',sans-serif] shrink-0"
          style={{ fontWeight: 500 }}
        >
          {meta}
        </span>
      </div>
      {/* Body */}
      <div className="flex flex-col gap-1">
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[16px] leading-[22px] text-[#1b2124]"
          style={{ fontWeight: 600 }}
        >
          {title}
        </p>
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[1.5] text-[#4d595e]"
          style={{ fontWeight: 400 }}
        >
          {description}
        </p>
      </div>
      {/* Footer */}
      <div className="flex-1 bg-[#f7fafc] rounded-lg flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#1F425F] shrink-0" />
            <span
              className="text-[11px] leading-[20px] text-[#1f425f] tracking-[1.1px] font-['Ubuntu_Sans',sans-serif]"
              style={{ fontWeight: 600 }}
            >
              Agent Recommendation
            </span>
          </div>
          <p
            className="text-[12px] leading-[1.5] text-[#565656] tracking-[0.2px] font-['Ubuntu_Sans',sans-serif]"
            style={{ fontWeight: 600 }}
          >
            {recommendation}
          </p>
        </div>
        <button
          onClick={() => onAskAgent?.(recommendation)}
          className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowRight size={18} className="text-[#1B2124]" />
        </button>
      </div>
    </div>
  );
}

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-[#f7fafc] w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p
            className="font-['Ubuntu_Sans',sans-serif] text-[21px] leading-[32px] text-[#1b2124]"
            style={{ fontWeight: 700 }}
          >
            Needs Attention
          </p>
          <p className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#4d595e]">
            Here's some issues needing your attention
          </p>
        </div>
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="bg-[#ebf2f5] rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]"
          >
            <span
              className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#111417]"
              style={{ fontWeight: 600 }}
            >
              Sort by
            </span>
            <ChevronDown size={16} className="text-[#111417]" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-20 w-[140px]">
              {["Priority", "Date", "Department"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-[13px] font-['Ubuntu_Sans',sans-serif] hover:bg-[#f7fafc] text-[#4d595e] cursor-pointer"
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