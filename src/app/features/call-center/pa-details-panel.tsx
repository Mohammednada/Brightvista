import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown, FileText, CheckCircle, Phone, Check,
  User, Stethoscope, Shield, Send, Hash, Clock, Zap,
} from "lucide-react";
import type { CallQueueItem } from "@/mock/call-center";

// ── Panel ────────────────────────────────────────────────────────────────────

interface PaDetailsPanelProps {
  call: CallQueueItem | null;
}

export function PaDetailsPanel({ call }: PaDetailsPanelProps) {
  if (!call) {
    return (
      <div className="w-[360px] shrink-0 border-l border-border-default bg-white flex items-center justify-center">
        <p className="text-[12px] text-text-muted">Select a call to view PA details</p>
      </div>
    );
  }

  return (
    <div className="w-[360px] shrink-0 border-l border-border-default bg-white flex flex-col h-full overflow-hidden">
      {/* Case header — single block matching center panel's header + tabs height */}
      <CaseDetailHeader call={call} />

      <div className="flex-1 overflow-y-auto scrollbar-none">

        {/* Call Tracker */}
        <CallTracker call={call} />
        <div className="mx-5 mb-2 border-t border-[#f0f2f4]" />

        {/* Patient */}
        <CollapsibleSection icon={User} title="Patient" defaultOpen>
          <FieldRow label="Patient" value={call.patient.name} />
          <FieldRow label="DOB" value={`${call.patient.dob} (Age ${call.patient.age})`} />
          <FieldRow label="MRN" value={call.patient.mrn} />
          <FieldRow label="Phone" value={call.patient.phone} />
        </CollapsibleSection>

        {/* Procedure */}
        <CollapsibleSection icon={Stethoscope} title="Procedure" defaultOpen>
          <FieldRow label="Procedure" value={call.procedure.name} />
          <FieldRow label="CPT Code" value={`${call.procedure.cptCode} — ${call.procedure.cptDescription}`} />
          <FieldRow label="ICD-10" value={`${call.procedure.icd10Code} — ${call.procedure.icd10Description}`} />
          <FieldRow label="Physician" value={call.physician} />
        </CollapsibleSection>

        {/* Insurance */}
        <CollapsibleSection icon={Shield} title="Insurance" defaultOpen>
          <FieldRow label="Payer" value={call.payerFull} />
          <FieldRow label="Member ID" value={call.insurance.memberId} />
          <FieldRow label="Plan Type" value={call.insurance.planType} />
          <FieldRow label="Phone" value={call.payerPhone} />
        </CollapsibleSection>

        {/* Documents */}
        <CollapsibleSection icon={FileText} title="Documents" count={`${call.documents.length}/${call.documents.length}`}>
          <div className="flex flex-col">
            {call.documents.map((doc, i) => (
              <motion.div
                key={doc}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="flex items-center gap-2 py-1.5 rounded-md hover:bg-[#fafbfc] transition-colors px-1 -mx-1"
              >
                <CheckCircle size={13} className="text-[#099F69] shrink-0" />
                <span className="text-[12px] text-text-primary font-medium">{doc}</span>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Submission */}
        <CollapsibleSection icon={Send} title="Submission" badge={call.trackingId ? "Submitted" : "Pending"} badgeColor={call.trackingId ? "green" : "blue"}>
          <div className="flex flex-col gap-2">
            {/* Channel */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <Phone size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted font-medium">Channel</span>
              </div>
              <span className="text-[12px] text-text-primary font-medium">Voice / IVR</span>
            </div>

            {/* Tracking ID */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <Hash size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted font-medium">Tracking ID</span>
              </div>
              {call.trackingId ? (
                <span className="text-[12px] text-text-primary font-semibold font-mono">{call.trackingId}</span>
              ) : (
                <span className="text-[12px] text-text-muted italic">Pending...</span>
              )}
            </div>

            {/* Expected response */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock size={11} className="text-text-muted" />
                <span className="text-[11px] text-text-muted font-medium">Expected</span>
              </div>
              <span className="text-[12px] text-text-primary font-medium">5-7 business days</span>
            </div>

            {/* Approval likelihood */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Zap size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted font-medium">Approval Likelihood</span>
                </div>
                <span
                  className="text-[14px] font-bold leading-none"
                  style={{
                    color: call.approvalLikelihood >= 90 ? "#099F69"
                      : call.approvalLikelihood >= 75 ? "#a16207"
                      : "#D02241",
                  }}
                >
                  {call.approvalLikelihood}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#f0f2f4] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: call.approvalLikelihood >= 90 ? "#099F69"
                      : call.approvalLikelihood >= 75 ? "#F3903F"
                      : "#D02241",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${call.approvalLikelihood}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

// ── Case Detail Header ───────────────────────────────────────────────────────
// Matches case-header.tsx: icon badge + title + status pill.

function CaseDetailHeader({ call }: { call: CallQueueItem }) {
  const statusCfg = call.status === "completed"
    ? { label: "Completed", bg: "bg-[#dcfce7]", text: "text-[#099F69]" }
    : call.status === "active"
    ? { label: "In Progress", bg: "bg-[#dbeafe]", text: "text-[#2563eb]" }
    : { label: "Queued", bg: "bg-[#fef3cd]", text: "text-[#a16207]" };

  return (
    <>
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <FileText size={16} className="text-brand" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-primary leading-tight">{call.caseId}</p>
              <p className="text-[11px] text-text-muted leading-tight">
                {call.callType === "submission" ? "Voice Submission" : "Voice Status Check"} — {call.payer}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>
      <div className="mx-5 border-t border-[#f0f2f4]" />
    </>
  );
}

// ── Collapsible Section ──────────────────────────────────────────────────────
// Matches the exact pattern from patient-section.tsx / documents-section.tsx:
// - Container: px-5 py-2
// - Header button: w-full flex items-center justify-between mb-2 cursor-pointer group
// - Icon: size={13} className="text-text-muted"
// - Title: text-[10px] font-semibold text-text-muted uppercase tracking-wider
// - Chevron: size={14} rotate -90 when collapsed
// - Divider: mt-2 border-t border-[#f0f2f4]

function CollapsibleSection({
  icon: Icon,
  title,
  defaultOpen = false,
  count,
  badge,
  badgeColor,
  children,
}: {
  icon: typeof User;
  title: string;
  defaultOpen?: boolean;
  count?: string;
  badge?: string;
  badgeColor?: "green" | "blue";
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);

  const badgeStyles = badgeColor === "green"
    ? "bg-[#dcfce7] text-[#099F69]"
    : "bg-[#dbeafe] text-[#2563eb]";

  return (
    <div className="px-5 py-2">
      {/* Section header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Icon size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{title}</span>
          {count && (
            <span className="text-[10px] font-semibold text-text-muted">{count}</span>
          )}
          {badge && (
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${badgeStyles}`}>
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-2 border-t border-[#f0f2f4]" />
    </div>
  );
}

// ── Field Row ────────────────────────────────────────────────────────────────
// Matches patient-section.tsx FieldRow: label left, value right.

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-[11px] text-text-muted font-medium shrink-0">{label}</span>
      <span className="text-[12px] text-text-primary font-medium text-right truncate">{value}</span>
    </div>
  );
}

// ── Call Tracker ─────────────────────────────────────────────────────────────
// Matches case-tracker.tsx pattern: vertical step list with dots + lines.

type TrackerStatus = "complete" | "active" | "pending";

interface TrackerStep {
  label: string;
  sublabel?: string;
  status: TrackerStatus;
}

function getCallSteps(call: CallQueueItem): TrackerStep[] {
  const isSubmission = call.callType === "submission";

  if (call.status === "completed") {
    return [
      { label: "Dial Payer", sublabel: call.payerPhone, status: "complete" },
      { label: "Navigate IVR", status: "complete" },
      { label: isSubmission ? "Submit PA" : "Check Status", status: "complete" },
      { label: "Get Confirmation", sublabel: call.trackingId ?? undefined, status: "complete" },
      { label: "Notify Patient", status: "complete" },
    ];
  }

  if (call.status === "active") {
    // Simulate mid-call: first 2 done, 3rd active
    return [
      { label: "Dial Payer", sublabel: call.payerPhone, status: "complete" },
      { label: "Navigate IVR", status: "complete" },
      { label: isSubmission ? "Submit PA" : "Check Status", sublabel: "In progress...", status: "active" },
      { label: "Get Confirmation", status: "pending" },
      { label: "Notify Patient", status: "pending" },
    ];
  }

  // Queued
  return [
    { label: "Dial Payer", sublabel: call.payerPhone, status: "pending" },
    { label: "Navigate IVR", status: "pending" },
    { label: isSubmission ? "Submit PA" : "Check Status", status: "pending" },
    { label: "Get Confirmation", status: "pending" },
    { label: "Notify Patient", status: "pending" },
  ];
}

function CallTracker({ call }: { call: CallQueueItem }) {
  const steps = getCallSteps(call);

  return (
    <div className="px-5 pt-3 pb-4">
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-2.5">
        Call Tracker
      </span>

      <div className="flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const done = step.status === "complete";
          const active = step.status === "active";

          return (
            <div key={i} className="flex gap-3">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <TrackerDot status={step.status} />
                {!isLast && (
                  <div className={`w-px flex-1 min-h-[16px] ${done ? "bg-[#099F69]" : "bg-[#e5e5e5]"}`} />
                )}
              </div>

              {/* Label */}
              <div className={`${isLast ? "pb-0" : "pb-3"} min-h-[16px] flex flex-col justify-center`}>
                <span className={`text-[12px] leading-[16px] ${
                  done ? "text-text-secondary line-through decoration-text-muted/40"
                    : active ? "text-brand font-semibold"
                    : "text-text-muted"
                }`}>
                  {step.label}
                </span>
                {step.sublabel && (
                  <span className={`block text-[10px] mt-0.5 ${active ? "text-brand/60" : "text-text-muted/70"}`}>
                    {step.sublabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackerDot({ status }: { status: TrackerStatus }) {
  if (status === "complete") {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-4 h-4 rounded-full bg-[#099F69] flex items-center justify-center shrink-0"
      >
        <Check size={9} className="text-white" strokeWidth={3} />
      </motion.div>
    );
  }

  if (status === "active") {
    return (
      <div className="w-4 h-4 shrink-0 relative flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
      </div>
    );
  }

  return (
    <div className="w-4 h-4 rounded-full border-[1.5px] border-[#ddd] shrink-0" />
  );
}
