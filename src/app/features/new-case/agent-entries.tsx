import {
  FileText,
  Search,
  ClipboardList,
  Upload,
  Camera,
  Monitor,
} from "lucide-react";
import type { ActionOption, AgentEntry } from "./types";
import { getNow } from "./types";
import type { CaseBuilderAction } from "./state/case-builder-state";
import { defaultDocumentRequirements, completedDocumentRequirements } from "@/mock/new-case";

// ── Data source action options ────────────────────────────────────────────────

export const dataSourceOptions: ActionOption[] = [
  {
    label: "Upload Document",
    icon: <Upload size={14} />,
    prompt: "__UPLOAD_DOCUMENT__",
    color: "#3385f0",
    bgColor: "#f0f7ff",
    borderColor: "#d6e6f5",
  },
  {
    label: "Capture Document",
    icon: <Camera size={14} />,
    prompt: "__CAPTURE_DOCUMENT__",
    color: "#096",
    bgColor: "#f0fff4",
    borderColor: "#d6f5e0",
  },
  {
    label: "Get from EHR System",
    icon: <Monitor size={14} />,
    prompt: "__EHR_SYSTEM__",
    color: "#8b5cf6",
    bgColor: "#faf5ff",
    borderColor: "#e9d5f5",
  },
];

// ── Extracted patient data (shared across flows) ──────────────────────────────

export const EXTRACTED_PATIENT_DATA =
  "I've successfully extracted the patient information. Here's what I found:\n\n" +
  "Patient: Margaret Thompson\n" +
  "* DOB: 03/15/1958 (Age 67)\n" +
  "* MRN: NHC-2024-88421\n" +
  "* Primary Insurance: BlueCross BlueShield -- Member ID: BCB-447821953\n" +
  "* Plan Type: PPO Gold\n" +
  "* Referring Physician: Dr. Sarah Patel (Orthopedics)\n" +
  "* Address: 1247 Maple Drive, Hartford, CT 06103\n" +
  "* Phone: (860) 555-0147\n\n" +
  "Existing PA History:\n" +
  "* PA-2024-1847 -- MRI Lumbar Spine (currently awaiting docs)\n" +
  "* PA-2023-0912 -- Physical Therapy 6 sessions (approved, completed)\n\n" +
  "All patient details have been pre-populated into the new case form. What procedure or service does this new PA request cover?";

// ── New Case Agent Entries ────────────────────────────────────────────────────

