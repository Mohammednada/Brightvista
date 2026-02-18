export type { ActionOption, ChatMsg, AgentEntry } from "@/shared/types";
export { getNow } from "@/shared/types";

// Re-export state types for convenience
export type {
  CaseBuilderState,
  CaseBuilderAction,
  PatientData,
  ProcedureData,
  DocumentRequirement,
  ApprovalFactor,
  FieldConfidence,
  PatientFieldConfidence,
  StepId,
  StepStatus,
  StepState,
  CaseStatus,
} from "./state/case-builder-state";

export { useCaseBuilder } from "./state/case-builder-state";
