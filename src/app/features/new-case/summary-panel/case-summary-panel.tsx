import { motion } from "motion/react";
import type { CaseBuilderState, CaseBuilderAction } from "../state/case-builder-state";
import { CaseHeader } from "./case-header";
import { CaseTracker } from "./case-tracker";
import { PatientSection } from "./patient-section";
import { ProcedureSection } from "./procedure-section";
import { DocumentsSection } from "./documents-section";
import { ApprovalSection } from "./approval-section";
import { ActionFooter } from "./action-footer";

interface CaseSummaryPanelProps {
  state: CaseBuilderState;
  dispatch: React.Dispatch<CaseBuilderAction>;
}

export function CaseSummaryPanel({ state, dispatch }: CaseSummaryPanelProps) {
  const hasPatientData = Object.keys(state.patient).length > 0;
  const hasProcedureData = !!state.procedure.cptCode || !!state.procedure.icd10Code;
  const hasDocuments = state.documents.length > 0;
  const hasAnyData = hasPatientData || hasProcedureData || hasDocuments;

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
          {/* Case Details */}
          <div className="px-5 pt-5 pb-4">
            <CaseHeader caseId={state.caseId} status={state.status} />
          </div>

          <div className="mx-5 border-t border-[#f0f2f4]" />

          {/* Patient */}
          {hasPatientData && (
            <PatientSection
              patient={state.patient}
              confidence={state.patientConfidence}
              dispatch={dispatch}
            />
          )}

          {/* Case Tracker */}
          <CaseTracker steps={state.steps} />

          {/* Procedure */}
          {hasProcedureData && (
            <ProcedureSection
              procedure={state.procedure}
              dispatch={dispatch}
            />
          )}

          {/* Documents */}
          {hasDocuments && (
            <DocumentsSection
              documents={state.documents}
              dispatch={dispatch}
            />
          )}

          {/* Approval */}
          {hasAnyData && (
            <ApprovalSection
              likelihood={state.approvalLikelihood}
              factors={state.approvalFactors}
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
          />
        </div>
      </div>
    </motion.div>
  );
}
