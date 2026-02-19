import type { AgentStepsPhase, OrderCardData, SubmissionChannel } from "@/shared/types";
import type { CaseBuilderAction, SubmissionDetails } from "@/app/features/new-case/state/case-builder-state";
import { completedDocumentRequirements } from "./new-case";
import type { OrderDetailsMock } from "@/app/features/new-case/agent-desktop/case-data-context";
import { orderDetailsMock } from "@/app/features/new-case/agent-desktop/case-data-context";

// ── Order Context — data a phase factory needs ─────────────────────────────

export interface OrderContext {
  order: OrderCardData;
  details: OrderDetailsMock;
  caseId: string;
}

export function buildOrderContext(order: OrderCardData, caseId: string): OrderContext {
  const details = orderDetailsMock[order.id];
  if (!details) throw new Error(`No mock details for order ${order.id}`);
  return { order, details, caseId };
}

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

// ── Phase definitions (factory functions) ──────────────────────────────────

// Phase 1 — Scan EHR for orders (runs BEFORE order selection — no ctx needed)
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

// Phase 3 — Fetch patient details
export function createPhase_patientDetails(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "patient-details",
    title: "Fetching Patient Details from EHR",
    subtitle: "Extracting demographics & insurance",
    icon: "👤",
    systemType: "epic-ehr",
    systemUrl: `ehr.epic.northstarhealth.org/patients/${details.mrn.split("-").pop()}`,
    steps: [
      { id: "s3-1", label: "Opened patient record", detail: `MRN ${details.mrn} loaded`, duration: 900 },
      { id: "s3-2", label: "Extracted demographics", detail: "Name, DOB, phone, address confirmed", duration: 1000 },
      { id: "s3-3", label: "Pulled insurance details", detail: `${details.payerFull} ${details.planType} — ${details.memberId}`, duration: 1100 },
      { id: "s3-4", label: "Checked existing PA history", detail: "2 prior cases found (1 active, 1 completed)", duration: 800 },
      { id: "s3-5", label: "Patient data verified", detail: "All fields confidence > 95%", duration: 700 },
    ],
    screens: [
      { label: "Loading patient record", duration: 6500, thinkingText: `Opening patient record MRN ${details.mrn} — loading ${order.patientName}'s chart...` },
      { label: "Extracting demographics", duration: 11500, thinkingText: `Extracting demographic fields — name, DOB, phone, address — cross-referencing with registration data...` },
      { label: "Pulling insurance details", duration: 10000, thinkingText: `Pulling insurance details — verifying ${details.payerFull} ${details.planType} coverage and member ID...` },
      { label: "Checking PA history", duration: 6500, thinkingText: "Checking existing prior authorization history — found 2 prior cases (1 active, 1 completed)..." },
      { label: "8 fields extracted", duration: 5500, thinkingText: "All patient data extracted — 8 fields verified with >95% confidence across demographics and insurance..." },
    ],
    onCompleteActions: [
      {
        type: "SET_PATIENT_FIELDS",
        payload: {
          data: {
            name: order.patientName,
            dob: details.dob,
            mrn: details.mrn,
            phone: details.phone,
            address: details.address,
            insurancePayer: details.payerFull,
            memberId: details.memberId,
            planType: details.planType,
            referringPhysician: order.physician,
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
}

// Phase 4 — Check payer rules
export function createPhase_payerRules(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "payer-rules",
    title: "Checking Payer Authorization Rules",
    subtitle: `${details.payerFull} — ${details.planType}`,
    icon: "📋",
    systemType: "pa-engine",
    systemUrl: "pa-engine.northstarhealth.org/rules",
    steps: [
      { id: "s4-1", label: "Connected to BrightVista Crystal", detail: `${order.payer} policy database loaded`, duration: 900 },
      { id: "s4-2", label: `Matched CPT ${order.cptCode} to policy`, detail: `${order.procedure} requires prior auth`, duration: 1100 },
      { id: "s4-3", label: "Identified clinical criteria", detail: "InterQual / MCG guidelines applied", duration: 1000 },
      { id: "s4-4", label: "Rules check complete", detail: `${details.documents.length + 1} documentation requirements identified`, duration: 800 },
      { id: "s4-5", label: "Saved rules to knowledge base", detail: `Cached for future ${order.payer} PAs`, duration: 600 },
    ],
    screens: [
      { label: "Loading BrightVista Crystal", duration: 7500, thinkingText: `Connecting to BrightVista Crystal — loading ${order.payer} policy database for coverage analysis...` },
      { label: `Searching ${order.payer} + CPT ${order.cptCode}`, duration: 9000, thinkingText: `Searching ${order.payer} ${details.planType} authorization requirements for CPT ${order.cptCode} (${order.procedure})...` },
      { label: "Reviewing clinical criteria", duration: 9000, thinkingText: "Applying InterQual / MCG clinical guidelines — evaluating documentation requirements for medical necessity..." },
      { label: `${details.documents.length + 1} requirements identified`, duration: 5000, thinkingText: `Rules analysis complete — ${details.documents.length + 1} documentation requirements identified for ${order.payer} prior authorization...` },
      { label: "Saving rules for reuse", duration: 8000, thinkingText: `Analyzing rule pattern — formatting and saving to knowledge base for future ${order.payer} prior authorizations...` },
    ],
    onCompleteActions: [],
  };
}

// Phase 7 — Build document checklist
export function createPhase_documentChecklist(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "document-checklist",
    title: "Building Document Checklist",
    subtitle: "Cross-referencing payer requirements",
    icon: "📄",
    systemType: "pa-engine",
    systemUrl: "pa-engine.northstarhealth.org/checklist",
    steps: [
      { id: "s7-1", label: "Compiled required documents", detail: `${details.documents.length} documents per ${order.payer} policy`, duration: 900 },
      { id: "s7-2", label: "Checked optional recommendations", detail: "1 additional document recommended", duration: 800 },
      { id: "s7-3", label: "Checklist finalized", detail: "Ready to search EHR for documents", duration: 700 },
    ],
    screens: [
      { label: "Building checklist from requirements", duration: 8000, thinkingText: `Cross-referencing ${order.payer} policy requirements with available document types in EHR...` },
      { label: `${details.documents.length} required + 1 recommended`, duration: 8000, thinkingText: `Document checklist finalized — ${details.documents.length} required documents per policy, 1 additional recommended for stronger case...` },
    ],
    onCompleteActions: [
      { type: "ADVANCE_STEP", payload: "documentation" } satisfies CaseBuilderAction,
    ],
  };
}

// Phase 8 — Fetch documents from EHR
export function createPhase_fetchDocuments(ctx: OrderContext): AgentStepsPhase {
  const { details } = ctx;
  const docSteps = details.documents.map((doc, i) => ({
    id: `s8-${i + 1}`,
    label: `Found ${doc.toLowerCase()}`,
    detail: `Located in EMR`,
    duration: 1100 - i * 50,
  }));
  docSteps.push({
    id: `s8-${details.documents.length + 1}`,
    label: "All required documents located",
    detail: `${details.documents.length}/${details.documents.length} required found`,
    duration: 700,
  });

  return {
    phaseId: "fetch-documents",
    title: "Fetching Documents from EHR",
    subtitle: "Searching clinical records for required docs",
    icon: "📂",
    systemType: "epic-ehr",
    systemUrl: "ehr.epic.northstarhealth.org/documents",
    steps: docSteps,
    screens: [
      { label: "Opening Clinical Documents", duration: 6500, thinkingText: "Navigating to Clinical Documents section in patient chart — preparing to search for required records..." },
      { label: "Searching for required documents", duration: 19000, thinkingText: `Searching EMR for ${details.documents.join(", ").toLowerCase()}...` },
      { label: `${details.documents.length}/${details.documents.length} required documents found`, duration: 5500, thinkingText: `All ${details.documents.length} required documents located in EHR — ready to attach to PA submission package...` },
    ],
    onCompleteActions: [
      { type: "SET_DOCUMENTS", payload: completedDocumentRequirements } satisfies CaseBuilderAction,
    ],
  };
}

// Phase 9 — Fill PA form
export function createPhase_fillForm(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "fill-form",
    title: "Filling PA Submission Form",
    subtitle: "Auto-populating all fields",
    icon: "✏️",
    systemType: "northstar-pa",
    systemUrl: "app.northstarhealth.org/pa/new",
    steps: [
      { id: "s9-1", label: "Populated patient demographics", detail: "12 fields auto-filled from EHR", duration: 800 },
      { id: "s9-2", label: "Added procedure & diagnosis codes", detail: `CPT ${order.cptCode}, ICD-10 ${order.icd10Code} validated`, duration: 900 },
      { id: "s9-3", label: "Attached clinical documentation", detail: `${details.documents.length} documents linked to submission`, duration: 1000 },
      { id: "s9-4", label: "Added clinical justification", detail: "Medical necessity narrative generated", duration: 1100 },
      { id: "s9-5", label: "Form validation passed", detail: `22/22 required fields complete — ${details.approvalLikelihood}% approval likelihood`, duration: 800 },
    ],
    screens: [
      { label: "Loading PA submission form", duration: 7500, thinkingText: "Opening PA submission form — preparing to auto-populate all fields from extracted EHR data..." },
      { label: "Auto-filling patient demographics", duration: 10500, thinkingText: `Entering patient demographics — ${order.patientName}, DOB ${details.dob}, Member ID ${details.memberId}...` },
      { label: "Entering procedure codes", duration: 9000, thinkingText: `Entering CPT ${order.cptCode} (${order.procedure}) and ICD-10 ${order.icd10Code} (${order.diagnosis})...` },
      { label: "Attaching documents + justification", duration: 11500, thinkingText: `Attaching ${details.documents.length} clinical documents and composing medical necessity narrative for justification...` },
      { label: `Validating — ${details.approvalLikelihood}% approval likelihood`, duration: 10000, thinkingText: `Running form validation — 22/22 required fields complete — calculating ${details.approvalLikelihood}% approval likelihood...` },
    ],
    onCompleteActions: [
      {
        type: "SET_PROCEDURE",
        payload: {
          cptCode: order.cptCode,
          cptDescription: order.procedure,
          icd10Code: order.icd10Code,
          icd10Description: order.diagnosis,
          orderingPhysician: order.physician,
          cptValid: true,
          icd10Valid: true,
        },
      } satisfies CaseBuilderAction,
      { type: "ADVANCE_STEP", payload: "review" } satisfies CaseBuilderAction,
    ],
    followUpMessage: "The PA form is complete and ready for your review. Please review the details below and approve when ready:",
  };
}

// ── Submission phases ──────────────────────────────────────────────────────

// API Submission (BCBS)
export function createPhase_submitApi(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "submit-api",
    title: "Submitting PA via X12 278 API",
    subtitle: `${order.payer} — X12 278 API`,
    icon: "🚀",
    systemType: "api-terminal",
    systemUrl: "api.northstarhealth.org/x12/278",
    steps: [
      { id: "sa-1", label: "Compiled submission package", detail: "Form + clinical documents bundled", duration: 900 },
      { id: "sa-2", label: "Transmitted via X12 278 API", detail: `Encrypted payload sent to ${order.payer}`, duration: 1200 },
      { id: "sa-3", label: "Received acknowledgment", detail: `Tracking ID: ${details.trackingId}`, duration: 800 },
      { id: "sa-4", label: "Submission confirmed", detail: "Status: Under Review", duration: 700 },
    ],
    screens: [
      { label: "Initializing X12 278 API", duration: 7500, thinkingText: `Initializing secure connection to ${order.payer} X12 278 API endpoint — TLS 1.3 handshake in progress...` },
      { label: "Composing request payload", duration: 11500, thinkingText: `Compiling submission package — form data, ${details.documents.length} clinical documents, and medical necessity narrative...` },
      { label: "Response: 200 OK", duration: 6500, thinkingText: `Transmitting encrypted payload to ${order.payer} — awaiting acknowledgment from payer gateway...` },
      { label: "Submission confirmed", duration: 5000, thinkingText: `PA request confirmed — Tracking ID ${details.trackingId} received — case now under review...` },
    ],
    onCompleteActions: [
      { type: "MARK_SUBMITTED" } satisfies CaseBuilderAction,
      {
        type: "SET_SUBMISSION_DETAILS",
        payload: {
          trackingId: details.trackingId,
          channel: "api",
          submittedAt: new Date().toISOString(),
          expectedResponse: details.expectedResponse,
        } satisfies SubmissionDetails,
      } satisfies CaseBuilderAction,
    ],
  };
}