const newCaseEntries: AgentEntry[] = [
  {
    match: (q) =>
      q.includes("new pa") || q.includes("new prior auth") || q.includes("start a new case") ||
      q.includes("create a new") || q.includes("submit a new") || q.includes("new authorization"),
    thinking: [
      "Initializing new PA case workflow...",
      "Loading payer requirement templates...",
      "Checking available procedure codes...",
      "Preparing submission checklist...",
    ],
    response:
      "I'll help you create a new prior authorization case. Let's start by gathering the patient information.\n\n" +
      "How would you like to provide the patient details? You can choose from the options below:",
    nextAction: {
      label: "Enter details manually instead",
      prompt: "Let's go step by step. The patient is Margaret Thompson, DOB 03/15/1958.",
    },
    actionOptions: dataSourceOptions,
  },
  // ── EHR System flow ──
  {
    match: (q) => q === "__ehr_system__" || q.includes("pull patient details from ehr") || q.includes("get from ehr"),
    thinking: [
      "Checking EHR integration status...",
      "Preparing authorization request...",
    ],
    response: "",
    specialContent: "ehr-consent",
    nextAction: {
      label: "MRI Cervical Spine -- CPT 72141",
      prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
    },
  },
  // ── Upload Document flow ──
  {
    match: (q) => q === "__upload_document__" || q.includes("upload document for ocr") || q.includes("upload a document"),
    thinking: [
      "Preparing document upload...",
      "Loading OCR engine...",
    ],
    response: "",
    specialContent: "upload-zone",
    nextAction: {
      label: "MRI Cervical Spine -- CPT 72141",
      prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
    },
  },
  // ── Capture Document flow ──
  {
    match: (q) => q === "__capture_document__" || q.includes("capture document") || q.includes("scan document"),
    thinking: [
      "Preparing camera capture...",
      "Loading OCR engine...",
    ],
    response: "",
    specialContent: "capture-zone",
    nextAction: {
      label: "MRI Cervical Spine -- CPT 72141",
      prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
    },
  },
  {
    match: (q) =>
      q.includes("margaret thompson") || q.includes("patient is") ||
      (q.includes("step by step") && q.includes("patient")),
    thinking: [
      "Looking up patient in the system...",
      "Verifying patient demographics...",
      "Pulling insurance information from EMR...",
      "Checking existing PA history...",
    ],
    response:
      "I found the patient in our system:\n\n" +
      "Patient: Margaret Thompson\n" +
      "* DOB: 03/15/1958 (Age 67)\n" +
      "* MRN: NHC-2024-88421\n" +
      "* Primary Insurance: BlueCross BlueShield -- Member ID: BCB-447821953\n" +
      "* Plan Type: PPO Gold\n" +
      "* Referring Physician: Dr. Sarah Patel (Orthopedics)\n\n" +
      "Existing PA History:\n" +
      "* PA-2024-1847 -- MRI Lumbar Spine (currently awaiting docs)\n" +
      "* PA-2023-0912 -- Physical Therapy 6 sessions (approved, completed)\n\n" +
      "What procedure or service does this new PA request cover?",
    nextAction: {
      label: "MRI Cervical Spine -- CPT 72141",
      prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
    },
    stateUpdates: [
      {
        type: "SET_PATIENT_FIELDS",
        payload: {
          data: {
            name: "Margaret Thompson",
            dob: "03/15/1958",
            mrn: "NHC-2024-88421",
            insurancePayer: "BlueCross BlueShield",
            memberId: "BCB-447821953",
            planType: "PPO Gold",
            referringPhysician: "Dr. Sarah Patel",
          },
          confidence: {
            name: { source: "ehr", confidence: 98, verified: true, needsReview: false },
            dob: { source: "ehr", confidence: 98, verified: true, needsReview: false },
            mrn: { source: "ehr", confidence: 99, verified: true, needsReview: false },
            insurancePayer: { source: "ehr", confidence: 97, verified: true, needsReview: false },
            memberId: { source: "ehr", confidence: 97, verified: true, needsReview: false },
            planType: { source: "ehr", confidence: 95, verified: true, needsReview: false },
            referringPhysician: { source: "ehr", confidence: 96, verified: true, needsReview: false },
          },
        },
      } satisfies CaseBuilderAction,
      { type: "ADVANCE_STEP", payload: "procedure" } satisfies CaseBuilderAction,
    ],
  },
  {
    match: (q) =>
      q.includes("mri") || q.includes("cpt") || q.includes("procedure is") ||
      q.includes("72141") || q.includes("72148") || q.includes("cervical"),
    thinking: [
      "Validating CPT code against payer formulary...",
      "Checking BCBS prior auth requirements for MRI...",
      "Reviewing clinical documentation requirements...",
      "Running pre-submit compliance check...",
    ],
    response:
      "I've validated the procedure against BCBS requirements. Here's the pre-submission checklist:\n\n" +
      "Procedure: MRI Cervical Spine (CPT 72141)\n" +
      "Diagnosis: Cervical Radiculopathy (M54.12)\n" +
      "Payer: BlueCross BlueShield PPO Gold\n\n" +
      "BCBS Requirements for Cervical MRI PA:\n" +
      "* Conservative therapy documentation (minimum 6 weeks) -- Required\n" +
      "* Specialist referral letter -- Required\n" +
      "* Recent physical exam notes -- Required\n" +
      "* Previous imaging results (if any) -- Recommended\n" +
      "* Medication history for pain management -- Required\n\n" +
      "Pre-Submit Check Results:\n" +
      "* Conservative therapy docs -- Found in EMR (8 weeks PT documented)\n" +
      "* Specialist referral -- Found (Dr. Patel's referral letter dated Feb 10)\n" +
      "* Physical exam -- Found (exam dated Feb 12)\n" +
      "* Medication history -- Found (NSAIDs + muscle relaxants documented)\n\n" +
      "All required documentation is available. This case has a high likelihood of approval. Shall I compile and submit?",
    nextAction: {
      label: "Compile and submit the PA request",
      prompt: "Yes, compile all the documentation and submit the PA request to BCBS.",
    },
    stateUpdates: [
      {
        type: "SET_PROCEDURE",
        payload: {
          cptCode: "72141",
          cptDescription: "MRI Cervical Spine w/o Contrast",
          icd10Code: "M54.12",
          icd10Description: "Cervical Radiculopathy",
          orderingPhysician: "Dr. Sarah Patel",
          cptValid: true,
          icd10Valid: true,
        },
      } satisfies CaseBuilderAction,
      { type: "SET_DOCUMENTS", payload: completedDocumentRequirements } satisfies CaseBuilderAction,
      { type: "ADVANCE_STEP", payload: "review" } satisfies CaseBuilderAction,
    ],
  },
  {
    match: (q) =>
      q.includes("compile") || q.includes("submit") || q.includes("send it") ||
      q.includes("go ahead"),
    thinking: [
      "Compiling clinical documentation package...",
      "Attaching conservative therapy records...",
      "Attaching specialist referral letter...",
      "Submitting to BCBS via payer portal...",
    ],
    response:
      "PA request has been submitted successfully!\n\n" +
      "Case Details:\n" +
      "* Case ID: PA-2026-0215 (new)\n" +
      "* Patient: Margaret Thompson (MRN: NHC-2024-88421)\n" +
      "* Procedure: MRI Cervical Spine (CPT 72141)\n" +
      "* Diagnosis: Cervical Radiculopathy (M54.12)\n" +
      "* Payer: BlueCross BlueShield -- Submitted via payer portal\n" +
      "* Priority: Routine\n" +
      "* Submission Time: " + getNow() + " -- Feb 15, 2026\n\n" +
      "Documents Attached:\n" +
      "* Conservative therapy records (8 weeks PT)\n" +
      "* Dr. Patel's referral letter (Feb 10)\n" +
      "* Physical exam notes (Feb 12)\n" +
      "* Medication history\n\n" +
      "Expected payer response: 3-5 business days. I'll monitor the case status and notify you of any updates or RFIs. The case is now in your active queue.",
    nextAction: {
      label: "Create another PA case",
      prompt: "I need to create another new prior authorization case.",
    },
    stateUpdates: [
      { type: "MARK_SUBMITTED" } satisfies CaseBuilderAction,
    ],
  },
  {
    match: (q) =>
      q.includes("check eligibility") || q.includes("verify insurance") ||
      q.includes("eligibility"),
    thinking: [
      "Connecting to payer eligibility system...",
      "Verifying member coverage status...",
      "Checking benefit details...",
    ],
    response:
      "I can run an eligibility verification for you. Please provide:\n\n" +
      "* Patient name or MRN\n" +
      "* Insurance payer name\n" +
      "* Member ID (if available)\n\n" +
      "I'll check real-time eligibility status, coverage details, copay/coinsurance information, and any prior authorization requirements for the requested service.",
    nextAction: {
      label: "Check eligibility for Margaret Thompson",
      prompt: "Check eligibility for Margaret Thompson, BCBS member ID BCB-447821953.",
    },
  },
  {
    match: (q) =>
      q.includes("what documents") || q.includes("what do i need") ||
      q.includes("requirements") || q.includes("checklist"),
    thinking: [
      "Loading payer-specific documentation requirements...",
      "Cross-referencing with procedure type...",
      "Building documentation checklist...",
    ],
    response:
      "Documentation requirements vary by payer and procedure. Here are the most common requirements:\n\n" +
      "For Imaging (MRI, CT, PET):\n" +
      "* Conservative therapy documentation (4-6 weeks minimum)\n" +
      "* Specialist referral letter\n" +
      "* Physical exam notes (within 30 days)\n" +
      "* Previous imaging results\n\n" +
      "For Surgical Procedures:\n" +
      "* Operative report or surgical plan\n" +
      "* Failed conservative therapy documentation\n" +
      "* Pre-surgical clearance\n" +
      "* Anesthesia evaluation\n\n" +
      "For DME/Devices:\n" +
      "* Medical necessity letter\n" +
      "* Device specification sheet\n" +
      "* Coverage verification for specific device\n\n" +
      "Tell me the specific procedure and payer, and I'll give you the exact checklist.",
    nextAction: {
      label: "Show BCBS requirements for MRI",
      prompt: "What are the exact documentation requirements for an MRI with BCBS?",
    },
  },
  // Greeting
  {
    match: (q) =>
      q.includes("hello") || q.includes("hi ") || q === "hi" || q === "hey" ||
      q.includes("good morning") || q.includes("help"),
    thinking: [
      "Loading new case workflow options...",
      "Checking your current queue status...",
    ],
    response:
      "Hello! I'm ready to help you create a new prior authorization case. Here's what I can do:\n\n" +
      "* Start a new PA submission -- I'll guide you through the process step by step\n" +
      "* Check patient eligibility -- Verify insurance coverage before submitting\n" +
      "* Review documentation requirements -- See what's needed for specific procedures and payers\n" +
      "* Look up procedure codes -- Find the right CPT and ICD-10 codes\n\n" +
      "What would you like to do?",
    nextAction: {
      label: "Start a new PA submission",
      prompt: "I need to create a new prior authorization case.",
    },
  },
];

