import type { CaseBuilderState, StepState, StepId } from "./case-builder-state";

/**
 * Pure function: CaseBuilderState → StepState[]
 */
export function deriveStepStatuses(state: CaseBuilderState): StepState[] {
  const stepOrder: StepId[] = ["patient", "procedure", "documentation", "review", "submit", "check-status", "decision"];
  const labels: Record<StepId, string> = {
    patient: "Patient Info",
    procedure: "Procedure",
    documentation: "Documentation",
    review: "Review",
    submit: "Submit",
    "check-status": "Check Status",
    decision: "Approval / Denial",
  };
  const sublabels: Partial<Record<StepId, string>> = {
    "check-status": "3 business days",
  };

  // Determine completion for each section
  const patientFields: (keyof typeof state.patient)[] = [
    "name", "dob", "mrn", "insurancePayer", "memberId",
  ];
  const patientFilled = patientFields.filter((f) => !!state.patient[f]).length;
  const patientComplete = patientFilled === patientFields.length;
  const patientStarted = patientFilled > 0;

  const procedureComplete =
    !!state.procedure.cptCode &&
    !!state.procedure.icd10Code &&
    state.procedure.cptValid === true &&
    state.procedure.icd10Valid === true;
  const procedureStarted = !!state.procedure.cptCode || !!state.procedure.icd10Code;

  const requiredDocs = state.documents.filter((d) => d.required);
  const foundDocs = requiredDocs.filter((d) => d.status === "found");
  const docsComplete = requiredDocs.length > 0 && foundDocs.length === requiredDocs.length;
  const docsStarted = state.documents.length > 0;

  const reviewReady = patientComplete && procedureComplete && docsComplete;
  const isSubmitted = state.status === "submitted";

  const patientNeedsReview = Object.values(state.patientConfidence).some((c) => c?.needsReview);
  const hasMissingRequiredDocs = requiredDocs.some((d) => d.status === "missing");

  return stepOrder.map((id): StepState => {
    const label = labels[id];
    const sublabel = sublabels[id];
    const base = { id, label, sublabel };

    // Post-submit lifecycle steps
    if (id === "check-status") {
      return { ...base, status: isSubmitted ? "active" : "pending" };
    }
    if (id === "decision") {
      return { ...base, status: "pending" };
    }

    if (isSubmitted && id !== "check-status" && id !== "decision") {
      return { ...base, status: "complete" };
    }

    switch (id) {
      case "patient": {
        if (patientComplete && !patientNeedsReview) return { ...base, status: "complete" };
        if (patientComplete && patientNeedsReview) return { ...base, status: "needs-attention" };
        if (state.currentStep === "patient" || (!patientComplete && patientStarted))
          return { ...base, status: "active" };
        return { ...base, status: state.currentStep === id ? "active" : "pending" };
      }
      case "procedure": {
        if (procedureComplete) return { ...base, status: "complete" };
        if (state.currentStep === "procedure" || procedureStarted)
          return { ...base, status: "active" };
        return { ...base, status: "pending" };
      }
      case "documentation": {
        if (docsComplete) return { ...base, status: "complete" };
        if (hasMissingRequiredDocs) return { ...base, status: "needs-attention" };
        if (state.currentStep === "documentation" || docsStarted)
          return { ...base, status: "active" };
        return { ...base, status: "pending" };
      }
      case "review": {
        if (state.currentStep === "review" && reviewReady)
          return { ...base, status: "active" };
        return { ...base, status: "pending" };
      }
      case "submit": {
        if (state.currentStep === "submit") return { ...base, status: "active" };
        return { ...base, status: "pending" };
      }
      default:
        return { ...base, status: "pending" };
    }
  });
}
