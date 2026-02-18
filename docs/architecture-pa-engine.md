# Brightvista PA Engine — Full System Architecture

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Frontend: AI-Powered Case Builder](#3-frontend-ai-powered-case-builder)
4. [Backend Services](#4-backend-services)
   - 4.1 [Order Ingestion Service](#41-order-ingestion-service)
   - 4.2 [PA Determination Engine](#42-pa-determination-engine)
   - 4.3 [Payer Intelligence Service](#43-payer-intelligence-service)
   - 4.4 [AI Case Builder Service](#44-ai-case-builder-service)
   - 4.5 [Submission & Routing Service](#45-submission--routing-service)
   - 4.6 [Monitoring & Status Service](#46-monitoring--status-service)
   - 4.7 [Appeals & Escalation Service](#47-appeals--escalation-service)
5. [AI Voice Agent (vapi)](#5-ai-voice-agent-vapi)
6. [Browser Automation Agent (browser-use.com)](#6-browser-automation-agent-browser-usecom)
7. [AI Learning Layer](#7-ai-learning-layer)
8. [Data Flow](#8-data-flow)
9. [Database Schema Overview](#9-database-schema-overview)
10. [Security & Compliance](#10-security--compliance)
11. [Technology Stack](#11-technology-stack)

---

## 1. System Overview

Brightvista is an AI-native prior authorization (PA) platform that automates the entire PA lifecycle — from order ingestion through payer submission to final decision. The system replaces manual, fragmented workflows with an intelligent pipeline where AI is embedded in every service, not bolted on as an afterthought.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **AI-First** | Every service has AI at its core — not as a feature, but as the foundation |
| **Ambient Intelligence** | The system proactively surfaces data and takes action without waiting for human input |
| **Self-Updating** | Payer rules, submission strategies, and predictions improve automatically through outcome feedback |
| **Multi-Channel** | Submits and communicates via API, web portal automation, and voice — matching each payer's preferred channel |
| **Editable AI Output** | Every AI-generated field can be reviewed and corrected by human coordinators |
| **Transparent** | Every data point shows its source, confidence level, and verification status |

### System Scope

```
EHR Order → PA Determination → Case Building → Submission → Monitoring → Decision
     ↑                                                                      |
     └──────────────── Learning Layer (continuous feedback) ←───────────────┘
```

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SYSTEMS                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌────────┐  ┌───────────┐  │
│  │   EHR    │  │  Payer   │  │ Payer Web    │  │  Payer │  │  Clinical │  │
│  │ Systems  │  │  APIs    │  │ Portals      │  │  Phone │  │ Guidelines│  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘  └───┬────┘  └─────┬─────┘  │
└───────┼──────────────┼───────────────┼──────────────┼─────────────┼────────┘
        │              │               │              │             │
        ▼              ▼               ▼              ▼             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BRIGHTVISTA PLATFORM                              │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────────────────────┐  │
│  │  Order          │  │         Payer Intelligence Service               │  │
│  │  Ingestion      │  │  ┌──────────────┐  ┌──────────────────────┐    │  │
│  │  Service        │  │  │ Browser      │  │ AI Document          │    │  │
│  │                 │  │  │ Crawler      │  │ Processor            │    │  │
│  │  - FHIR/HL7    │  │  │ (browser-    │  │                      │    │  │
│  │  - Clinical NLP │  │  │  use.com)    │  │ - PDF extraction     │    │  │
│  │  - Order        │  │  │              │  │ - Policy parsing     │    │  │
│  │    Classification│  │  │ - Login      │  │ - Rule structuring   │    │  │
│  └────────┬────────┘  │  │ - Navigate   │  │ - Form field mapping │    │  │
│           │           │  │ - Extract    │  └──────────┬───────────┘    │  │
│           │           │  │ - Download   │             │                │  │
│           │           │  └──────┬───────┘             │                │  │
│           │           │         └─────────┬───────────┘                │  │
│           │           │                   ▼                            │  │
│           │           │         ┌──────────────────┐                  │  │
│           │           │         │ Payer Rules DB   │                  │  │
│           │           │         │                  │                  │  │
│           │           │         │ - PA requirements│                  │  │
│           │           │         │ - Doc checklists │                  │  │
│           │           │         │ - Medical policy │                  │  │
│           │           │         │ - Form schemas   │                  │  │
│           │           │         └────────┬─────────┘                  │  │
│           │           └─────────────────┼────────────────────────────┘  │
│           │                             │                               │
│           ▼                             ▼                               │
│  ┌──────────────────────────────────────────────────────┐               │
│  │              PA Determination Engine                   │               │
│  │                                                        │               │
│  │  Order + Payer Rules → PA Required? (Yes/No/Maybe)    │               │
│  │                                                        │               │
│  │  - Rule matching (CPT + payer + plan)                 │               │
│  │  - Pattern recognition (historical approvals)          │               │
│  │  - Medical necessity pre-check                        │               │
│  │  - Approval probability prediction                    │               │
│  └────────────────────────┬─────────────────────────────┘               │
│                           │                                              │
│                           ▼                                              │
│  ┌──────────────────────────────────────────────────────┐               │
│  │              AI Case Builder Service                   │               │
│  │                                                        │               │
│  │  - Auto-populate patient, procedure, docs              │               │
│  │  - Gap analysis (what's missing?)                     │               │
│  │  - Clinical narrative generation                      │               │
│  │  - Approval likelihood scoring                        │               │
│  │  - Document requirement mapping                       │               │
│  └────────────────────────┬─────────────────────────────┘               │
│                           │                                              │
│                           ▼                                              │
│  ┌──────────────────────────────────────────────────────┐               │
│  │              Submission & Routing Service              │               │
│  │                                                        │               │
│  │  ┌───────────────────────────────────────────────┐    │               │
│  │  │            Smart Submission Router             │    │               │
│  │  │  Payer profile → best method → fallback chain  │    │               │
│  │  └──────┬────────────┬────────────┬──────────────┘    │               │
│  │         │            │            │                    │               │
│  │         ▼            ▼            ▼                    │               │
│  │  ┌──────────┐ ┌───────────┐ ┌───────────┐            │               │
│  │  │  Payer   │ │  Browser  │ │   Voice   │            │               │
│  │  │  API     │ │  Agent    │ │   Agent   │            │               │
│  │  │          │ │ (browser- │ │  (vapi)   │            │               │
│  │  │ X12 278  │ │  use.com) │ │           │            │               │
│  │  │ FHIR PA  │ │           │ │ IVR + Rep │            │               │
│  │  └──────────┘ └───────────┘ └───────────┘            │               │
│  └────────────────────────┬─────────────────────────────┘               │
│                           │                                              │
│                           ▼                                              │
│  ┌──────────────────────────────────────────────────────┐               │
│  │           Monitoring & Status Service                  │               │
│  │                                                        │               │
│  │  - Poll payer APIs for status updates                 │               │
│  │  - Browser agent checks portal status pages           │               │
│  │  - Voice agent calls for status on phone-only payers  │               │
│  │  - SLA tracking and breach alerts                     │               │
│  │  - Auto-escalation on delays                          │               │
│  └────────────────────────┬─────────────────────────────┘               │
│                           │                                              │
│                           ▼                                              │
│  ┌──────────────────────────────────────────────────────┐               │
│  │           Appeals & Escalation Service                 │               │
│  │                                                        │               │
│  │  - Auto-generate appeal letters from denial reasons   │               │
│  │  - Schedule peer-to-peer reviews                      │               │
│  │  - Submit appeals via all 3 channels                  │               │
│  │  - Track appeal outcomes                              │               │
│  └──────────────────────────────────────────────────────┘               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    AI Learning Layer                               │   │
│  │                                                                    │   │
│  │  Outcomes feed back into every service:                           │   │
│  │  - Approval/denial patterns → refine PA determination rules       │   │
│  │  - Submission success rates → optimize routing decisions          │   │
│  │  - Payer response times → predict SLA timelines                   │   │
│  │  - Appeal outcomes → improve narrative generation                 │   │
│  │  - Portal changes → update browser agent navigation maps          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Frontend: Case Builder UI                       │   │
│  │                                                                    │   │
│  │  Split-View Layout:                                               │   │
│  │  ┌──────────────────────────┐  ┌─────────────────────────┐       │   │
│  │  │  Chat Column (AI Agent)  │  │  Summary Panel (400px)  │       │   │
│  │  │                          │  │                         │       │   │
│  │  │  - Conversational guide  │  │  - Case details         │       │   │
│  │  │  - Thinking indicators   │  │  - Patient info         │       │   │
│  │  │  - EHR/Upload/Capture    │  │  - Case tracker         │       │   │
│  │  │  - Next-best-action      │  │  - Procedure            │       │   │
│  │  │  - Smart empty state     │  │  - Documents            │       │   │
│  │  │  - Enhanced input        │  │  - Approval likelihood  │       │   │
│  │  │                          │  │  - Submit/Save Draft    │       │   │
│  │  └──────────────────────────┘  └─────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend: AI-Powered Case Builder

### 3.1 Design Philosophy

The case builder uses a **hybrid conversational + structured** approach. The left column provides an AI chat agent that guides the coordinator through each step. The right column provides a live summary panel that builds itself as data flows in from the conversation.

### 3.2 Split-View Layout

| Column | Width | Purpose |
|--------|-------|---------|
| **Chat (left)** | `flex-1` (fills remaining space) | Conversational AI agent interface |
| **Summary Panel (right)** | `400px` fixed | Structured case data, editable fields, progress tracking |

The summary panel animates in (`width: 0→400px, opacity: 0→1, 350ms ease-out`) when the case transitions from draft to in-progress.

### 3.3 Chat Column

**Header**: "New Case" with back navigation button.

**Smart Empty State**: Shown before any messages are sent.
- Quick Start section: 3 contextual cards (continue draft, urgent task, pre-filled template)
- Action section: 4 suggested prompts (EHR lookup, upload document, capture document, manual entry)

**Message Types**:
- User bubbles (right-aligned, brand background)
- Agent bubbles (left-aligned, light background, markdown rendering)
- Thinking indicators (animated step-by-step reasoning display)
- Next-best-action cards (suggested next step after agent response)
- Action option cards (multiple choice for data source selection)

**Special Content Panels** (inline within chat):
- EHR Consent Card — OAuth-style authorization prompt
- EHR Redirect Overlay — simulated SSO redirect animation
- EHR Agent Panel — animated data extraction visualization
- Document Upload Zone — drag-and-drop file upload
- Document Capture Zone — camera capture simulation

**Enhanced Chat Input**:
- Auto-resizing textarea (1-4 rows, max 96px height)
- Toolbar buttons with tooltips (formatting, attach, quick actions)
- Contextual suggestion chips that change per current step

### 3.4 Summary Panel

The panel uses a **seamless sections** design — no card borders, continuous document-like flow with thin `#f0f2f4` dividers between sections.

**Sections in order:**

1. **Case Header** — Auto-generated case ID (`PA-2026-XXXX`) + status badge
   - Draft: gray badge
   - In Progress: blue badge
   - Submitted: green badge

2. **Patient Section** — Key-value rows with inline editing
   - Fields: Patient Name, DOB, MRN, Insurance Payer, Member ID, Plan Type, Physician, Phone, Address
   - Confidence indicators per field: green dot (Verified/EHR), blue dot (AI Extracted), orange dot (Needs Review)
   - Edit toggle: pencil icon switches fields to editable inputs
   - Editing a field dispatches `SET_PATIENT_FIELD` with `source: "manual", confidence: 100`

3. **Case Tracker** — Vertical timeline with 7 lifecycle steps
   - Steps: Patient Info → Procedure → Documentation → Review → Submit → Check Status (3 business days) → Approval / Denial
   - Visual states per step:
     - **Complete**: green filled circle with check icon, strikethrough label
     - **Active**: brand-colored ring with center dot, bold label
     - **Needs Attention**: orange ring with center dot, orange label
     - **Pending**: empty gray circle, muted label
   - Connecting vertical lines: green after completed steps, gray otherwise

4. **Procedure Section** — CPT code, ICD-10 code, ordering physician
   - Inline validation indicators (green check, red X, spinning loader)
   - Auto-fills description when code validates

5. **Documents Section** — Checklist of required and recommended documents
   - Status icons: CheckCircle (found), XCircle (missing), AlertCircle (recommended), Minus (N/A)
   - REQ badge on required documents
   - Source and date metadata
   - Hover actions: Upload, Request from EMR, Mark N/A

6. **Approval Section** — Live approval likelihood score
   - Horizontal progress bar with color transitions (red <40%, orange 40-70%, green >70%)
   - Likelihood badge (High/Moderate/Low)
   - Contributing factors list with +N% or -N% indicators
   - Recalculates automatically on every state change

7. **Action Footer** — Fixed at bottom
   - "Submit Case" button (brand color, disabled until review step ready)
   - "Save as Draft" button (outlined)

### 3.5 State Management

Centralized `useReducer` hook (`useCaseBuilder`) manages all case data:

```typescript
interface CaseBuilderState {
  caseId: string;
  status: "draft" | "in-progress" | "submitted";
  currentStep: StepId;
  steps: StepState[];
  patient: Partial<PatientData>;
  patientConfidence: PatientFieldConfidence;
  procedure: Partial<ProcedureData>;
  documents: DocumentRequirement[];
  approvalLikelihood: number;
  approvalFactors: ApprovalFactor[];
}
```

**Derived computations** run after every action:
- `deriveStepStatuses(state)` — determines which steps are complete/active/pending/needs-attention
- `calculateApprovalLikelihood(state)` — scores approval probability from 5 weighted factors

**Actions**: `SET_PATIENT_FIELDS`, `SET_PATIENT_FIELD`, `SET_PROCEDURE`, `SET_DOCUMENTS`, `UPDATE_DOCUMENT_STATUS`, `ADVANCE_STEP`, `GO_TO_STEP`, `MARK_SUBMITTED`, `SAVE_DRAFT`, `RESET`

### 3.6 Data Flow (Chat → Panel)

```
User sends message or clicks prompt
    ↓
findNewCaseEntry(text) → returns { response, thinking, stateUpdates, nextAction }
    ↓
Chat shows thinking indicator → then agent message
    ↓
dispatch(stateUpdates) → reducer updates state → derived values recalculate
    ↓
Summary panel re-renders with new data
```

Bidirectional: user can also edit fields directly in the summary panel, which dispatches actions back to the reducer, recalculating all derived values.

---

## 4. Backend Services

### 4.1 Order Ingestion Service

The entry point for all PA workflows. Receives orders from EHR systems and determines what needs to happen.

**AI Capabilities:**
- **Clinical NLP** — Parses unstructured order notes, extracts diagnoses, procedures, and clinical context
- **Order Classification** — Categorizes orders by type, urgency, complexity, and department
- **Duplicate Detection** — Identifies potential duplicate or overlapping orders
- **Data Enrichment** — Cross-references patient history to add relevant context

**Inputs:**
- FHIR R4 / HL7 v2 order messages from EHR systems
- Manual order entry from coordinators

**Outputs:**
- Structured order object with extracted clinical data
- Routed to PA Determination Engine

```
EHR System → FHIR/HL7 Order
    ↓
┌───────────────────────────────────┐
│  Order Ingestion Service          │
│                                   │
│  1. Parse message format          │
│  2. Extract clinical entities     │
│     (NLP: diagnoses, procedures,  │
│      medications, physicians)     │
│  3. Classify order type + urgency │
│  4. Check for duplicates          │
│  5. Enrich with patient history   │
│  6. Route to PA Determination     │
└───────────────────┬───────────────┘
                    ↓
           PA Determination Engine
```

### 4.2 PA Determination Engine

The brain of the system. Determines whether an order requires prior authorization and, if so, what exactly is needed.

**AI Capabilities:**
- **Rule Matching** — Matches CPT + payer + plan type against the Payer Rules DB
- **Pattern Recognition** — Uses historical approval/denial data to identify patterns (e.g., "this CPT always requires PA with Aetna PPO but never with Aetna HMO")
- **Medical Necessity Pre-Check** — Evaluates whether the clinical data in the order meets known payer criteria before submission
- **Approval Probability Prediction** — Predicts likelihood of approval based on case completeness, historical patterns, and payer behavior
- **Requirement Generation** — Outputs the exact list of documents, clinical data, and forms needed

**Decision Output:**

| Decision | Action |
|----------|--------|
| **PA Not Required** | Order proceeds. Notify provider. Log for audit. |
| **PA Required** | Generate case with requirements. Route to Case Builder. |
| **PA Likely Required** | Flag for coordinator review. Provide confidence score. |
| **Insufficient Data** | Request additional information from provider. |

**Rule Sources (from Payer Intelligence Service):**
- Payer-published PA requirement lists
- Medical policy documents
- Historical approval/denial patterns
- State and federal regulations

```
Structured Order + Patient Data
    ↓
┌───────────────────────────────────────────────┐
│  PA Determination Engine                       │
│                                                │
│  1. Lookup: payer + plan + CPT → rules exist? │
│     ├─ YES → apply rule set                   │
│     └─ NO  → trigger payer crawl (§4.3)       │
│                                                │
│  2. Rule evaluation:                           │
│     - Is this CPT on the payer's PA list?     │
│     - Does the plan type exempt this service? │
│     - Is there a state mandate exemption?     │
│                                                │
│  3. Medical necessity pre-check:               │
│     - Does clinical data meet criteria?       │
│     - Is conservative therapy documented?     │
│     - Are required referrals present?         │
│                                                │
│  4. Pattern analysis:                          │
│     - Historical approval rate for this combo │
│     - Common denial reasons for similar cases │
│     - Predicted approval probability          │
│                                                │
│  5. Output:                                    │
│     - PA Required: YES/NO/LIKELY              │
│     - Required documents checklist            │
│     - Missing data gaps                       │
│     - Approval prediction + confidence        │
│     - Recommended actions                     │
└───────────────────────────────────────────────┘
```

### 4.3 Payer Intelligence Service

The system's **eyes into the payer world**. Uses browser-use.com to crawl payer portals, extract PA requirements, parse policy documents, and maintain a living database of payer rules that never goes stale.

**AI Capabilities:**
- **Autonomous Web Crawling** — browser-use.com agent logs into payer portals, navigates to PA requirement pages, and extracts structured data
- **PDF/Document Extraction** — AI processes downloaded policy PDFs, medical bulletins, and coverage guides into structured rules
- **Change Detection** — Compares current crawl results against cached rules to detect policy updates
- **Form Field Mapping** — Learns each portal's submission form structure for later automated submission

**What It Collects:**

| Data Type | Description | Example |
|-----------|-------------|---------|
| **PA Requirement Lists** | Which CPT codes require PA per plan | CPT 72141 requires PA for BCBS PPO |
| **Required Documents** | Exact docs needed per procedure | Clinical notes, PT records (6+ weeks), referral letter |
| **Medical Necessity Criteria** | Payer's approval checklist | Must show failed conservative therapy |
| **Step Therapy Requirements** | Required treatment progression | NSAIDs → PT → Imaging |
| **Policy References** | Official policy document IDs | Medical Policy #2024-SP-041 |
| **Submission Forms** | Portal form field schemas | Field mappings for online PA form |
| **Review Timeframes** | Standard and urgent review periods | Standard: 3 business days, Urgent: 24 hours |
| **Fax Numbers & Addresses** | Contact info for non-digital submissions | PA Dept fax: (800) 555-0199 |

**Crawl Triggers:**

| Trigger | When | Priority |
|---------|------|----------|
| **Scheduled** | Weekly full crawl of top payers | Low |
| **On-demand** | New CPT+payer combo with no cached rules | High |
| **Change detection** | Portal UI changed or policy date updated | Medium |
| **Post-denial** | After a denial, re-crawl to check if rules changed | High |
| **User request** | Coordinator clicks "Refresh payer rules" | High |

**Crawl Process:**

```
Crawl Trigger (scheduled / on-demand / post-denial)
    ↓
┌──────────────────────────────────────────┐
│  Browser Agent (browser-use.com)          │
│                                           │
│  1. Retrieve payer credentials from vault │
│  2. Login to payer portal                 │
│  3. Navigate to PA requirements section   │
│  4. Search by CPT code or procedure name  │
│  5. Extract requirement text + tables     │
│  6. Download linked policy PDFs           │
│  7. Capture form field structures         │
│  8. Screenshot pages for audit trail      │
└─────────────┬────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  AI Document Processor                    │
│                                           │
│  1. PDF → text extraction (OCR if needed) │
│  2. Policy text → structured rules        │
│  3. Requirement lists → document schemas  │
│  4. Forms → field mapping JSON            │
│  5. Compare against existing cached rules │
│  6. Flag changes and new requirements     │
└─────────────┬────────────────────────────┘
              ↓
┌──────────────────────────────────────────┐
│  Payer Rules Database (upsert)            │
│                                           │
│  payer_id + cpt_code → {                  │
│    pa_required: true,                     │
│    required_docs: [...],                  │
│    medical_necessity_criteria: [...],     │
│    step_therapy: [...],                   │
│    review_timeframe: "3 business days",   │
│    policy_reference: "SP-2024-041",       │
│    submission_methods: ["api", "portal"], │
│    portal_form_schema: {...},             │
│    last_crawled: "2026-02-18",            │
│    source_url: "https://...",             │
│    confidence: 0.97                       │
│  }                                        │
└──────────────────────────────────────────┘
```

### 4.4 AI Case Builder Service

Orchestrates case construction by pulling together patient data, clinical information, payer requirements, and documents into a submission-ready case.

**AI Capabilities:**
- **Auto-Population** — Pulls patient demographics from EHR, maps to required fields
- **Document Gap Analysis** — Compares available documents against payer requirements, identifies what's missing
- **Clinical Narrative Generation** — Writes medical necessity justification letters tailored to each payer's criteria
- **Smart Document Assembly** — Organizes and orders documents for optimal payer review
- **Approval Likelihood Scoring** — Real-time scoring across 5 weighted factors:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| Patient completeness | 20% | All required patient fields populated and verified |
| Procedure validation | 15% | CPT and ICD-10 codes valid and appropriately paired |
| Required docs present | 35% | All payer-required documents found and current |
| Conservative therapy | 15% | Evidence of step therapy / conservative treatment |
| Specialist referral | 15% | Appropriate referral chain documented |

**Process:**

```
PA Determination Output + Payer Rules
    ↓
┌───────────────────────────────────────────────┐
│  AI Case Builder Service                       │
│                                                │
│  1. Create case shell with generated ID        │
│  2. Pull patient data from EHR (auto-populate) │
│  3. Map procedure codes, validate against payer│
│  4. Run document gap analysis:                 │
│     - Required docs: what's available vs needed│
│     - Flag missing documents                   │
│     - Suggest sources for missing docs         │
│  5. Generate clinical narrative:               │
│     - Tailored to payer's known criteria       │
│     - Includes relevant clinical history       │
│     - References applicable guidelines         │
│  6. Calculate approval likelihood              │
│  7. Surface case to coordinator via UI         │
│     (or auto-submit if confidence > threshold) │
└───────────────────────────────────────────────┘
```

### 4.5 Submission & Routing Service

The **Smart Submission Router** determines the optimal submission channel for each payer and manages the full submission lifecycle.

**Three Submission Channels:**

#### Channel 1: Direct Payer API

**When Used**: Payer has a published PA API (X12 278, FHIR Prior Authorization, proprietary).

**Process:**
```
Case Data → Transform to API format → POST to payer endpoint → Parse response
```

**Advantages**: Fastest method. Real-time or near-real-time status. Structured response. Most reliable.

**Supported Standards:**
- X12 278 Health Care Services Review
- FHIR R4 Prior Authorization (CRD, DTR, PAS)
- Payer proprietary REST APIs
- Availity, Change Healthcare, and clearinghouse APIs

**Example Payers**: UnitedHealthcare, Aetna, Cigna, Humana, major national payers with published APIs.

#### Channel 2: Browser Automation (browser-use.com)

**When Used**: Payer has a web portal but no API, or the API doesn't support the required workflow.

**Process:**
```
Case Data → Browser agent login → Navigate to PA form → Fill fields → Upload docs → Submit → Capture confirmation
```

**Capabilities:**
- Login with stored credentials from encrypted vault
- Navigate complex portal UIs (multi-page forms, tabs, popups)
- Fill form fields using portal_form_schema from Payer Intelligence
- Upload supporting documents in accepted formats
- Handle CAPTCHAs (with fallback to human coordinator)
- Capture submission confirmation numbers and screenshots
- Adapt to portal UI changes (AI recognizes field purpose, not just position)

**Resilience:**
- Retries on timeout or transient errors
- Falls back to next channel in the chain on persistent failure
- Alerts coordinator if portal is down or credentials expired

**Example Payers**: Regional payers, specialty pharmacy portals, Medicaid plans with web-only submission.

#### Channel 3: AI Voice Agent (vapi)

**When Used**: Payer only accepts phone submissions, or as escalation when other channels fail.

**Full capabilities documented in [Section 5: AI Voice Agent](#5-ai-voice-agent-vapi).**

**Example Payers**: Small regional payers, certain Medicaid/Medicare Advantage plans, phone-only appeal lines.

#### Smart Routing Logic

```
Case ready for submission
    ↓
┌──────────────────────────────────────────┐
│  Submission Router                        │
│                                           │
│  1. Lookup payer profile:                 │
│     - Supported channels: [api, web, phone]
│     - Preferred channel (from success data)
│     - Fallback chain order                │
│                                           │
│  2. Channel availability check:           │
│     - API endpoint healthy?               │
│     - Portal accessible?                  │
│     - Voice queue wait time acceptable?   │
│                                           │
│  3. Select optimal channel:               │
│     - Primary: highest success rate       │
│     - Factor in urgency (API fastest)     │
│     - Factor in time of day (voice: M-F)  │
│                                           │
│  4. Execute submission                    │
│     - On failure → next in fallback chain │
│     - On success → log + update case      │
└──────────────────────────────────────────┘
```

**Payer Submission Profile:**

```json
{
  "payer_id": "bcbs_ct",
  "payer_name": "BlueCross BlueShield of Connecticut",
  "channels": {
    "api": {
      "available": true,
      "endpoint": "https://api.bcbsct.com/pa/v2/submit",
      "format": "X12_278",
      "success_rate": 0.94,
      "avg_response_time_ms": 2300
    },
    "web": {
      "available": true,
      "portal_url": "https://provider.bcbsct.com/pa",
      "form_schema_id": "bcbs_ct_pa_v3",
      "success_rate": 0.89,
      "avg_completion_time_min": 4.2
    },
    "voice": {
      "available": true,
      "phone_number": "+18005550199",
      "ivr_map_id": "bcbs_ct_ivr_v2",
      "success_rate": 0.82,
      "avg_call_duration_min": 12.5,
      "hours": "M-F 8am-6pm ET"
    }
  },
  "preferred_channel": "api",
  "fallback_chain": ["api", "web", "voice"]
}
```

### 4.6 Monitoring & Status Service

Tracks submitted cases across all channels until a final decision is reached.

**Multi-Channel Monitoring:**

| Channel | Status Check Method |
|---------|---------------------|
| **API** | Poll payer status endpoint (webhook if supported) |
| **Web** | Browser agent logs into portal, navigates to case status page |
| **Voice** | Voice agent calls payer status line, asks for update |

**Capabilities:**
- **SLA Tracking** — Monitors each case against payer's stated review timeframe
- **Breach Alerts** — Notifies coordinator when SLA is approaching or breached
- **Auto-Escalation** — Triggers follow-up (portal check, phone call) when status is overdue
- **Status Timeline** — Maintains full audit trail of every status check and change
- **Coordinator Notifications** — In-app alerts, optional email/SMS for critical updates

**Monitoring Cadence:**
- API payers: Every 4 hours (or webhook-driven)
- Web portal payers: Daily status check
- Phone-only payers: Check at 50%, 75%, and 100% of expected review period
- Urgent cases: Double frequency

### 4.7 Appeals & Escalation Service

Handles denied cases with AI-powered appeal generation and multi-channel appeal submission.

**AI Capabilities:**
- **Denial Analysis** — Parses denial reasons, maps to known payer objection patterns
- **Appeal Letter Generation** — Writes clinical appeal letters that directly address each denial reason
- **Guideline Citation** — References applicable clinical guidelines (ACR, AMA, specialty societies) that support the requested service
- **Strategy Selection** — Recommends appeal type: written appeal, peer-to-peer review, or external review
- **Peer-to-Peer Scheduling** — Voice agent calls payer to schedule P2P between ordering physician and payer medical director

**Appeal Workflow:**

```
Denial Received
    ↓
┌───────────────────────────────────────────────┐
│  AI Denial Analysis                            │
│                                                │
│  1. Parse denial reason codes                  │
│  2. Map to known payer objection patterns      │
│  3. Identify missing/weak elements in case     │
│  4. Check if payer rules changed (re-crawl)    │
│  5. Recommend appeal strategy:                 │
│     - Written appeal (strongest clinical case) │
│     - Peer-to-peer (physician availability)    │
│     - External review (after internal exhaust) │
└───────────────────┬───────────────────────────┘
                    ↓
┌───────────────────────────────────────────────┐
│  Appeal Generation                             │
│                                                │
│  1. Generate appeal letter:                    │
│     - Address each denial reason specifically  │
│     - Include new/additional clinical evidence │
│     - Cite relevant clinical guidelines        │
│     - Reference payer's own policy criteria    │
│  2. Assemble supporting documents              │
│  3. Submit via optimal channel                 │
│  4. If P2P: voice agent schedules review       │
└───────────────────────────────────────────────┘
```

---

## 5. AI Voice Agent (vapi)

The vapi-powered voice agent is a **full autonomous phone operator** capable of navigating IVR systems, speaking with human representatives, and handling complex multi-turn conversations.

### 5.1 IVR Navigation

| Capability | Description |
|------------|-------------|
| **DTMF Tone Generation** | Sends touch-tone signals to navigate menu trees (press 1, 2, 3...) |
| **Speech-Based IVR** | Understands "Say or press 1 for..." prompts and responds naturally |
| **IVR Tree Caching** | Learns and caches each payer's IVR structure for instant repeat navigation |
| **Hold Detection** | Recognizes hold music, silence, and "please hold" messages; waits patiently and resumes when a human picks up |
| **Transfer Handling** | When transferred between departments, re-introduces case context to the new representative |

### 5.2 Live Representative Interaction

| Capability | Description |
|------------|-------------|
| **Natural Conversation** | Speaks fluently with payer representatives using natural language |
| **Case Data Recall** | Instantly references patient name, DOB, MRN, CPT, ICD-10, insurance details from case state |
| **Clinical Justification** | Reads medical necessity narratives, explains why the procedure is needed with clinical detail |
| **Objection Handling** | Responds to pushback with relevant clinical data, alternative justifications, and guideline references |
| **Auth Number Capture** | Listens for and records authorization numbers, effective dates, and approved units |
| **Spelling & Verification** | Spells names character by character, reads member IDs, confirms details back to the representative |
| **Multi-Party Calls** | Can conference in the provider's office if the representative needs to verify information |

### 5.3 Advanced Voice Workflows

| Workflow | Description |
|----------|-------------|
| **PA Submission** | Full phone-based PA submission including all clinical details and supporting information |
| **Status Checks** | Calls payer to check pending PA status, captures current state and expected timeline |
| **Appeal Submissions** | Initiates verbal appeals, provides clinical rationale, references guidelines |
| **Peer-to-Peer Scheduling** | Requests and schedules P2P reviews between ordering physician and payer medical director |
| **Fax Confirmation** | Calls to confirm fax receipt, obtains reference numbers |
| **Callback Handling** | Manages scheduled callbacks, provides case context when payer calls back |

### 5.4 Intelligence Layer

| Feature | Description |
|---------|-------------|
| **Real-Time Transcription** | Full call transcript stored with the case for audit and review |
| **Sentiment Analysis** | Detects representative frustration or confusion, adjusts tone and approach |
| **Call Outcome Classification** | Auto-tags result: approved, denied, pended, need-more-info, callback-scheduled |
| **Payer Behavior Learning** | Tracks which representatives are faster, which departments handle which codes, best times to call (day/hour) |
| **Retry Logic** | Exponential backoff on disconnection or voicemail; configurable max retry count |
| **Escalation Trigger** | After N failed attempts, flags for human coordinator takeover with full context |

### 5.5 Example Call Flow

```
Voice Agent initiates call to BlueCross PA line: +1 (800) 555-0199
    ↓
IVR: "Welcome to BlueCross. Press 1 for providers, 2 for members..."
Agent: [sends DTMF tone: 1]
    ↓
IVR: "For prior authorization, press 3..."
Agent: [sends DTMF tone: 3]
    ↓
IVR: "Enter the member's ID followed by the pound sign"
Agent: [sends DTMF: 4-4-7-8-2-1-9-5-3-#]
    ↓
IVR: "Please hold for the next available representative"
Agent: [detects hold music → waits]
    ↓
Rep: "BlueCross PA department, this is Sarah, how can I help you?"
Agent: "Hi Sarah, I'm calling to submit a prior authorization for an MRI
        Cervical Spine, CPT code 72141, for patient Margaret Thompson,
        date of birth March 15, 1958, member ID BCB-447821953."
    ↓
Rep: "What's the diagnosis?"
Agent: "Cervical radiculopathy, ICD-10 M54.12. The patient has completed
        6 weeks of conservative therapy including physical therapy and
        NSAIDs without improvement. Dr. Sarah Patel is the ordering physician."
    ↓
Rep: "Do you have the clinical notes?"
Agent: "Yes, clinical notes from Dr. Patel dated February 3rd, 2026 are
        included in the submission along with 6 weeks of physical therapy
        records from Hartford Physical Therapy."
    ↓
Rep: "I've submitted that. Your authorization number is PA-2026-84291,
      approved for 1 unit, valid through March 18."
Agent: "Thank you Sarah. To confirm — authorization number PA-2026-84291,
        one unit of MRI Cervical Spine, valid through March 18, 2026.
        Is that correct?"
Rep: "That's correct."
Agent: "Thank you for your help. Have a good day."
    ↓
[Call ends → Post-call automation]
```

### 5.6 Post-Call Automation

After every call, the voice agent automatically:

1. **Updates case state** — auth number, status, dates, approved units flow back into case builder
2. **Generates call summary** — "Called BCBS at 2:14 PM ET, spoke with Sarah in PA dept, PA approved, auth #PA-2026-84291, valid through 03/18/2026"
3. **Stores transcript** — Full call recording + AI-generated text transcript attached to case
4. **Notifies coordinator** — In-app notification with call outcome; optional SMS/email for approvals and denials
5. **Updates payer intelligence** — Logs call duration, IVR path taken, representative name, outcome for future optimization
6. **Triggers next workflow** — If approved, notifies scheduling; if denied, routes to Appeals Service

---

## 6. Browser Automation Agent (browser-use.com)

The browser-use.com agent serves **two critical functions**: upstream intelligence gathering and downstream submission/monitoring.

### 6.1 Upstream: Payer Intelligence Crawling

Detailed in [Section 4.3](#43-payer-intelligence-service). The browser agent crawls payer portals to extract PA requirements, policy documents, form structures, and coverage guidelines — feeding the Payer Rules Database.

### 6.2 Downstream: PA Submission

When the Smart Router selects the web channel:

```
Case Data + Portal Form Schema
    ↓
┌──────────────────────────────────────────────────┐
│  Browser Submission Agent                         │
│                                                   │
│  1. Retrieve credentials from encrypted vault     │
│  2. Login to payer portal                         │
│  3. Navigate to "New PA Request" form             │
│  4. Fill patient demographics fields              │
│  5. Enter procedure codes (CPT, ICD-10)           │
│  6. Fill clinical information fields              │
│  7. Upload supporting documents (clinical notes,  │
│     PT records, referral letters, etc.)            │
│  8. Review auto-filled form for accuracy          │
│  9. Submit the PA request                         │
│  10. Capture confirmation number + screenshot     │
│  11. Return submission result to case state       │
└──────────────────────────────────────────────────┘
```

### 6.3 Downstream: Status Monitoring

```
Submitted Case + Portal Credentials
    ↓
┌──────────────────────────────────────────────────┐
│  Browser Status Agent                             │
│                                                   │
│  1. Login to payer portal                         │
│  2. Navigate to "Check PA Status" page            │
│  3. Search by auth number or member ID            │
│  4. Extract current status, dates, notes          │
│  5. Compare against previous check                │
│  6. If changed → update case + notify coordinator │
│  7. Screenshot for audit trail                    │
└──────────────────────────────────────────────────┘
```

### 6.4 Resilience & Adaptation

| Feature | Description |
|---------|-------------|
| **UI Change Adaptation** | AI recognizes field purpose (not just CSS selectors), adapts when portal redesigns |
| **Session Management** | Handles session timeouts, re-authentication, multi-factor auth prompts |
| **Error Recovery** | Retries on transient failures, saves partial form progress |
| **CAPTCHA Handling** | Attempts automated solving; falls back to coordinator notification if needed |
| **Credential Rotation** | Alerts when credentials are about to expire; supports multi-account load balancing |
| **Rate Limiting** | Respects portal rate limits; staggers submissions to avoid triggering anti-bot measures |

---

## 7. AI Learning Layer

The learning layer sits across all services, consuming outcomes and feeding improvements back into every component.

### 7.1 Feedback Loops

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Approvals   │    │  Denials     │    │  Appeals     │
│  (outcomes)  │    │  (reasons)   │    │  (outcomes)  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           ↓
              ┌─────────────────────────┐
              │    AI Learning Layer     │
              │                         │
              │  - Pattern Detection    │
              │  - Rules Refinement     │
              │  - Prediction Tuning    │
              │  - Strategy Optimization│
              └────────────┬────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ↓                   ↓                   ↓
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Determination│    │ Case Builder │    │ Submission  │
│ Engine Rules │    │ Predictions  │    │ Routing     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 7.2 What It Learns

| Domain | Learning Source | Improvement Target |
|--------|---------------|-------------------|
| **PA Determination** | Approval/denial outcomes per CPT+payer | More accurate "PA required?" decisions |
| **Approval Prediction** | Historical approval rates, denial reasons | Better likelihood scoring |
| **Document Requirements** | Which missing docs caused denials | More precise document checklists |
| **Clinical Narratives** | Which narratives led to approvals vs denials | Better justification letter generation |
| **Submission Routing** | Success/failure rates per channel per payer | Optimized channel selection |
| **Voice Agent** | Call durations, IVR paths, representative behavior | Faster calls, better conversation strategies |
| **Browser Agent** | Portal navigation paths, form fill success rates | More reliable web submissions |
| **Payer Behavior** | Response times, rule changes, denial patterns | Proactive risk identification |
| **Appeal Strategy** | Appeal outcomes by strategy type and payer | Higher appeal success rates |

### 7.3 Learning Mechanisms

**Pattern Detection:**
- Clusters similar cases by CPT, payer, diagnosis, and outcome
- Identifies emerging denial trends before they become widespread
- Detects payer behavior shifts (e.g., suddenly denying a previously auto-approved procedure)

**Rules Refinement:**
- Compares engine predictions against actual outcomes
- Auto-adjusts confidence scores for PA determination rules
- Flags rules that are consistently wrong for human review

**Prediction Tuning:**
- Trains approval likelihood model on expanding outcome dataset
- Adjusts factor weights based on what actually drives approvals/denials
- A/B tests narrative styles to measure impact on approval rates

**Strategy Optimization:**
- Tracks submission channel performance over time
- Adjusts fallback chain ordering based on recent success rates
- Identifies optimal submission times (day of week, time of day) per payer

---

## 8. Data Flow

### 8.1 Complete End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE PA LIFECYCLE                           │
│                                                                         │
│  ┌──────┐   EHR generates order for MRI Cervical Spine                 │
│  │ EHR  │──→ FHIR R4 ServiceRequest message                           │
│  └──────┘                                                               │
│      ↓                                                                  │
│  ┌──────────────────┐                                                   │
│  │ Order Ingestion   │  AI extracts: CPT 72141, ICD-10 M54.12,        │
│  │                   │  patient: Margaret Thompson, payer: BCBS         │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐  ┌───────────────────┐                           │
│  │ PA Determination  │←→│ Payer Intelligence │                          │
│  │                   │  │                   │                           │
│  │ Checks: BCBS PPO  │  │ Rules DB says:    │                          │
│  │ + CPT 72141       │  │ PA required = YES  │                          │
│  │ → PA REQUIRED     │  │ Docs: clinical     │                          │
│  └────────┬─────────┘  │ notes, PT records, │                          │
│           │             │ referral letter     │                          │
│           ↓             └───────────────────┘                           │
│  ┌──────────────────┐                                                   │
│  │ AI Case Builder   │  Auto-populates case:                           │
│  │                   │  - Patient data from EHR                        │
│  │                   │  - Procedure: MRI Cervical Spine                │
│  │                   │  - Docs: 2 found, 1 missing                     │
│  │                   │  - Approval likelihood: 72%                     │
│  │                   │  - Missing: PT records (flagged)                │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐  Coordinator reviews in Case Builder UI          │
│  │ Case Builder UI   │  - Verifies patient data                        │
│  │ (Frontend)        │  - Uploads missing PT records                   │
│  │                   │  - Approval likelihood → 89%                    │
│  │                   │  - Clicks "Submit Case"                         │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐  Router selects: API (primary for BCBS)          │
│  │ Submission Router │                                                  │
│  │                   │  ┌────────┐                                      │
│  │  [API] ←selected  │──│ Submit │──→ BCBS API returns: "Pended"       │
│  │  [Web] fallback   │  └────────┘                                      │
│  │  [Voice] fallback │                                                  │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐  Polls BCBS API every 4 hours                    │
│  │ Status Monitor    │                                                  │
│  │                   │  Day 1: "In Review"                              │
│  │                   │  Day 2: "In Review"                              │
│  │                   │  Day 3: "Approved" — auth #PA-2026-84291        │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐                                                   │
│  │ Case Updated      │  Status: Approved                               │
│  │                   │  Auth #: PA-2026-84291                          │
│  │                   │  Coordinator notified                           │
│  │                   │  Scheduling team notified                       │
│  └────────┬─────────┘                                                   │
│           ↓                                                             │
│  ┌──────────────────┐  Outcome feeds learning layer:                   │
│  │ Learning Layer    │  - BCBS + 72141 + M54.12 → approved             │
│  │                   │  - 3-day turnaround confirmed                   │
│  │                   │  - API channel successful                       │
│  └──────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Denial + Appeal Flow

```
Status Monitor receives: "Denied — Insufficient documentation"
    ↓
┌────────────────────────────────┐
│ AI Denial Analysis              │
│                                 │
│ Reason: "PT records do not      │
│ demonstrate 6 weeks of therapy" │
│                                 │
│ Root cause: PT records showed   │
│ only 4 weeks (2 sessions missed)│
│                                 │
│ Strategy: Written appeal with   │
│ updated PT records + physician  │
│ attestation                     │
└──────────────┬─────────────────┘
               ↓
┌────────────────────────────────┐
│ Appeal Generation               │
│                                 │
│ 1. Generate appeal letter       │
│    addressing "insufficient     │
│    documentation" specifically  │
│ 2. Request updated PT records   │
│    from Hartford PT             │
│ 3. Request physician letter     │
│    from Dr. Patel               │
│ 4. Cite ACR Appropriateness    │
│    Criteria for cervical MRI   │
│ 5. Submit via API               │
└──────────────┬─────────────────┘
               ↓
┌────────────────────────────────┐
│ Appeal Monitoring               │
│                                 │
│ Appeal submitted → tracking     │
│ If approved → case updated      │
│ If denied again → escalate to   │
│ peer-to-peer (voice agent       │
│ schedules P2P call)             │
└────────────────────────────────┘
```

---

## 9. Database Schema Overview

### Core Tables

```
cases
├── id (UUID)
├── case_number (PA-2026-XXXX)
├── status (draft | in_progress | submitted | approved | denied | appealed)
├── created_at, updated_at
├── assigned_coordinator_id
├── priority (standard | urgent | expedited)
└── source (ehr_auto | manual | template)

patients
├── id (UUID)
├── case_id (FK)
├── name, dob, mrn, phone, address
├── insurance_payer, member_id, plan_type
├── referring_physician
└── field_confidence (JSONB — per-field source, confidence %, verified flag)

procedures
├── id (UUID)
├── case_id (FK)
├── cpt_code, cpt_description, cpt_valid
├── icd10_code, icd10_description, icd10_valid
├── ordering_physician
└── clinical_justification (AI-generated narrative)

documents
├── id (UUID)
├── case_id (FK)
├── name, type, status (found | missing | recommended | na)
├── required (boolean)
├── source, source_date
├── file_path, file_size
└── extracted_data (JSONB — OCR/AI extracted content)

submissions
├── id (UUID)
├── case_id (FK)
├── channel (api | web | voice)
├── submitted_at
├── confirmation_number
├── payer_response (JSONB)
├── status (pending | accepted | rejected | error)
└── retry_count, last_retry_at

status_checks
├── id (UUID)
├── case_id (FK)
├── checked_at
├── channel (api | web | voice)
├── status_found
├── raw_response (JSONB)
└── notes

appeals
├── id (UUID)
├── case_id (FK)
├── denial_reason
├── appeal_strategy (written | peer_to_peer | external_review)
├── appeal_letter (text)
├── submitted_at, submitted_via
├── outcome (pending | approved | denied)
└── p2p_scheduled_at, p2p_physician
```

### Payer Intelligence Tables

```
payers
├── id (UUID)
├── name, code
├── api_endpoint, portal_url, phone_number
├── supported_channels (JSONB array)
├── preferred_channel
├── fallback_chain (JSONB array)
└── avg_response_times (JSONB — per channel)

payer_rules
├── id (UUID)
├── payer_id (FK)
├── cpt_code
├── plan_type (or "all")
├── pa_required (boolean)
├── required_documents (JSONB array)
├── medical_necessity_criteria (JSONB array)
├── step_therapy_requirements (JSONB array)
├── review_timeframe_days
├── policy_reference
├── source_url
├── last_crawled_at
├── confidence (0-1)
└── change_history (JSONB — tracked diffs)

payer_portal_schemas
├── id (UUID)
├── payer_id (FK)
├── form_type (pa_submission | status_check | appeal)
├── form_fields (JSONB — field name, type, selector, required)
├── navigation_steps (JSONB — click path to reach form)
├── last_verified_at
└── screenshots (JSONB array — reference screenshots)

payer_ivr_maps
├── id (UUID)
├── payer_id (FK)
├── phone_number
├── ivr_tree (JSONB — nested menu structure with DTMF/speech options)
├── pa_department_path (JSONB — fastest path to PA)
├── status_check_path (JSONB)
├── avg_hold_time_seconds
├── best_call_times (JSONB)
└── last_verified_at
```

### Voice Agent Tables

```
voice_calls
├── id (UUID)
├── case_id (FK)
├── purpose (submission | status_check | appeal | p2p_schedule)
├── payer_id (FK)
├── phone_number_dialed
├── started_at, ended_at, duration_seconds
├── ivr_path_taken (JSONB)
├── representative_name
├── outcome (approved | denied | pended | callback | failed)
├── auth_number_captured
├── recording_url
├── transcript (text)
├── ai_summary (text)
├── sentiment_scores (JSONB — per segment)
└── retry_of (FK — self-reference for retries)
```

### Learning Layer Tables

```
outcome_log
├── id (UUID)
├── case_id (FK)
├── payer_id, cpt_code, icd10_code
├── submitted_via (channel)
├── outcome (approved | denied)
├── denial_reasons (JSONB array)
├── days_to_decision
├── appeal_outcome (if applicable)
└── recorded_at

prediction_accuracy
├── id (UUID)
├── case_id (FK)
├── predicted_approval_pct
├── actual_outcome
├── factor_weights_used (JSONB)
├── model_version
└── evaluated_at

payer_behavior_log
├── id (UUID)
├── payer_id (FK)
├── metric (response_time | approval_rate | denial_rate | rule_change)
├── value
├── period (date range)
├── trend (improving | declining | stable)
└── recorded_at
```

---

## 10. Security & Compliance

### HIPAA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Data Encryption at Rest** | AES-256 encryption for all PHI in database and file storage |
| **Data Encryption in Transit** | TLS 1.3 for all API communications, portal connections, and internal services |
| **Access Controls** | Role-based access (coordinator, manager, admin); MFA required |
| **Audit Logging** | Every data access, modification, and transmission logged with user ID and timestamp |
| **Minimum Necessary** | AI agents only access data needed for the specific task |
| **BAA Coverage** | Business Associate Agreements with all third-party services (vapi, browser-use.com, cloud providers) |

### Credential Security

| Asset | Protection |
|-------|-----------|
| **Payer Portal Credentials** | Encrypted vault (HashiCorp Vault or AWS Secrets Manager); never stored in code or logs |
| **API Keys** | Rotated automatically; scoped to minimum permissions |
| **Voice Agent Credentials** | vapi session tokens with short expiry; no long-lived secrets |
| **EHR Integration Tokens** | OAuth 2.0 with SMART on FHIR; tokens refreshed automatically |

### AI-Specific Security

| Concern | Mitigation |
|---------|-----------|
| **PHI in AI Prompts** | Use on-premise or BAA-covered AI services; no PHI sent to consumer AI APIs |
| **Voice Recording Storage** | Encrypted, access-controlled, auto-deleted per retention policy |
| **Browser Agent Screenshots** | Stored encrypted, tagged with case ID, auto-purged after review period |
| **AI Decision Auditability** | Every AI decision logged with input data, model version, and reasoning |

### Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Active case data | Until case closed + 7 years |
| Voice recordings | 90 days (configurable) |
| Portal screenshots | 30 days |
| Audit logs | 7 years |
| Learning data (anonymized) | Indefinite |

---

## 11. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **TypeScript** | Type safety across the entire frontend |
| **Vite** | Fast dev server and build tool |
| **Tailwind CSS 4** | Utility-first styling with custom design tokens |
| **Motion (Framer Motion)** | Animations and transitions |
| **Recharts** | Data visualization (charts, gauges) |
| **Lucide React** | Icon system |

### Backend (Recommended)
| Technology | Purpose |
|------------|---------|
| **Node.js / Python** | Service runtime (Python preferred for AI-heavy services) |
| **FastAPI** | High-performance API framework (Python) |
| **PostgreSQL** | Primary relational database |
| **Redis** | Caching, job queues, real-time pub/sub |
| **Celery / BullMQ** | Background task processing (crawls, submissions, monitoring) |
| **Docker + Kubernetes** | Container orchestration |

### AI & ML
| Technology | Purpose |
|------------|---------|
| **Claude API (Anthropic)** | Clinical NLP, narrative generation, document analysis, conversation |
| **Custom ML Models** | Approval prediction, pattern detection, payer behavior analysis |
| **LangChain / LlamaIndex** | AI orchestration, RAG for clinical guidelines |

### Third-Party Integrations
| Service | Purpose |
|---------|---------|
| **browser-use.com** | Browser automation for portal crawling, submission, and monitoring |
| **vapi** | AI voice agent for phone-based PA submissions, status checks, and appeals |
| **EHR Systems** | FHIR R4 / HL7 integration for order ingestion and patient data |
| **Payer APIs** | X12 278, FHIR PA, proprietary APIs for direct submission |
| **HashiCorp Vault** | Secrets management for payer credentials |
| **AWS S3 / GCS** | Document and recording storage |

### Monitoring & Observability
| Technology | Purpose |
|------------|---------|
| **Datadog / Grafana** | Service metrics, dashboards, alerting |
| **Sentry** | Error tracking and exception monitoring |
| **OpenTelemetry** | Distributed tracing across services |
| **ELK Stack** | Centralized logging and search |

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **PA** | Prior Authorization — payer approval required before a medical service |
| **CPT** | Current Procedural Terminology — standardized medical procedure codes |
| **ICD-10** | International Classification of Diseases, 10th revision — diagnosis codes |
| **EHR** | Electronic Health Record — provider's clinical data system |
| **FHIR** | Fast Healthcare Interoperability Resources — modern healthcare data standard |
| **X12 278** | EDI standard for health care services review (PA request/response) |
| **P2P** | Peer-to-Peer review — phone call between ordering physician and payer medical director |
| **SLA** | Service Level Agreement — payer's committed review timeframe |
| **RFI** | Request for Information — payer asking for additional documentation |
| **IVR** | Interactive Voice Response — automated phone menu system |
| **DTMF** | Dual-Tone Multi-Frequency — touch-tone signals for phone navigation |
| **NLP** | Natural Language Processing — AI understanding of clinical text |
| **OCR** | Optical Character Recognition — extracting text from images/documents |
| **BAA** | Business Associate Agreement — HIPAA-required contract with vendors handling PHI |
