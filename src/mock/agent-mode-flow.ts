import type { AgentStepsPhase, OrderCardData } from "@/shared/types";
import type { CaseBuilderAction } from "@/app/features/new-case/state/case-builder-state";
import { completedDocumentRequirements } from "./new-case";

// ── Order cards shown after EHR scan ────────────────────────────────────────

export const ehrOrderCards: OrderCardData[] = [
  {
    id: "order-1",
    patientName: "Margaret Thompson",
    procedure: "MRI Cervical Spine w/o Contrast",
    cptCode: "72141",
    priority: "routine",
    physician: "Dr. Sarah Patel",
    department: "Orthopedics",
    date: "Feb 15, 2026",
    diagnosis: "Cervical Radiculopathy",
    icd10Code: "M54.12",
    payer: "BCBS",
    channelType: "api",
  },
  {
    id: "order-2",
    patientName: "James Rodriguez",
    procedure: "CT Abdomen & Pelvis w/ Contrast",
    cptCode: "74178",
    priority: "urgent",
    physician: "Dr. Michael Chen",
    department: "Gastroenterology",
    date: "Feb 15, 2026",
    diagnosis: "Abdominal Pain, Unspecified",
    icd10Code: "R10.9",
    payer: "Aetna",
    channelType: "rpa",
  },
  {
    id: "order-3",
    patientName: "Linda Nakamura",
    procedure: "Lumbar Epidural Steroid Injection",
    cptCode: "62323",
    priority: "routine",
    physician: "Dr. Aisha Williams",
    department: "Pain Management",
    date: "Feb 14, 2026",
    diagnosis: "Lumbar Radiculopathy",
    icd10Code: "M54.17",
    payer: "UHC",
    channelType: "voice",
  },
  {
    id: "order-4",
    patientName: "Robert Chen",
    procedure: "Knee Arthroscopy",
    cptCode: "29881",
    priority: "stat",
    physician: "Dr. David Kim",
    department: "Orthopedic Surgery",
    date: "Feb 15, 2026",
    diagnosis: "Medial Meniscus Tear",
    icd10Code: "S83.211A",
    payer: "BCBS",
    channelType: "api",
  },
];

// ── Phase definitions ───────────────────────────────────────────────────────

// Phase 1 — Scan EHR for orders (~12s)
export const phase1_scanEHR: AgentStepsPhase = {
  phaseId: "scan-ehr",
  title: "Scanning EHR for New Orders",
  subtitle: "Checking for pending authorizations",
  icon: "🔍",
  systemType: "epic-ehr",
  systemUrl: "ehr.epic.northstarhealth.org/orders",
  steps: [
    { id: "s1-1", label: "Connected to Epic Hyperspace", detail: "Session authenticated via SSO", duration: 1100 },
    { id: "s1-2", label: "Querying Pending Orders module", detail: "Accessed orders queue", duration: 1200 },
    { id: "s1-3", label: "Filtering PA-eligible orders", detail: "Applied authorization requirement rules", duration: 1000 },
    { id: "s1-4", label: "Retrieving order details", detail: "Found 4 orders requiring prior authorization", duration: 900 },
  ],
  screens: [
    { label: "Connecting to Epic Hyperspace...", duration: 7500, thinkingText: "Establishing secure SSO connection to Epic Hyperspace — authenticating NorthStar agent credentials..." },
    { label: "Navigating to Orders module", duration: 8000, thinkingText: "Navigating to Pending Orders queue — looking for orders requiring prior authorization..." },
    { label: "Filtering PA-eligible orders", duration: 10000, thinkingText: "Applying authorization requirement rules — filtering orders that need PA based on payer policies..." },
    { label: "4 orders found requiring PA", duration: 6500, thinkingText: "Found 4 orders requiring prior authorization — compiling order details for selection..." },
  ],
  onCompleteActions: [],
  followUpMessage: "I found **4 orders** in the EHR that require prior authorization. Select one to begin the autonomous PA workflow:",
};