// Voice Submission (UHC)
export function createPhase_submitVoice(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  const phoneNum = details.voicePhoneNumber ?? "1-800-555-0199";
  return {
    phaseId: "submit-voice",
    title: "Submitting via Voice/IVR",
    subtitle: `${details.payerFull} — ${order.patientName}`,
    icon: "📞",
    systemType: "uhc-voice",
    systemUrl: "ivr.uhc.com/prior-auth",
    steps: [
      { id: "sv-1", label: `Dialing ${order.payer} PA hotline`, detail: phoneNum, duration: 1000 },
      { id: "sv-2", label: "Navigating IVR menu", detail: "Selected Prior Authorization → New Request", duration: 1200 },
      { id: "sv-3", label: "Dictating PA details", detail: "Patient, procedure, and diagnosis transmitted", duration: 1500 },
      { id: "sv-4", label: "Reference number received", detail: `${details.trackingId} — call complete`, duration: 800 },
    ],
    screens: [
      { label: `Connecting to ${order.payer} Voice IVR`, duration: 5500, thinkingText: `Switching to ${order.payer} Voice IVR system — preparing automated phone call to ${details.payerFull} PA hotline...` },
      { label: `Dialing ${phoneNum}`, duration: 8000, thinkingText: `Dialing ${order.payer} PA hotline at ${phoneNum} — waiting for IVR system to answer...` },
      { label: "Navigating IVR prompts", duration: 10000, thinkingText: "Navigating IVR menu tree — selecting Prior Authorization → New Request → Provider submission..." },
      { label: "Call complete — reference received", duration: 6000, thinkingText: `PA details transmitted via voice — reference number ${details.trackingId} confirmed — call duration 3:42...` },
    ],
    onCompleteActions: [
      { type: "MARK_SUBMITTED" } satisfies CaseBuilderAction,
      {
        type: "SET_SUBMISSION_DETAILS",
        payload: {
          trackingId: details.trackingId,
          channel: "voice",
          submittedAt: new Date().toISOString(),
          expectedResponse: details.expectedResponse,
        } satisfies SubmissionDetails,
      } satisfies CaseBuilderAction,
    ],
  };
}

