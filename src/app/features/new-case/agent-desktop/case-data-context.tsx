import { createContext, useContext } from "react";
import type { OrderCardData, SubmissionChannel } from "@/shared/types";
import type { CaseBuilderState } from "../state/case-builder-state";

// ── Mock details per order (data not on OrderCardData) ─────────────────────

export interface OrderDetailsMock {
  dob: string;
  age: number;
  mrn: string;
  phone: string;
  address: string;
  payerFull: string;
  memberId: string;
  planType: string;
  trackingId: string;
  expectedResponse: string;
  approvalLikelihood: number;
  faxConfirmation?: string;
  faxNumber?: string;
  voicePhoneNumber?: string;
  documents: string[];
  clinicalJustification: string;
}

export const orderDetailsMock: Record<string, OrderDetailsMock> = {
  "order-1": {
    dob: "03/15/1958",
    age: 67,
    mrn: "NHC-2024-88421",
    phone: "(860) 555-0147",
    address: "1247 Maple Drive, Hartford, CT 06103",
    payerFull: "BlueCross BlueShield",
    memberId: "BCB-447821953",
    planType: "PPO Gold",
    trackingId: "BCBS-2026-0215-4721",
    expectedResponse: "3-5 business days",
    approvalLikelihood: 92,
    documents: [
      "Conservative Therapy Records",
      "Specialist Referral Letter",
      "Physical Exam Notes",
      "Medication History",
    ],
    clinicalJustification:
      "Patient presents with cervical radiculopathy (M54.12) unresponsive to 8 weeks of conservative therapy including NSAIDs and physical therapy. MRI is medically necessary to evaluate for disc herniation or spinal stenosis.",
  },
  "order-2": {
    dob: "07/22/1971",
    age: 54,
    mrn: "NHC-2023-74210",
    phone: "(203) 555-0283",
    address: "892 Oak Street, New Haven, CT 06511",
    payerFull: "Aetna",
    memberId: "AET-882104376",
    planType: "HMO Standard",
    trackingId: "AET-PA-2026-33108",
    expectedResponse: "5-7 business days",
    approvalLikelihood: 87,
    documents: [
      "CT Indication Notes",
      "Lab Results (CBC, CMP)",
      "Referral Letter",
    ],
    clinicalJustification:
      "Patient presents with persistent abdominal pain (R10.9) unresponsive to initial workup. CT Abdomen & Pelvis with contrast is medically necessary to evaluate for potential underlying pathology.",
  },
  "order-3": {
    dob: "09/03/1965",
    age: 60,
    mrn: "NHC-2024-62819",
    phone: "(475) 555-0391",
    address: "345 Birch Lane, Stamford, CT 06901",
    payerFull: "UnitedHealthcare",
    memberId: "UHC-8847291",
    planType: "PPO Choice Plus",
    trackingId: "UHC-PA-2026-84521",
    expectedResponse: "5-7 business days",
    approvalLikelihood: 89,
    faxConfirmation: "FX-84521",
    faxNumber: "1-800-555-0143",
    voicePhoneNumber: "1-800-555-0199",
    documents: [
      "Clinical Notes",
      "Imaging Referral",
      "Medical Necessity Letter",
    ],
    clinicalJustification:
      "Patient presents with lumbar radiculopathy (M54.17) with documented failed conservative therapy. Lumbar epidural steroid injection is medically necessary for pain management.",
  },
  "order-4": {
    dob: "11/08/1989",
    age: 36,
    mrn: "NHC-2025-11340",
    phone: "(860) 555-0512",
    address: "78 Elm Avenue, West Hartford, CT 06107",
    payerFull: "BlueCross BlueShield",
    memberId: "BCB-561928744",
    planType: "PPO Silver",
    trackingId: "BCBS-2026-0215-5893",
    expectedResponse: "3-5 business days",
    approvalLikelihood: 94,
    documents: [
      "Orthopedic Evaluation",
      "MRI Results",
      "Physical Therapy Records",
      "Surgical Plan",
    ],
    clinicalJustification:
      "Patient presents with medial meniscus tear (S83.211A) confirmed on MRI with mechanical symptoms unresponsive to conservative therapy. Knee arthroscopy is medically necessary for definitive treatment.",
  },
};

// ── CaseScreenData interface ───────────────────────────────────────────────