// Phase 3 — Fetch patient details (~14s)
export const phase3_patientDetails: AgentStepsPhase = {
  phaseId: "patient-details",
  title: "Fetching Patient Details from EHR",
  subtitle: "Extracting demographics & insurance",
  icon: "👤",
  systemType: "epic-ehr",
  systemUrl: "ehr.epic.northstarhealth.org/patients/88421",
  steps: [
    { id: "s3-1", label: "Opened patient record", detail: "MRN NHC-2024-88421 loaded", duration: 900 },
    { id: "s3-2", label: "Extracted demographics", detail: "Name, DOB, phone, address confirmed", duration: 1000 },
    { id: "s3-3", label: "Pulled insurance details", detail: "BlueCross BlueShield PPO Gold — BCB-447821953", duration: 1100 },
    { id: "s3-4", label: "Checked existing PA history", detail: "2 prior cases found (1 active, 1 completed)", duration: 800 },
    { id: "s3-5", label: "Patient data verified", detail: "All fields confidence > 95%", duration: 700 },
  ],
  screens: [
    { label: "Loading patient record", duration: 6500, thinkingText: "Opening patient record MRN NHC-2024-88421 — loading Margaret Thompson's chart..." },
    { label: "Extracting demographics", duration: 11500, thinkingText: "Extracting demographic fields — name, DOB, phone, address — cross-referencing with registration data..." },
    { label: "Pulling insurance details", duration: 10000, thinkingText: "Pulling insurance details — verifying BlueCross BlueShield PPO Gold coverage and member ID..." },
    { label: "Checking PA history", duration: 6500, thinkingText: "Checking existing prior authorization history — found 2 prior cases (1 active, 1 completed)..." },
    { label: "8 fields extracted", duration: 5500, thinkingText: "All patient data extracted — 8 fields verified with >95% confidence across demographics and insurance..." },
  ],
  onCompleteActions: [
    {
      type: "SET_PATIENT_FIELDS",
      payload: {
        data: {
          name: "Margaret Thompson",
          dob: "03/15/1958",
          mrn: "NHC-2024-88421",
          phone: "(860) 555-0147",
          address: "1247 Maple Drive, Hartford, CT 06103",
          insurancePayer: "BlueCross BlueShield",
          memberId: "BCB-447821953",
          planType: "PPO Gold",
          referringPhysician: "Dr. Sarah Patel",
        },
        confidence: {
          name: { source: "ehr", confidence: 98, verified: true, needsReview: false },
          dob: { source: "ehr", confidence: 98, verified: true, needsReview: false },
          mrn: { source: "ehr", confidence: 99, verified: true, needsReview: false },
          phone: { source: "ehr", confidence: 95, verified: true, needsReview: false },
          address: { source: "ehr", confidence: 90, verified: false, needsReview: false },
          insurancePayer: { source: "ehr", confidence: 97, verified: true, needsReview: false },
          memberId: { source: "ehr", confidence: 97, verified: true, needsReview: false },
          planType: { source: "ehr", confidence: 95, verified: true, needsReview: false },
          referringPhysician: { source: "ehr", confidence: 96, verified: true, needsReview: false },
        },
      },
    } satisfies CaseBuilderAction,
    { type: "ADVANCE_STEP", payload: "procedure" } satisfies CaseBuilderAction,
  ],
};

// Phase 4 — Check payer rules (~10s)
export const phase4_payerRules: AgentStepsPhase = {
  phaseId: "payer-rules",
  title: "Checking Payer Authorization Rules",
  subtitle: "BlueCross BlueShield — PPO Gold",
  icon: "📋",
  systemType: "pa-engine",
  systemUrl: "pa-engine.northstarhealth.org/rules",
  steps: [
    { id: "s4-1", label: "Connected to PA Rules Engine", detail: "BCBS policy database loaded", duration: 900 },
    { id: "s4-2", label: "Matched CPT 72141 to policy", detail: "Imaging — MRI requires prior auth", duration: 1100 },
    { id: "s4-3", label: "Identified clinical criteria", detail: "InterQual / MCG guidelines applied", duration: 1000 },
    { id: "s4-4", label: "Rules check complete", detail: "5 documentation requirements identified", duration: 800 },
    { id: "s4-5", label: "Saved rules to knowledge base", detail: "Cached for future BCBS MRI PAs", duration: 600 },
  ],
  screens: [
    { label: "Loading PA Rules Engine", duration: 7500, thinkingText: "Connecting to NorthStar PA Rules Engine — loading BCBS policy database for coverage analysis..." },
    { label: "Searching BCBS + CPT 72141", duration: 9000, thinkingText: "Searching BCBS PPO Gold authorization requirements for CPT 72141 (MRI Cervical Spine)..." },
    { label: "Reviewing clinical criteria", duration: 9000, thinkingText: "Applying InterQual / MCG clinical guidelines — evaluating documentation requirements for medical necessity..." },
    { label: "5 requirements identified", duration: 5000, thinkingText: "Rules analysis complete — 5 documentation requirements identified for BCBS MRI prior authorization..." },
    { label: "Saving rules for reuse", duration: 8000, thinkingText: "Analyzing rule pattern — formatting and saving to knowledge base for future BCBS + MRI prior authorizations..." },
  ],
  onCompleteActions: [],
};