// Fax Submission (UHC — follows voice call)
export function createPhase_submitVoiceFax(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  const faxNum = details.faxNumber ?? "1-800-555-0143";
  const faxConf = details.faxConfirmation ?? "FX-00000";
  return {
    phaseId: "submit-voice-fax",
    title: `Faxing PA Form to ${order.payer}`,
    subtitle: `${details.payerFull} — ${order.patientName}`,
    icon: "📠",
    systemType: "uhc-fax",
    systemUrl: "fax.northstarhealth.org/secure",
    steps: [
      { id: "sf-1", label: "Generating PA form PDF", detail: "Compiling case data into standard PA form", duration: 900 },
      { id: "sf-2", label: "Attaching clinical documents", detail: `${details.documents.length} supporting documents bundled`, duration: 800 },
      { id: "sf-3", label: `Transmitting fax to ${order.payer}`, detail: `Fax: ${faxNum} — 5 pages`, duration: 1200 },
      { id: "sf-4", label: "Fax confirmation received", detail: `Confirmation #${faxConf} — delivered`, duration: 700 },
    ],
    screens: [
      { label: "Preparing PA form for fax", duration: 6000, thinkingText: `Generating PA form PDF — compiling patient demographics, procedure codes, diagnosis, and clinical justification into standard ${order.payer} PA format...` },
      { label: "Bundling clinical documents", duration: 6000, thinkingText: `Attaching clinical documents — ${details.documents.length + 2}-page fax package assembled...` },
      { label: "Transmitting secure fax", duration: 8000, thinkingText: `Transmitting fax to ${order.payer} Prior Auth at ${faxNum} — secure HIPAA-compliant fax gateway — 5 pages sending...` },
      { label: "Fax delivered — confirmation received", duration: 5000, thinkingText: `Fax successfully delivered — confirmation #${faxConf} — ${order.payer} fax server acknowledged receipt of all 5 pages...` },
    ],
    onCompleteActions: [],
  };
}

