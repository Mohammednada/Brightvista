// ── Document Zones ───────────────────────────────────────────────────────────

export const uploadOcrSteps = [
  "Analyzing document layout...",
  "Detecting text regions...",
  "Running OCR extraction...",
  "Parsing patient demographics...",
  "Validating extracted fields...",
];

export const captureOcrSteps = [
  "Enhancing image quality...",
  "Detecting document edges...",
  "Running OCR text extraction...",
  "Parsing patient information...",
  "Validating extracted data...",
];

// ── EHR Agent Panel ──────────────────────────────────────────────────────────

export const ehrSteps = [
  { label: "Opening Epic EHR System", url: "ehr.epic.northstarhealth.org", duration: 2200 },
  { label: "Authenticating with service credentials", url: "ehr.epic.northstarhealth.org/auth/login", duration: 3000 },
  { label: "Signed in successfully", url: "ehr.epic.northstarhealth.org/dashboard", duration: 2400 },
  { label: "Navigating to Patient Search", url: "ehr.epic.northstarhealth.org/patients/search", duration: 2400 },
  { label: "Searching for patient record", url: "ehr.epic.northstarhealth.org/patients/search?q=Margaret+Thompson", duration: 3200 },
  { label: "Extracting patient details", url: "ehr.epic.northstarhealth.org/patients/88421", duration: 3000 },
  { label: "Data extraction complete", url: "ehr.epic.northstarhealth.org/patients/88421", duration: 1500 },
];

export const ehrLoadingSteps = [
  "Resolving DNS...",
  "TLS handshake...",
  "Verifying certificate...",
  "Connection established",
];

export const patientRecordFields = [
  { label: "Full Name", value: "Margaret Thompson", section: "demographics" },
  { label: "Date of Birth", value: "03/15/1958 (Age 67)", section: "demographics" },
  { label: "MRN", value: "NHC-2024-88421", section: "demographics" },
  { label: "Phone", value: "(860) 555-0147", section: "demographics" },
  { label: "Insurance Payer", value: "BlueCross BlueShield", section: "insurance" },
  { label: "Member ID", value: "BCB-447821953", section: "insurance" },
  { label: "Plan Type", value: "PPO Gold", section: "insurance" },
  { label: "Referring Physician", value: "Dr. Sarah Patel", section: "provider" },
];

export const ehrDashboardMetrics = [
  { label: "Active Patients", value: "1,247" },
  { label: "Today's Appointments", value: "64" },
  { label: "Pending Orders", value: "38" },
  { label: "Alerts", value: "5" },
];

export const ehrRecentActivity = [
  { text: "PA-2024-1847 status updated", time: "2m ago", color: "#2563eb" },
  { text: "Lab results received \u2014 J. Parker", time: "15m ago", color: "#059669" },
  { text: "New referral \u2014 Dr. Williams", time: "1h ago", color: "#d97706" },
];

// ── EHR Redirect Overlay ─────────────────────────────────────────────────────

export const redirectPhases = [
  { title: "Redirecting to Epic EHR...", subtitle: "Establishing secure connection" },
  { title: "Authenticating session...", subtitle: "Verifying service credentials" },
  { title: "Redirecting back to NorthStar...", subtitle: "Session authorized successfully" },
  { title: "Connected", subtitle: "Starting EHR data extraction" },
];

export const redirectTimings = [1200, 2600, 4000];

// ── Document Requirements (Compliance Checklist) ─────────────────────────────

import type { DocumentRequirement } from "@/app/features/new-case/state/case-builder-state";

export const defaultDocumentRequirements: DocumentRequirement[] = [
  { id: "conservative-therapy", name: "Conservative Therapy Records", status: "missing", required: true },
  { id: "specialist-referral", name: "Specialist Referral Letter", status: "missing", required: true },
  { id: "physical-exam", name: "Physical Exam Notes", status: "missing", required: true },
  { id: "medication-history", name: "Medication History", status: "missing", required: true },
  { id: "previous-imaging", name: "Previous Imaging Results", status: "missing", required: false },
];

export const completedDocumentRequirements: DocumentRequirement[] = [
  { id: "conservative-therapy", name: "Conservative Therapy Records", status: "found", source: "EMR", date: "8 weeks PT documented", required: true },
  { id: "specialist-referral", name: "Specialist Referral Letter", status: "found", source: "Dr. Patel", date: "Feb 10, 2026", required: true },
  { id: "physical-exam", name: "Physical Exam Notes", status: "found", source: "EMR", date: "Feb 12, 2026", required: true },
  { id: "medication-history", name: "Medication History", status: "found", source: "EMR", date: "NSAIDs + muscle relaxants", required: true },
  { id: "previous-imaging", name: "Previous Imaging Results", status: "recommended", required: false },
];

// ── Contextual Suggestions by Step ───────────────────────────────────────────

export const stepSuggestions: Record<string, string[]> = {
  patient: [
    "Look up patient in EHR",
    "Upload referral document",
    "Enter patient info manually",
  ],
  procedure: [
    "MRI Cervical Spine (72141)",
    "CT Scan with contrast",
    "Look up CPT code",
  ],
  documentation: [
    "Check what documents are missing",
    "Upload clinical notes",
    "Request records from EMR",
  ],
  review: [
    "Review all case details",
    "Check approval likelihood",
    "Edit patient information",
  ],
  submit: [
    "Submit to payer",
    "Save as draft",
    "Add additional notes",
  ],
};

// ── Quick Start Cards ────────────────────────────────────────────────────────

export const quickStartCards = [
  {
    id: "continue-draft",
    title: "Continue: Margaret Thompson MRI",
    subtitle: "Last saved 2 hours ago",
    type: "draft" as const,
  },
  {
    id: "urgent-upload",
    title: "Urgent: Upload PT notes for PA-2024-1847",
    subtitle: "Due today",
    type: "urgent" as const,
  },
  {
    id: "quick-start-mri",
    title: "Quick Start: Common MRI Pre-Auth",
    subtitle: "Pre-filled template",
    type: "template" as const,
  },
];