// Phase 6 — Determine submission channel (~6s)
export const phase6_submissionChannel: AgentStepsPhase = {
  phaseId: "submission-channel",
  title: "Determining Best Submission Channel",
  subtitle: "Evaluating API, voice, and portal options",
  icon: "📡",
  systemType: "bcbs-availity",
  systemUrl: "portal.availity.com/bcbs/channels",
  steps: [
    { id: "s6-1", label: "Checked BCBS API availability", detail: "X12 278 API endpoint available", duration: 800 },
    { id: "s6-2", label: "Evaluated channel reliability", detail: "API: 99.2% success rate this week", duration: 900 },
    { id: "s6-3", label: "Selected optimal channel", detail: "API submission — fastest turnaround (24-48hrs)", duration: 700 },
  ],
  screens: [
    { label: "Connecting to BCBS Availity", duration: 3400, thinkingText: "Switching to BCBS Availity network — establishing secure connection to payer submission gateway..." },
    { label: "Comparing submission channels", duration: 8000, thinkingText: "Evaluating BCBS submission channels — comparing API, voice, and portal options for reliability and speed..." },
    { label: "API selected — fastest turnaround", duration: 7500, thinkingText: "X12 278 API selected — 99.2% success rate, 24-48 hour turnaround, optimal channel for this submission..." },
  ],
  onCompleteActions: [],
};

// Phase 7 — Build document checklist (~6s)
export const phase7_documentChecklist: AgentStepsPhase = {
  phaseId: "document-checklist",
  title: "Building Document Checklist",
  subtitle: "Cross-referencing payer requirements",
  icon: "📄",
  systemType: "pa-engine",
  systemUrl: "pa-engine.northstarhealth.org/checklist",
  steps: [
    { id: "s7-1", label: "Compiled required documents", detail: "5 documents per BCBS MRI policy", duration: 900 },
    { id: "s7-2", label: "Checked optional recommendations", detail: "1 additional document recommended", duration: 800 },
    { id: "s7-3", label: "Checklist finalized", detail: "Ready to search EHR for documents", duration: 700 },
  ],
  screens: [
    { label: "Building checklist from requirements", duration: 8000, thinkingText: "Cross-referencing BCBS MRI policy requirements with available document types in EHR..." },
    { label: "5 required + 1 recommended", duration: 8000, thinkingText: "Document checklist finalized — 5 required documents per policy, 1 additional recommended for stronger case..." },
  ],
  onCompleteActions: [
    { type: "ADVANCE_STEP", payload: "documentation" } satisfies CaseBuilderAction,
  ],
};

