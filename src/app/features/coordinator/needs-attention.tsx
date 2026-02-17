import { NotificationCard } from "@/app/components/shared/notification-card";
import type { NotificationCardProps } from "@/shared/types";

const coordNotifications: NotificationCardProps[] = [
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
    <div className="bg-surface-bg w-full px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p className="text-[21px] leading-[32px] text-text-primary font-bold">
            My Action Items
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Tasks requiring your immediate action
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NotificationCard {...coordNotifications[0]} onAskAgent={onAskAgent} />
          <NotificationCard {...coordNotifications[1]} onAskAgent={onAskAgent} />
        </div>
        <div className="flex gap-4">
          <NotificationCard {...coordNotifications[2]} onAskAgent={onAskAgent} />
          <NotificationCard {...coordNotifications[3]} onAskAgent={onAskAgent} />
        </div>
      </div>
    </div>
  );
}
