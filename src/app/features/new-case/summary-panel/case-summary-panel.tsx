import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CaseBuilderState, CaseBuilderAction } from "../state/case-builder-state";
import type { SubmissionChannel } from "@/shared/types";
import { CaseHeader } from "./case-header";
import { CaseTracker } from "./case-tracker";
import { PatientSection } from "./patient-section";
import { ProcedureSection } from "./procedure-section";
import { DocumentsSection } from "./documents-section";
import { ApprovalSection } from "./approval-section";
import { SubmissionSection } from "./submission-section";
import { ActionFooter } from "./action-footer";

// ── Phase-to-section activity mapping ────────────────────────────────────────

type SectionId = "patient" | "procedure" | "documents" | "approval" | "submission";

const phaseToSection: Record<string, SectionId> = {
  "patient-details": "patient",
  "payer-rules": "procedure",
  "document-checklist": "documents",
  "fetch-documents": "documents",
  "fill-form": "procedure",
  "submit-api": "submission",
  "submit-voice": "submission",
  "submit-voice-fax": "submission",
  "submit-rpa": "submission",
  "patient-notify": "submission",
  "check-status": "submission",
};

const phaseLabels: Record<string, string> = {
  "patient-details": "Extracting patient data...",
  "payer-rules": "Checking payer rules...",
  "document-checklist": "Building document checklist...",
  "fetch-documents": "Fetching documents from EHR...",
  "fill-form": "Filling PA form...",
  "submit-api": "Submitting via API...",
  "submit-voice": "Submitting via voice...",
  "submit-voice-fax": "Faxing PA form...",
  "submit-rpa": "Submitting via portal...",
  "patient-notify": "Notifying patient...",
  "check-status": "Checking submission status...",
};

// ── Collapsible state logic ──────────────────────────────────────────────────

function getSectionStatus(
  sectionId: SectionId,
  activeSection: SectionId | null,
  hasData: boolean,
): "active" | "completed" | "pending" {
  if (activeSection === sectionId) return "active";
  if (hasData) return "completed";
  return "pending";
}

// ── Component ────────────────────────────────────────────────────────────────

interface CaseSummaryPanelProps {
  state: CaseBuilderState;
  dispatch: React.Dispatch<CaseBuilderAction>;
  activePhaseId: string | null;
  agentModeActive: boolean;
  selectedChannel: SubmissionChannel | null;
}

export function CaseSummaryPanel({ state, dispatch, activePhaseId, agentModeActive, selectedChannel }: CaseSummaryPanelProps) {
  const hasPatientData = Object.keys(state.patient).length > 0;
  const hasProcedureData = !!state.procedure.cptCode || !!state.procedure.icd10Code;
  const hasDocuments = state.documents.length > 0;
  const showApproval = state.currentStep === "review" || state.currentStep === "submit" || state.currentStep === "check-status" || state.currentStep === "decision" || state.status === "submitted";
  const showSubmission = !!state.submissionDetails;

  // Active section derived from current phase
  const activeSection = activePhaseId ? (phaseToSection[activePhaseId] ?? null) : null;
  const activePhaseLabel = activePhaseId ? (phaseLabels[activePhaseId] ?? null) : null;

  // Collapsible section state — tracks which sections are manually toggled
  const [collapsed, setCollapsed] = useState<Record<SectionId, boolean>>({
    patient: false,
    procedure: false,
    documents: false,
    approval: false,
    submission: false,
  });

  // Auto-collapse completed sections when agent moves to next, auto-expand active
  useEffect(() => {
    if (!agentModeActive || !activeSection) return;

    setCollapsed((prev) => {
      const next = { ...prev };
      // Auto-expand active section
      next[activeSection] = false;
      // Auto-collapse sections that have data and aren't the active one
      for (const key of Object.keys(next) as SectionId[]) {
        if (key !== activeSection) {
          if (
            (key === "patient" && hasPatientData) ||
            (key === "procedure" && hasProcedureData) ||
            (key === "documents" && hasDocuments) ||
            (key === "approval" && showApproval) ||
            (key === "submission" && showSubmission)
          ) {
            next[key] = true;
          }
        }
      }
      return next;
    });
  }, [activeSection, agentModeActive, hasPatientData, hasProcedureData, hasDocuments]);

  const toggleSection = (id: SectionId) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const patientStatus = getSectionStatus("patient", activeSection, hasPatientData);
  const procedureStatus = getSectionStatus("procedure", activeSection, hasProcedureData);
  const documentsStatus = getSectionStatus("documents", activeSection, hasDocuments);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 400, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="shrink-0 h-full overflow-hidden border-l border-border-default bg-white"
    >
      <div className="w-[400px] h-full flex flex-col">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Case Header */}
          <div className="px-5 pt-4 pb-3">
            <CaseHeader caseId={state.caseId} status={state.status} />
          </div>

          <div className="mx-5 border-t border-[#f0f2f4]" />

          {/* Case Tracker */}
          <CaseTracker steps={state.steps} />

          {/* Patient — always visible */}
          <PatientSection
            patient={state.patient}
            confidence={state.patientConfidence}
            dispatch={dispatch}
            sectionStatus={patientStatus}
            isCollapsed={collapsed.patient}
            onToggle={() => toggleSection("patient")}
            activityLabel={activeSection === "patient" ? activePhaseLabel : null}
          />

          {/* Procedure — always visible */}
          <ProcedureSection
            procedure={state.procedure}
            dispatch={dispatch}
            sectionStatus={procedureStatus}
            isCollapsed={collapsed.procedure}
            onToggle={() => toggleSection("procedure")}
            activityLabel={activeSection === "procedure" ? activePhaseLabel : null}
          />

          {/* Documents — always visible */}
          <DocumentsSection
            documents={state.documents}
            dispatch={dispatch}
            sectionStatus={documentsStatus}
            isCollapsed={collapsed.documents}
            onToggle={() => toggleSection("documents")}
            activityLabel={activeSection === "documents" ? activePhaseLabel : null}
          />

          {/* Approval — only after form is complete */}
          {showApproval && (
            <ApprovalSection
              likelihood={state.approvalLikelihood}
              factors={state.approvalFactors}
              isCollapsed={collapsed.approval}
              onToggle={() => toggleSection("approval")}
            />
          )}

          {/* Submission — only after submit */}
          {showSubmission && state.submissionDetails && (
            <SubmissionSection
              details={state.submissionDetails}
              isCollapsed={collapsed.submission}
              onToggle={() => toggleSection("submission")}
              activityLabel={activeSection === "submission" ? activePhaseLabel : null}
            />
          )}
        </div>

        {/* Fixed Footer */}
        <div className="px-5 pb-5 pt-2">
          <ActionFooter
            status={state.status}
            currentStep={state.currentStep}
            onSubmit={() => dispatch({ type: "MARK_SUBMITTED" })}
            onSaveDraft={() => dispatch({ type: "SAVE_DRAFT" })}
            agentModeActive={agentModeActive}
            activePhaseLabel={activePhaseLabel}
          />
        </div>
      </div>
    </motion.div>
  );
}