// Phase 8 — Fetch documents from EHR (~12s)
export const phase8_fetchDocuments: AgentStepsPhase = {
  phaseId: "fetch-documents",
  title: "Fetching Documents from EHR",
  subtitle: "Searching clinical records for required docs",
  icon: "📂",
  systemType: "epic-ehr",
  systemUrl: "ehr.epic.northstarhealth.org/documents",
  steps: [
    { id: "s8-1", label: "Found conservative therapy records", detail: "8 weeks PT documented in EMR", duration: 1100 },
    { id: "s8-2", label: "Found specialist referral letter", detail: "Dr. Patel's referral dated Feb 10", duration: 1000 },
    { id: "s8-3", label: "Found physical exam notes", detail: "Exam dated Feb 12, 2026", duration: 900 },
    { id: "s8-4", label: "Found medication history", detail: "NSAIDs + muscle relaxants documented", duration: 800 },
    { id: "s8-5", label: "All required documents located", detail: "4/4 required + 0/1 optional found", duration: 700 },
  ],
  screens: [
    { label: "Opening Clinical Documents", duration: 6500, thinkingText: "Navigating to Clinical Documents section in patient chart — preparing to search for required records..." },
    { label: "Searching for required documents", duration: 19000, thinkingText: "Searching EMR for conservative therapy records, referral letters, exam notes, and medication history..." },
    { label: "4/4 required documents found", duration: 5500, thinkingText: "All 4 required documents located in EHR — ready to attach to PA submission package..." },
  ],
  onCompleteActions: [
    { type: "SET_DOCUMENTS", payload: completedDocumentRequirements } satisfies CaseBuilderAction,
  ],
};

// Phase 9 — Fill the PA form (~16s)
export const phase9_fillForm: AgentStepsPhase = {
  phaseId: "fill-form",
  title: "Filling PA Submission Form",
  subtitle: "Auto-populating all fields",
  icon: "✏️",
  systemType: "northstar-pa",
  systemUrl: "app.northstarhealth.org/pa/new",
  steps: [
    { id: "s9-1", label: "Populated patient demographics", detail: "12 fields auto-filled from EHR", duration: 800 },
    { id: "s9-2", label: "Added procedure & diagnosis codes", detail: "CPT 72141, ICD-10 M54.12 validated", duration: 900 },
    { id: "s9-3", label: "Attached clinical documentation", detail: "4 documents linked to submission", duration: 1000 },
    { id: "s9-4", label: "Added clinical justification", detail: "Medical necessity narrative generated", duration: 1100 },
    { id: "s9-5", label: "Form validation passed", detail: "22/22 required fields complete — 92% approval likelihood", duration: 800 },
  ],
  screens: [
    { label: "Loading PA submission form", duration: 7500, thinkingText: "Opening PA submission form — preparing to auto-populate all fields from extracted EHR data..." },
    { label: "Auto-filling patient demographics", duration: 10500, thinkingText: "Entering patient demographics — Margaret Thompson, DOB 03/15/1958, Member ID BCB-447821953..." },
    { label: "Entering procedure codes", duration: 9000, thinkingText: "Entering CPT 72141 (MRI Cervical Spine) and ICD-10 M54.12 (Cervical Radiculopathy)..." },
    { label: "Attaching documents + justification", duration: 11500, thinkingText: "Attaching 4 clinical documents and composing medical necessity narrative for justification..." },
    { label: "Validating — 92% approval likelihood", duration: 10000, thinkingText: "Running form validation — 22/22 required fields complete — calculating 92% approval likelihood..." },
  ],
  onCompleteActions: [
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
    { type: "ADVANCE_STEP", payload: "review" } satisfies CaseBuilderAction,
  ],
  followUpMessage: "The PA form is complete and ready for your review. Please review the details below and approve when ready:",
};

// ── API Submission phase (single BCBS order) ────────────────────────────────

export const phase_submitApi: AgentStepsPhase = {
  phaseId: "submit-api",
  title: "Submitting PA via X12 278 API",
  subtitle: "BCBS — X12 278 API",
  icon: "🚀",
  systemType: "api-terminal",
  systemUrl: "api.northstarhealth.org/x12/278",
  steps: [
    { id: "sa-1", label: "Compiled submission package", detail: "Form + clinical documents bundled", duration: 900 },
    { id: "sa-2", label: "Transmitted via X12 278 API", detail: "Encrypted payload sent to BCBS", duration: 1200 },
    { id: "sa-3", label: "Received acknowledgment", detail: "Tracking ID: BCBS-2026-0215-4721", duration: 800 },
    { id: "sa-4", label: "Submission confirmed", detail: "Status: Under Review", duration: 700 },
  ],
  screens: [
    { label: "Initializing X12 278 API", duration: 7500, thinkingText: "Initializing secure connection to BCBS X12 278 API endpoint — TLS 1.3 handshake in progress..." },
    { label: "Composing request payload", duration: 11500, thinkingText: "Compiling submission package — form data, 4 clinical documents, and medical necessity narrative..." },
    { label: "Response: 200 OK", duration: 6500, thinkingText: "Transmitting encrypted payload to BCBS — awaiting acknowledgment from payer gateway..." },
    { label: "Submission confirmed", duration: 5000, thinkingText: "PA request confirmed — Tracking ID BCBS-2026-0215-4721 received — case now under review..." },
  ],
  onCompleteActions: [
    { type: "MARK_SUBMITTED" } satisfies CaseBuilderAction,
  ],
};

