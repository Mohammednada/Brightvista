import { motion } from "motion/react";
import { FileText } from "lucide-react";
import type { CaseStatus } from "../state/case-builder-state";

const statusConfig: Record<CaseStatus, { label: string; bg: string; text: string }> = {
  draft: { label: "Draft", bg: "bg-[#f0f2f4]", text: "text-[#717182]" },
  "in-progress": { label: "In Progress", bg: "bg-[#dbeafe]", text: "text-[#2563eb]" },
  submitted: { label: "Submitted", bg: "bg-[#dcfce7]", text: "text-[#099F69]" },
};

interface CaseHeaderProps {
  caseId: string;
  status: CaseStatus;
}

export function CaseHeader({ caseId, status }: CaseHeaderProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
          <FileText size={16} className="text-brand" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-text-primary leading-tight">{caseId}</p>
          <p className="text-[11px] text-text-muted leading-tight">New PA Case</p>
        </div>
      </div>
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    </motion.div>
  );
}
