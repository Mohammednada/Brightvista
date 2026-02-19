import { motion } from "motion/react";
import {
  User,
  Stethoscope,
  Shield,
  FileText,
  Send,
  TrendingUp,
  CheckCircle,
  Pencil,
} from "lucide-react";
import type { CaseScreenData } from "./agent-desktop/case-data-context";

// ── ReviewCard ──────────────────────────────────────────────────────────────

interface ReviewCardProps {
  onApprove: () => void;
  onEdit: () => void;
  caseData?: CaseScreenData | null;
}

export function ReviewCard({ onApprove, onEdit, caseData }: ReviewCardProps) {
  const d = caseData;

  const patientName = d?.patient.name || "—";
  const dob = d ? `${d.patient.dob} (Age ${d.patient.age})` : "—";
  const mrn = d?.patient.mrn || "—";
  const procedureName = d?.procedure.cptDescription || "—";
  const cptCode = d?.procedure.cptCode || "—";
  const diagnosis = d ? `${d.procedure.icd10Description} (${d.procedure.icd10Code})` : "—";
  const physician = d?.physician || "—";
  const payerLine = d ? `${d.insurance.payerFull} — ${d.insurance.planType}` : "—";
  const memberId = d?.insurance.memberId || "—";
  const channelLabel = d?.submission.channelLabel || "—";
  const docList = d?.documents.list ?? [
    "Conservative Therapy Records (8 weeks PT)",
    "Specialist Referral Letter (Feb 10)",
    "Physical Exam Notes (Feb 12)",
    "Medication History",
  ];
  const approvalLikelihood = d?.approvalLikelihood ?? 92;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-border-default overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#f0f7ff] to-[#fafbfc] border-b border-border-default">
        <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
          <FileText size={14} className="text-brand" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-text-primary">PA Submission Review</p>
          <p className="text-[11px] text-text-muted">Please review and approve before submission</p>
        </div>
      </div>

      {/* Summary sections */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Patient */}
        <ReviewSection icon={<User size={13} />} title="Patient">
          <ReviewRow label="Name" value={patientName} />
          <ReviewRow label="DOB" value={dob} />
          <ReviewRow label="MRN" value={mrn} />
        </ReviewSection>

        {/* Procedure */}
        <ReviewSection icon={<Stethoscope size={13} />} title="Procedure">
          <ReviewRow label="Procedure" value={procedureName} />
          <ReviewRow label="CPT Code" value={cptCode} />
          <ReviewRow label="Diagnosis" value={diagnosis} />
          <ReviewRow label="Physician" value={physician} />
        </ReviewSection>

        {/* Payer */}
        <ReviewSection icon={<Shield size={13} />} title="Payer & Channel">
          <ReviewRow label="Payer" value={payerLine} />
          <ReviewRow label="Member ID" value={memberId} />
          <ReviewRow label="Channel" value={channelLabel} />
        </ReviewSection>

        {/* Documents */}
        <ReviewSection icon={<FileText size={13} />} title="Documents Attached">
          <div className="flex flex-col gap-1">
            {docList.map((doc) => (
              <div key={doc} className="flex items-center gap-1.5">
                <CheckCircle size={11} className="text-[#099F69] shrink-0" />
                <span className="text-[11px] text-text-secondary">{doc}</span>
              </div>
            ))}
          </div>
        </ReviewSection>

        {/* Approval gauge inline */}
        <div className="flex items-center gap-2 bg-[#dcfce7] rounded-lg px-3 py-2">
          <TrendingUp size={14} className="text-[#099F69]" />
          <span className="text-[12px] font-semibold text-[#099F69]">{approvalLikelihood}% Approval Likelihood</span>
          <span className="text-[11px] text-[#099F69]/70">— High confidence</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onApprove}
          className="flex-1 flex items-center justify-center gap-2 bg-brand text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Send size={14} />
          Approve & Submit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          className="flex items-center justify-center gap-2 bg-white border border-border-default text-text-secondary rounded-xl px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:border-[#1F425F]/30 transition-all"
        >
          <Pencil size={14} />
          Edit
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ReviewSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-text-muted">{icon}</span>
        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">{title}</span>
      </div>
      <div className="pl-5 flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span className="text-text-muted w-[80px] shrink-0">{label}</span>
      <span className="text-text-primary font-medium">{value}</span>
    </div>
  );
}