// ── Voice Submission phase (UHC — Linda Nakamura) ───────────────────────────

export const phase_submitVoice: AgentStepsPhase = {
  phaseId: "submit-voice",
  title: "Submitting via Voice/IVR",
  subtitle: "UnitedHealthcare — Linda Nakamura",
  icon: "📞",
  systemType: "uhc-voice",
  systemUrl: "ivr.uhc.com/prior-auth",
  steps: [
    { id: "sv-1", label: "Dialing UHC PA hotline", detail: "1-800-555-0199", duration: 1000 },
    { id: "sv-2", label: "Navigating IVR menu", detail: "Selected Prior Authorization → New Request", duration: 1200 },
    { id: "sv-3", label: "Dictating PA details", detail: "Patient, procedure, and diagnosis transmitted", duration: 1500 },
    { id: "sv-4", label: "Reference number received", detail: "UHC-PA-2026-84521 — call complete", duration: 800 },
  ],
  screens: [
    { label: "Connecting to UHC Voice IVR", duration: 5500, thinkingText: "Switching to UHC Voice IVR system — preparing automated phone call to UnitedHealthcare PA hotline..." },
    { label: "Dialing 1-800-555-0199", duration: 8000, thinkingText: "Dialing UHC PA hotline at 1-800-555-0199 — waiting for IVR system to answer..." },
    { label: "Navigating IVR prompts", duration: 10000, thinkingText: "Navigating IVR menu tree — selecting Prior Authorization → New Request → Provider submission..." },
    { label: "Call complete — reference received", duration: 6000, thinkingText: "PA details transmitted via voice — reference number UHC-PA-2026-84521 confirmed — call duration 3:42..." },
  ],
  onCompleteActions: [],
};

// ── RPA Submission phase (Aetna — James Rodriguez) ──────────────────────────

export const phase_submitRpa: AgentStepsPhase = {
  phaseId: "submit-rpa",
  title: "Submitting via RPA Bot",
  subtitle: "Aetna Portal — James Rodriguez",
  icon: "🤖",
  systemType: "aetna-portal",
  systemUrl: "provider.aetna.com/prior-auth",
  steps: [
    { id: "sr-1", label: "Logging into Aetna portal", detail: "Secure credential injection", duration: 1000 },
    { id: "sr-2", label: "Navigating to PA submission", detail: "Prior Auth → New Request form", duration: 900 },
    { id: "sr-3", label: "Auto-filling form fields", detail: "18 fields populated from case data", duration: 1200 },
    { id: "sr-4", label: "Uploading clinical documents", detail: "3 documents attached to submission", duration: 1100 },
    { id: "sr-5", label: "Submission confirmed", detail: "AET-PA-2026-33108 — processing", duration: 800 },
  ],
  screens: [
    { label: "Launching Aetna portal bot", duration: 5500, thinkingText: "Switching to Aetna portal RPA bot — initializing headless browser for automated form submission..." },
    { label: "Authenticating to Aetna", duration: 8000, thinkingText: "Injecting provider credentials securely — completing MFA challenge — authenticating to Aetna provider portal..." },
    { label: "Auto-filling PA form", duration: 10000, thinkingText: "Auto-filling PA submission form — patient demographics, procedure codes, diagnosis, and clinical justification..." },
    { label: "Uploading documents", duration: 9000, thinkingText: "Uploading clinical documentation — CT indication notes, labs, and referral letter — verifying file integrity..." },
    { label: "Submission confirmed", duration: 5500, thinkingText: "Aetna PA request submitted — reference number AET-PA-2026-33108 — expected response in 5-7 business days..." },
  ],
  onCompleteActions: [],
};

