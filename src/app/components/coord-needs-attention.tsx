import { AlertTriangle, Sparkles, ArrowRight } from "lucide-react";

interface CoordNotificationProps {
  severity: "urgent" | "high" | "medium";
  severityLabel: string;
  context?: string;
  title: string;
  description: string;
  recommendation: string;
  meta: string;
  onAskAgent?: (text: string) => void;
}

function CoordNotificationCard({
  severity,
  severityLabel,
  context,
  title,
  description,
  recommendation,
  meta,
  onAskAgent,
}: CoordNotificationProps) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle size={16} color={iconColors[severity]} />
          <span className="text-[11px] leading-[18px] font-['Ubuntu_Sans',sans-serif]">
            <span className={`uppercase ${severityColors[severity]}`} style={{ fontWeight: 600 }}>
              {severityLabel}
            </span>
            {context && (
              <>
                <span className="text-[#4d595e] uppercase" style={{ fontWeight: 600 }}> &middot; </span>
                <span className="text-[#4d595e] capitalize" style={{ fontWeight: 500 }}>{context}</span>
              </>
            )}
          </span>
        </div>
        <span className="text-[11px] leading-[18px] text-[#97a6b4] font-['Ubuntu_Sans',sans-serif] shrink-0" style={{ fontWeight: 500 }}>
          {meta}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-['Ubuntu_Sans',sans-serif] text-[16px] leading-[22px] text-[#1b2124]" style={{ fontWeight: 600 }}>
          {title}
        </p>
        <p className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[1.5] text-[#4d595e]" style={{ fontWeight: 400 }}>
          {description}
        </p>
      </div>
      <div className="flex-1 bg-[#f7fafc] rounded-lg flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#1F425F] shrink-0" />
            <span className="text-[11px] leading-[20px] text-[#1f425f] tracking-[1.1px] font-['Ubuntu_Sans',sans-serif]" style={{ fontWeight: 600 }}>
              Agent Recommendation
            </span>
          </div>
          <p className="text-[12px] leading-[1.5] text-[#565656] tracking-[0.2px] font-['Ubuntu_Sans',sans-serif]" style={{ fontWeight: 600 }}>
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

const coordNotifications: CoordNotificationProps[] = [
  {
    severity: "urgent",
    severityLabel: "URGENT",
    context: "SLA at risk",
    title: "MRI Authorization Expiring in 4 Hours",
    description:
      "Patient Margaret Thompson's MRI lumbar spine authorization requires additional conservative therapy documentation before the payer deadline.",
    recommendation:
      "Upload the missing PT notes from Dr. Patel and resubmit before 2:00 PM today.",
    meta: "Due Today",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Missing documentation",
    title: "Cardiac Cath Pre-Auth Stalled",
    description:
      "Lisa Rodriguez's cardiac catheterization request has been in pending status for 3 days due to missing cardiac stress test results.",
    recommendation:
      "Contact Cardiology dept to obtain stress test results and attach to case PA-2024-1839.",
    meta: "3 Days Pending",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Appeal window closing",
    title: "PT Sessions Denial Appeal Deadline",
    description:
      "James Wilson's physical therapy 12-session request was denied by Cigna. You have 5 days remaining to file an appeal with peer-to-peer review.",
    recommendation:
      "Prepare appeal with updated clinical notes and request peer-to-peer with Cigna medical director.",
    meta: "5 Days Left",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Verification needed",
    title: "Insurance Eligibility Discrepancy",
    description:
      "David Kim's dermatology biopsy authorization shows a coverage discrepancy \u2014 the procedure code may not be covered under his current plan tier.",
    recommendation:
      "Verify benefits with Kaiser Permanente and confirm CPT code 11102 coverage before scheduling.",
    meta: "Action Required",
  },
];

export function CoordinatorNeedsAttention({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="bg-[#f7fafc] w-full px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p className="font-['Ubuntu_Sans',sans-serif] text-[21px] leading-[32px] text-[#1b2124]" style={{ fontWeight: 700 }}>
            My Action Items
          </p>
          <p className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#4d595e]">
            Tasks requiring your immediate action
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <CoordNotificationCard {...coordNotifications[0]} onAskAgent={onAskAgent} />
          <CoordNotificationCard {...coordNotifications[1]} onAskAgent={onAskAgent} />
        </div>
        <div className="flex gap-4">
          <CoordNotificationCard {...coordNotifications[2]} onAskAgent={onAskAgent} />
          <CoordNotificationCard {...coordNotifications[3]} onAskAgent={onAskAgent} />
        </div>
      </div>
    </div>
  );
}