const newCaseFallback: Omit<AgentEntry, "match"> = {
  thinking: [
    "Processing your request...",
    "Checking against PA workflow database...",
    "Preparing response...",
  ],
  response:
    "I can help with that. For new case creation, I can assist with:\n\n" +
    "* Starting a new PA submission with guided workflow\n" +
    "* Checking patient eligibility and coverage\n" +
    "* Looking up documentation requirements by payer and procedure\n" +
    "* Validating CPT/ICD-10 codes before submission\n" +
    "* Running pre-submit compliance checks\n\n" +
    "Would you like to start a new case, or is there something specific you need help with?",
  nextAction: {
    label: "Start a new PA case",
    prompt: "I need to create a new prior authorization case.",
  },
};

export function findNewCaseEntry(input: string): Omit<AgentEntry, "match"> {
  const q = input.toLowerCase();
  for (const entry of newCaseEntries) {
    if (entry.match(q)) return entry;
  }
  return newCaseFallback;
}

// ── Suggested prompts for the empty state ─────────────────────────────────────

export const suggestedPrompts = [
  { icon: <FileText size={16} className="text-[#3385f0]" />, label: "Start New Patient Enrollment Case", prompt: "I need to create a new prior authorization case." },
  { icon: <Search size={16} className="text-[#096]" />, label: "Check patient eligibility", prompt: "I need to check eligibility for a patient before submitting a PA." },
  { icon: <ClipboardList size={16} className="text-[#f2883f]" />, label: "Review documentation requirements", prompt: "What documents do I need for a prior authorization submission?" },
  { icon: <Upload size={16} className="text-[#8b5cf6]" />, label: "Upload & attach clinical docs", prompt: "I need to upload and attach clinical documentation to a case." },
];