// Phase 12 — Send patient notification (~7s)
export const phase12_patientNotify: AgentStepsPhase = {
  phaseId: "patient-notify",
  title: "Sending Patient Notification",
  subtitle: "Informing patient of PA submission",
  icon: "📱",
  systemType: "northstar-pa",
  systemUrl: "app.northstarhealth.org/pa/notify",
  steps: [
    { id: "s12-1", label: "Generated patient notification", detail: "Personalized message prepared", duration: 800 },
    { id: "s12-2", label: "Sent SMS to patient", detail: "PA submission confirmation delivered", duration: 900 },
    { id: "s12-3", label: "Updated patient portal", detail: "Case visible in MyChart", duration: 700 },
  ],
  screens: [
    { label: "Composing SMS notification", duration: 8000, thinkingText: "Composing personalized SMS notification — including tracking ID and next steps..." },
    { label: "SMS sent + MyChart updated", duration: 7500, thinkingText: "SMS delivered — now updating MyChart patient portal with case details..." },
    { label: "Both notifications confirmed", duration: 5500, thinkingText: "Both notification channels confirmed — patient informed via SMS and MyChart portal..." },
  ],
  onCompleteActions: [],
};

// Phase 13 — Check submission status (~7s)
export const phase13_checkStatus: AgentStepsPhase = {
  phaseId: "check-status",
  title: "Checking Submission Status",
  subtitle: "Verifying payer received the request",
  icon: "✅",
  systemType: "northstar-pa",
  systemUrl: "app.northstarhealth.org/pa/status",
  steps: [
    { id: "s13-1", label: "Queried payer status API", detail: "Real-time status check initiated", duration: 900 },
    { id: "s13-2", label: "Status: Under Review", detail: "Expected decision in 3-5 business days", duration: 800 },
    { id: "s13-3", label: "Auto-monitoring configured", detail: "Will alert on status changes", duration: 700 },
  ],
  screens: [
    { label: "Querying payer status API", duration: 8000, thinkingText: "Querying payer real-time status API — checking submission status..." },
    { label: "Auto-monitoring configured", duration: 6500, thinkingText: "Configuring auto-monitoring — status polling every 4 hours, alerts on decision, RFI auto-detection..." },
    { label: "All systems green", duration: 5500, thinkingText: "All systems operational — PA workflow complete, monitoring active, will alert on any status changes..." },
  ],
  onCompleteActions: [
    { type: "ADVANCE_STEP", payload: "check-status" } satisfies CaseBuilderAction,
  ],
  followUpMessage:
    "**PA Case Complete!** Here's the summary:\n\n" +
    "* **Case ID:** PA-2026-0215\n" +
    "* **Patient:** Margaret Thompson (MRN: NHC-2024-88421)\n" +
    "* **Procedure:** MRI Cervical Spine (CPT 72141)\n" +
    "* **Diagnosis:** Cervical Radiculopathy (M54.12)\n" +
    "* **Status:** Under Review\n" +
    "* **Expected Decision:** 3-5 business days\n" +
    "* **Approval Likelihood:** 92%\n\n" +
    "I've set up auto-monitoring and will notify you of any status changes or RFIs. The case is now in your active queue.",
};

// ── Phase queue builders ────────────────────────────────────────────────────

/** Phases that run after the user selects an order (fully autonomous) */
export const autonomousPhases: AgentStepsPhase[] = [
  phase3_patientDetails,
  phase4_payerRules,
  phase7_documentChecklist,
  phase8_fetchDocuments,
  phase9_fillForm,
];

/** Per-channel submission phases — selected based on order's payer/channelType */
export const submissionPhasesApi: AgentStepsPhase[] = [
  phase_submitApi,
  phase12_patientNotify,
  phase13_checkStatus,
];

export const submissionPhasesVoice: AgentStepsPhase[] = [
  phase_submitVoice,
  phase12_patientNotify,
  phase13_checkStatus,
];

export const submissionPhasesRpa: AgentStepsPhase[] = [
  phase_submitRpa,
  phase12_patientNotify,
  phase13_checkStatus,
];