// RPA Submission (Aetna)
export function createPhase_submitRpa(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "submit-rpa",
    title: "Submitting via RPA Bot",
    subtitle: `${details.payerFull} Portal — ${order.patientName}`,
    icon: "🤖",
    systemType: "aetna-portal",
    systemUrl: `provider.${order.payer.toLowerCase()}.com/prior-auth`,
    steps: [
      { id: "sr-1", label: `Logging into ${details.payerFull} portal`, detail: "Secure credential injection", duration: 1000 },
      { id: "sr-2", label: "Navigating to PA submission", detail: "Prior Auth → New Request form", duration: 900 },
      { id: "sr-3", label: "Auto-filling form fields", detail: "18 fields populated from case data", duration: 1200 },
      { id: "sr-4", label: "Uploading clinical documents", detail: `${details.documents.length} documents attached to submission`, duration: 1100 },
      { id: "sr-5", label: "Submission confirmed", detail: `${details.trackingId} — processing`, duration: 800 },
    ],
    screens: [
      { label: `Launching ${details.payerFull} portal bot`, duration: 5500, thinkingText: `Switching to ${details.payerFull} portal RPA bot — initializing headless browser for automated form submission...` },
      { label: `Authenticating to ${details.payerFull}`, duration: 8000, thinkingText: `Injecting provider credentials securely — completing MFA challenge — authenticating to ${details.payerFull} provider portal...` },
      { label: "Auto-filling PA form", duration: 10000, thinkingText: "Auto-filling PA submission form — patient demographics, procedure codes, diagnosis, and clinical justification..." },
      { label: "Uploading documents", duration: 9000, thinkingText: `Uploading clinical documentation — ${details.documents.join(", ").toLowerCase()} — verifying file integrity...` },
      { label: "Submission confirmed", duration: 5500, thinkingText: `${details.payerFull} PA request submitted — reference number ${details.trackingId} — expected response in ${details.expectedResponse}...` },
    ],
    onCompleteActions: [
      { type: "MARK_SUBMITTED" } satisfies CaseBuilderAction,
      {
        type: "SET_SUBMISSION_DETAILS",
        payload: {
          trackingId: details.trackingId,
          channel: "rpa",
          submittedAt: new Date().toISOString(),
          expectedResponse: details.expectedResponse,
        } satisfies SubmissionDetails,
      } satisfies CaseBuilderAction,
    ],
  };
}

