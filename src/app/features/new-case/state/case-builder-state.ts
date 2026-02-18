import { useReducer, useCallback } from "react";

// ── Field Confidence ─────────────────────────────────────────────────────────

export interface FieldConfidence {
  source: "ehr" | "ocr" | "manual" | "ai";
  confidence: number; // 0–100
  verified: boolean;
  needsReview: boolean;
}

// ── Patient Data ─────────────────────────────────────────────────────────────

export interface PatientData {
  name: string;
  dob: string;
  mrn: string;
  phone: string;
  address: string;
  insurancePayer: string;
  memberId: string;
  planType: string;
  referringPhysician: string;
}

export type PatientFieldConfidence = {
  [K in keyof PatientData]?: FieldConfidence;
};

// ── Procedure Data ───────────────────────────────────────────────────────────

export interface ProcedureData {
  cptCode: string;
  cptDescription: string;
  icd10Code: string;
  icd10Description: string;
  orderingPhysician: string;
  cptValid: boolean | null; // null = not yet validated
  icd10Valid: boolean | null;
}

// ── Document Requirement ─────────────────────────────────────────────────────

export interface DocumentRequirement {
  id: string;
  name: string;
  status: "found" | "missing" | "recommended" | "na";
  source?: string;
  date?: string;
  required: boolean;
}

// ── Approval Factor ──────────────────────────────────────────────────────────

export interface ApprovalFactor {
  label: string;
  weight: number; // percentage points
  met: boolean;
}

// ── Step ─────────────────────────────────────────────────────────────────────

export type StepId = "patient" | "procedure" | "documentation" | "review" | "submit" | "check-status" | "decision";

export type StepStatus = "pending" | "active" | "complete" | "needs-attention";

export interface StepState {
  id: StepId;
  label: string;
  sublabel?: string;
  status: StepStatus;
}

// ── Case Builder State ───────────────────────────────────────────────────────

export type CaseStatus = "draft" | "in-progress" | "submitted";

export interface CaseBuilderState {
  caseId: string;
  status: CaseStatus;
  currentStep: StepId;
  steps: StepState[];
  patient: Partial<PatientData>;
  patientConfidence: PatientFieldConfidence;
  procedure: Partial<ProcedureData>;
  documents: DocumentRequirement[];
  approvalLikelihood: number;
  approvalFactors: ApprovalFactor[];
}

// ── Actions ──────────────────────────────────────────────────────────────────

export type CaseBuilderAction =
  | { type: "SET_PATIENT_FIELDS"; payload: { data: Partial<PatientData>; confidence?: PatientFieldConfidence } }
  | { type: "SET_PATIENT_FIELD"; payload: { field: keyof PatientData; value: string } }
  | { type: "SET_PROCEDURE"; payload: Partial<ProcedureData> }
  | { type: "SET_DOCUMENTS"; payload: DocumentRequirement[] }
  | { type: "UPDATE_DOCUMENT_STATUS"; payload: { id: string; status: DocumentRequirement["status"] } }
  | { type: "ADVANCE_STEP"; payload: StepId }
  | { type: "GO_TO_STEP"; payload: StepId }
  | { type: "MARK_SUBMITTED" }
  | { type: "SAVE_DRAFT" }
  | { type: "RESET" };

// ── Initial state ────────────────────────────────────────────────────────────

function generateCaseId(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(1000 + Math.random() * 9000));
  return `PA-${year}-${num}`;
}

const defaultSteps: StepState[] = [
  { id: "patient", label: "Patient Info", status: "active" },
  { id: "procedure", label: "Procedure", status: "pending" },
  { id: "documentation", label: "Documentation", status: "pending" },
  { id: "review", label: "Review", status: "pending" },
  { id: "submit", label: "Submit", status: "pending" },
  { id: "check-status", label: "Check Status", sublabel: "3 business days", status: "pending" },
  { id: "decision", label: "Approval / Denial", status: "pending" },
];

function createInitialState(): CaseBuilderState {
  return {
    caseId: generateCaseId(),
    status: "draft",
    currentStep: "patient",
    steps: defaultSteps.map((s) => ({ ...s })),
    patient: {},
    patientConfidence: {},
    procedure: {},
    documents: [],
    approvalLikelihood: 0,
    approvalFactors: [],
  };
}

// ── Reducer ──────────────────────────────────────────────────────────────────

import { calculateApprovalLikelihood } from "./approval-calculator";
import { deriveStepStatuses } from "./step-deriver";

function caseBuilderReducer(state: CaseBuilderState, action: CaseBuilderAction): CaseBuilderState {
  let next: CaseBuilderState;

  switch (action.type) {
    case "SET_PATIENT_FIELDS": {
      next = {
        ...state,
        status: "in-progress",
        patient: { ...state.patient, ...action.payload.data },
        patientConfidence: { ...state.patientConfidence, ...action.payload.confidence },
      };
      break;
    }
    case "SET_PATIENT_FIELD": {
      next = {
        ...state,
        patient: { ...state.patient, [action.payload.field]: action.payload.value },
        patientConfidence: {
          ...state.patientConfidence,
          [action.payload.field]: {
            source: "manual" as const,
            confidence: 100,
            verified: true,
            needsReview: false,
          },
        },
      };
      break;
    }
    case "SET_PROCEDURE": {
      next = {
        ...state,
        procedure: { ...state.procedure, ...action.payload },
      };
      break;
    }
    case "SET_DOCUMENTS": {
      next = {
        ...state,
        documents: action.payload,
      };
      break;
    }
    case "UPDATE_DOCUMENT_STATUS": {
      next = {
        ...state,
        documents: state.documents.map((d) =>
          d.id === action.payload.id ? { ...d, status: action.payload.status } : d
        ),
      };
      break;
    }
    case "ADVANCE_STEP": {
      next = {
        ...state,
        currentStep: action.payload,
      };
      break;
    }
    case "GO_TO_STEP": {
      next = {
        ...state,
        currentStep: action.payload,
      };
      break;
    }
    case "MARK_SUBMITTED": {
      next = {
        ...state,
        status: "submitted",
        currentStep: "submit",
      };
      break;
    }
    case "SAVE_DRAFT": {
      next = {
        ...state,
        status: "draft",
      };
      break;
    }
    case "RESET": {
      next = createInitialState();
      break;
    }
    default:
      return state;
  }

  // Derive step statuses and approval likelihood after every action
  const stepsWithStatus = deriveStepStatuses(next);
  const { score, factors } = calculateApprovalLikelihood(next);

  return {
    ...next,
    steps: stepsWithStatus,
    approvalLikelihood: score,
    approvalFactors: factors,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCaseBuilder() {
  const [state, dispatch] = useReducer(caseBuilderReducer, undefined, createInitialState);

  const dispatchActions = useCallback(
    (actions: CaseBuilderAction[]) => {
      for (const action of actions) {
        dispatch(action);
      }
    },
    [dispatch]
  );

  return { state, dispatch, dispatchActions } as const;
}