export interface CaseScreenData {
  patient: {
    name: string;
    dob: string;
    age: number;
    mrn: string;
    phone: string;
    address: string;
  };
  insurance: {
    payer: string;
    payerFull: string;
    memberId: string;
    planType: string;
  };
  procedure: {
    name: string;
    cptCode: string;
    cptDescription: string;
    icd10Code: string;
    icd10Description: string;
  };
  physician: string;
  submission: {
    trackingId: string;
    channel: SubmissionChannel;
    channelLabel: string;
    expectedResponse: string;
    faxConfirmation?: string;
    faxNumber?: string;
    voicePhoneNumber?: string;
  };
  documents: {
    count: number;
    list: string[];
  };
  clinicalJustification: string;
  caseId: string;
  orders: OrderCardData[];
  selectedOrder: OrderCardData | null;
  approvalLikelihood: number;
}

// ── Context + hooks ────────────────────────────────────────────────────────

const CaseDataContext = createContext<CaseScreenData | null>(null);

export function CaseDataProvider({
  value,
  children,
}: {
  value: CaseScreenData | null;
  children: React.ReactNode;
}) {
  return (
    <CaseDataContext.Provider value={value}>
      {children}
    </CaseDataContext.Provider>
  );
}

export function useCaseData(): CaseScreenData {
  const ctx = useContext(CaseDataContext);
  if (!ctx) throw new Error("useCaseData must be used within CaseDataProvider");
  return ctx;
}

export function useCaseDataOptional(): CaseScreenData | null {
  return useContext(CaseDataContext);
}

// ── Navigate Context (avoids prop drilling for deep screen components) ────

const NavigateContext = createContext<((view: string) => void) | null>(null);

export function NavigateProvider({
  value,
  children,
}: {
  value: ((view: string) => void) | undefined;
  children: React.ReactNode;
}) {
  return (
    <NavigateContext.Provider value={value ?? null}>
      {children}
    </NavigateContext.Provider>
  );
}

export function useNavigateOptional(): ((view: string) => void) | null {
  return useContext(NavigateContext);
}

// ── Builder ────────────────────────────────────────────────────────────────

function channelLabel(ch: SubmissionChannel): string {
  switch (ch) {
    case "api":
      return "X12 278 API";
    case "voice":
      return "Voice/IVR";
    case "rpa":
      return "RPA Bot (Portal)";
  }
}

export function buildCaseScreenData(
  caseState: CaseBuilderState,
  selectedOrder: OrderCardData | null,
  allOrders: OrderCardData[],
): CaseScreenData {
  const details = selectedOrder
    ? orderDetailsMock[selectedOrder.id]
    : undefined;

  return {
    patient: {
      name: selectedOrder?.patientName ?? caseState.patient.name ?? "",
      dob: details?.dob ?? caseState.patient.dob ?? "",
      age: details?.age ?? 0,
      mrn: details?.mrn ?? caseState.patient.mrn ?? "",
      phone: details?.phone ?? caseState.patient.phone ?? "",
      address: details?.address ?? caseState.patient.address ?? "",
    },
    insurance: {
      payer: selectedOrder?.payer ?? caseState.patient.insurancePayer ?? "",
      payerFull: details?.payerFull ?? caseState.patient.insurancePayer ?? "",
      memberId: details?.memberId ?? caseState.patient.memberId ?? "",
      planType: details?.planType ?? caseState.patient.planType ?? "",
    },
    procedure: {
      name: selectedOrder?.procedure ?? "",
      cptCode: selectedOrder?.cptCode ?? caseState.procedure.cptCode ?? "",
      cptDescription:
        selectedOrder?.procedure ??
        caseState.procedure.cptDescription ??
        "",
      icd10Code:
        selectedOrder?.icd10Code ?? caseState.procedure.icd10Code ?? "",
      icd10Description:
        selectedOrder?.diagnosis ??
        caseState.procedure.icd10Description ??
        "",
    },
    physician:
      selectedOrder?.physician ??
      caseState.patient.referringPhysician ??
      "",
    submission: {
      trackingId: details?.trackingId ?? caseState.submissionDetails?.trackingId ?? "",
      channel: selectedOrder?.channelType ?? "api",
      channelLabel: selectedOrder
        ? channelLabel(selectedOrder.channelType)
        : "",
      expectedResponse: details?.expectedResponse ?? caseState.submissionDetails?.expectedResponse ?? "",
      faxConfirmation: details?.faxConfirmation,
      faxNumber: details?.faxNumber,
      voicePhoneNumber: details?.voicePhoneNumber,
    },
    documents: {
      count: details?.documents.length ?? 0,
      list: details?.documents ?? [],
    },
    clinicalJustification: details?.clinicalJustification ?? "",
    caseId: caseState.caseId,
    orders: allOrders,
    selectedOrder,
    approvalLikelihood: details?.approvalLikelihood ?? caseState.approvalLikelihood,
  };
}