// Patient notification
export function createPhase_patientNotify(_ctx: OrderContext): AgentStepsPhase {
  return {
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
}

// Check status (API / RPA path)
export function createPhase_checkStatus(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  return {
    phaseId: "check-status",
    title: "Checking Submission Status",
    subtitle: "Verifying payer received the request",
    icon: "✅",
    systemType: "northstar-pa",
    systemUrl: "app.northstarhealth.org/pa/status",
    steps: [
      { id: "s13-1", label: "Queried payer status API", detail: "Real-time status check initiated", duration: 900 },
      { id: "s13-2", label: "Status: Under Review", detail: `Expected decision in ${details.expectedResponse}`, duration: 800 },
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
      `PA Case Complete! Here's the summary:\n\n` +
      `• Case ID: ${ctx.caseId}\n` +
      `• Patient: ${order.patientName} (MRN: ${details.mrn})\n` +
      `• Procedure: ${order.procedure} (CPT ${order.cptCode})\n` +
      `• Diagnosis: ${order.diagnosis} (${order.icd10Code})\n` +
      `• Status: Under Review\n` +
      `• Expected Decision: ${details.expectedResponse}\n` +
      `• Approval Likelihood: ${details.approvalLikelihood}%\n\n` +
      "I've set up auto-monitoring and will notify you of any status changes or RFIs. The case is now in your active queue.",
  };
}

// Check status (Voice path)
export function createPhase_checkStatusVoice(ctx: OrderContext): AgentStepsPhase {
  const { order, details } = ctx;
  const faxConf = details.faxConfirmation ?? "FX-00000";
  return {
    phaseId: "check-status",
    title: "Confirming Submission Status",
    subtitle: `Verifying voice + fax delivery to ${order.payer}`,
    icon: "✅",
    systemType: "northstar-pa",
    systemUrl: "app.northstarhealth.org/pa/status",
    steps: [
      { id: "s13v-1", label: "Voice reference verified", detail: `${details.trackingId} — call logged`, duration: 900 },
      { id: "s13v-2", label: "Fax delivery confirmed", detail: `${faxConf} — 5/5 pages received`, duration: 800 },
      { id: "s13v-3", label: "Auto-monitoring configured", detail: "Will alert on status changes", duration: 700 },
    ],
    screens: [
      { label: "Verifying voice + fax submissions", duration: 8000, thinkingText: `Cross-referencing voice call reference ${details.trackingId} with fax confirmation ${faxConf} — verifying ${order.payer} received both submissions...` },
      { label: "Auto-monitoring configured", duration: 6500, thinkingText: `Configuring auto-monitoring — tracking PA status via ${order.payer} provider portal, alerts on decision, RFI auto-detection...` },
      { label: "All systems green", duration: 5500, thinkingText: "All submissions confirmed — voice call logged, fax delivered, PA workflow complete, monitoring active..." },
    ],
    onCompleteActions: [
      { type: "ADVANCE_STEP", payload: "check-status" } satisfies CaseBuilderAction,
    ],
    followUpMessage:
      `PA Case Complete! Here's the summary:\n\n` +
      `• Case ID: ${ctx.caseId}\n` +
      `• Patient: ${order.patientName} (Member ID: ${details.memberId})\n` +
      `• Procedure: ${order.procedure} (CPT ${order.cptCode})\n` +
      `• Diagnosis: ${order.diagnosis} (${order.icd10Code})\n` +
      `• Voice Reference: ${details.trackingId}\n` +
      `• Fax Confirmation: ${faxConf} (5 pages)\n` +
      `• Status: Under Review\n` +
      `• Expected Decision: ${details.expectedResponse}\n\n` +
      "I've set up auto-monitoring and will notify you of any status changes or RFIs. The case is now in your active queue.",
  };
}

// ── Phase queue builders (factory functions) ───────────────────────────────

export function createAutonomousPhases(ctx: OrderContext): AgentStepsPhase[] {
  return [
    createPhase_patientDetails(ctx),
    createPhase_payerRules(ctx),
    createPhase_documentChecklist(ctx),
    createPhase_fetchDocuments(ctx),
    createPhase_fillForm(ctx),
  ];
}

export function createSubmissionPhasesApi(ctx: OrderContext): AgentStepsPhase[] {
  return [
    createPhase_submitApi(ctx),
    createPhase_patientNotify(ctx),
    createPhase_checkStatus(ctx),
  ];
}

export function createSubmissionPhasesVoice(ctx: OrderContext): AgentStepsPhase[] {
  return [
    createPhase_submitVoice(ctx),
    createPhase_submitVoiceFax(ctx),
    createPhase_patientNotify(ctx),
    createPhase_checkStatusVoice(ctx),
  ];
}

export function createSubmissionPhasesRpa(ctx: OrderContext): AgentStepsPhase[] {
  return [
    createPhase_submitRpa(ctx),
    createPhase_patientNotify(ctx),
    createPhase_checkStatus(ctx),
  ];
}
