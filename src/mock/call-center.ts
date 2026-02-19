// ── Call Center Mock Data ────────────────────────────────────────────────────

export type CallStatus = "active" | "queued" | "on-hold" | "completed" | "failed";

export interface TranscriptLine {
  speaker: "agent" | "ivr";
  text: string;
  timestamp: string; // "00:12" format
}

export interface CallRecording {
  durationSecs: number;
  fileSize: string;       // "1.2 MB"
  quality: "HD" | "Standard";
  encrypted: boolean;
}

export interface PastCall {
  id: string;
  date: string;           // "Feb 19, 2026"
  time: string;           // "1:42 PM"
  payer: string;
  callType: "submission" | "status-check";
  duration: string;
  outcome: "submitted" | "approved" | "pending" | "no-answer" | "rfi-received";
  trackingId: string | null;
  recording: CallRecording;
  transcript: TranscriptLine[];
}

export interface CallQueueItem {
  id: string;
  status: CallStatus;
  payer: string;
  payerFull: string;
  payerPhone: string;
  callType: "submission" | "status-check";
  startedAt: string | null;
  duration: string | null;
  caseId: string;
  patient: { name: string; dob: string; age: number; mrn: string; phone: string };
  procedure: { name: string; cptCode: string; cptDescription: string; icd10Code: string; icd10Description: string };
  insurance: { memberId: string; planType: string };
  physician: string;
  documents: string[];
  trackingId: string | null;
  approvalLikelihood: number;
  transcript: TranscriptLine[];
  recording: CallRecording | null;
  callHistory: PastCall[];
}

export const callQueueData: CallQueueItem[] = [
  // ─── 1. ACTIVE — Posterior Lumbar Interbody Fusion (PLIF) L4-S1 — RESUBMISSION after denial ───
  {
    id: "call-001",
    status: "active",
    payer: "UHC",
    payerFull: "UnitedHealthcare",
    payerPhone: "1-800-555-0199",
    callType: "submission",
    startedAt: "2026-02-19T14:21:00Z",
    duration: "06:42",
    caseId: "PA-2026-0419",
    patient: { name: "Margaret Okonkwo", dob: "04/11/1958", age: 67, mrn: "NHC-2024-72104", phone: "(860) 555-0283" },
    procedure: { name: "Posterior Lumbar Interbody Fusion L4-S1", cptCode: "22633", cptDescription: "Lumbar Interbody Fusion, Combined Posterior", icd10Code: "M43.16", icd10Description: "Spondylolisthesis, Lumbar Region" },
    insurance: { memberId: "UHC-8847291", planType: "PPO Choice Plus" },
    physician: "Dr. Aisha Williams",
    documents: [
      "MRI Lumbar Spine (w/ Flexion-Extension)",
      "CT Myelogram",
      "12-Week PT Completion Report",
      "Failed Epidural Steroid Injections x3",
      "Neurosurgery Consultation",
      "Pain Management Records (18 months)",
      "Prior Denial Letter — UHC-DN-2026-04102",
      "Peer-to-Peer Review Request",
      "BMI & Comorbidity Assessment",
      "Pre-Operative Cardiac Clearance",
    ],
    trackingId: null,
    approvalLikelihood: 62,
    recording: null,
    transcript: [
      { speaker: "agent", text: "Submitting reauthorization for CPT 22633, posterior lumbar interbody fusion L4 through S1. This is a resubmission following denial UHC-DN-2026-04102.", timestamp: "00:05" },
      { speaker: "ivr", text: "Member ID please.", timestamp: "00:22" },
      { speaker: "agent", text: "Member ID UHC-8847291. Patient Margaret Okonkwo, date of birth April 11, 1958.", timestamp: "00:28" },
      { speaker: "ivr", text: "Member verified. I see a prior denial on file for this procedure. Is this an appeal or a new submission with additional documentation?", timestamp: "00:52" },
      { speaker: "agent", text: "New submission with additional clinical documentation. We have completed peer-to-peer review documentation, 18 months of conservative therapy records including three failed epidural steroid injections, CT myelogram confirming Grade 2 spondylolisthesis, and pre-operative cardiac clearance.", timestamp: "01:18" },
      { speaker: "ivr", text: "Understood. Please provide the primary and secondary diagnosis codes.", timestamp: "01:48" },
      { speaker: "agent", text: "Primary ICD-10 M43.16, spondylolisthesis lumbar region. Secondary M48.06, spinal stenosis lumbar region. Additional M54.17, lumbar radiculopathy bilateral. Patient also has comorbidities: E11.9 Type 2 diabetes and E66.01 morbid obesity with BMI 38.2.", timestamp: "02:22" },
      { speaker: "ivr", text: "Multiple diagnoses noted. The prior denial cited insufficient conservative therapy documentation. Can you confirm the duration and types of conservative treatment attempted?", timestamp: "03:05" },
      { speaker: "agent", text: "Confirmed. Patient completed 12 weeks of formal physical therapy with documented functional decline despite compliance. Three epidural steroid injections performed over 8 months with less than 20 percent relief. NSAID therapy for 14 months. Gabapentin titrated to maximum dose. Medial branch nerve blocks performed bilaterally with temporary relief only. All records are attached.", timestamp: "03:58" },
      { speaker: "ivr", text: "Thank you. Given the complexity and prior denial, this will require medical director review. Placing a hold to verify documentation receipt.", timestamp: "04:32" },
    ],
    callHistory: [
      {
        id: "hist-001a",
        date: "Feb 10, 2026",
        time: "2:15 PM",
        payer: "UHC",
        callType: "submission",
        duration: "08:22",
        outcome: "submitted",
        trackingId: "UHC-PA-2026-04102",
        recording: { durationSecs: 502, fileSize: "4.1 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Submitting prior authorization for CPT 22633, posterior lumbar interbody fusion L4-S1.", timestamp: "00:04" },
          { speaker: "ivr", text: "Member ID and provider NPI please.", timestamp: "00:18" },
          { speaker: "agent", text: "Member UHC-8847291. NPI 1942837651, Dr. Aisha Williams, NorthStar Neurosurgery.", timestamp: "00:24" },
          { speaker: "ivr", text: "Verified. Please provide clinical information.", timestamp: "00:42" },
          { speaker: "agent", text: "ICD-10 M43.16, spondylolisthesis. Patient has completed physical therapy and epidural injections.", timestamp: "01:05" },
          { speaker: "ivr", text: "How many weeks of physical therapy and how many injections?", timestamp: "01:32" },
          { speaker: "agent", text: "8 weeks of PT and two epidural steroid injections.", timestamp: "01:48" },
          { speaker: "ivr", text: "Request received. Reference UHC-PA-2026-04102. Note: UHC guidelines require minimum 12 weeks PT and documentation of three failed injections for spinal fusion. Decision in 10-15 business days.", timestamp: "03:15" },
          { speaker: "agent", text: "Confirmed. Thank you.", timestamp: "03:42" },
        ],
      },
      {
        id: "hist-001b",
        date: "Feb 17, 2026",
        time: "10:15 AM",
        payer: "UHC",
        callType: "status-check",
        duration: "03:48",
        outcome: "rfi-received",
        trackingId: "UHC-PA-2026-04102",
        recording: { durationSecs: 228, fileSize: "1.8 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Checking status of authorization UHC-PA-2026-04102.", timestamp: "00:03" },
          { speaker: "ivr", text: "Reference confirmed. Authorization UHC-PA-2026-04102 has been denied.", timestamp: "00:28" },
          { speaker: "agent", text: "What is the denial reason?", timestamp: "00:42" },
          { speaker: "ivr", text: "Denial code UR-1042: Insufficient conservative therapy documentation. Guidelines require minimum 12 weeks physical therapy with functional outcome measures and at least 3 epidural steroid injection attempts. Only 8 weeks PT and 2 injections were documented.", timestamp: "01:18" },
          { speaker: "agent", text: "Is a peer-to-peer review available with the medical director?", timestamp: "01:45" },
          { speaker: "ivr", text: "Yes. Peer-to-peer can be requested. The provider has 30 days to submit additional documentation or request appeal. Reference the denial letter UHC-DN-2026-04102.", timestamp: "02:22" },
          { speaker: "agent", text: "Understood. We will gather additional documentation and resubmit. Thank you.", timestamp: "02:58" },
        ],
      },
    ],
  },

  // ─── 2. ACTIVE — Proton Beam Therapy for Pediatric Medulloblastoma — Status Check on Expedited Review ───
  {
    id: "call-002",
    status: "active",
    payer: "Cigna",
    payerFull: "Cigna Healthcare",
    payerPhone: "1-800-555-0244",
    callType: "status-check",
    startedAt: "2026-02-19T14:19:00Z",
    duration: "05:18",
    caseId: "PA-2026-0387",
    patient: { name: "Ethan Nakamura", dob: "08/22/2018", age: 7, mrn: "NHC-2024-65891", phone: "(860) 555-0412" },
    procedure: { name: "Proton Beam Radiation Therapy — Craniospinal", cptCode: "77523", cptDescription: "Proton Beam Treatment, Complex", icd10Code: "C71.6", icd10Description: "Malignant Neoplasm of Cerebellum" },
    insurance: { memberId: "CGN-6632105", planType: "HMO Select" },
    physician: "Dr. Rajesh Gupta",
    documents: [
      "Pathology Report — Medulloblastoma WHO Grade IV",
      "Post-Surgical MRI Brain & Spine",
      "Pediatric Oncology Treatment Plan",
      "Radiation Oncology Consultation",
      "Proton vs Photon Comparison — Neurocognitive Risk Assessment",
      "Out-of-Network Provider Justification (MD Anderson)",
      "Expedited Review Request — Urgent Medical Necessity",
      "Neuropsychology Baseline Assessment",
    ],
    trackingId: "CGN-PA-2026-91847",
    approvalLikelihood: 78,
    recording: null,
    transcript: [
      { speaker: "agent", text: "Checking status of expedited prior authorization CGN-PA-2026-91847 for proton beam radiation therapy, craniospinal irradiation. This was submitted as urgent medical necessity for a 7-year-old medulloblastoma patient.", timestamp: "00:06" },
      { speaker: "ivr", text: "Reference confirmed. Please hold while I retrieve the case. This authorization is flagged as expedited review.", timestamp: "00:28" },
      { speaker: "ivr", text: "Authorization CGN-PA-2026-91847 is currently under medical director review. An out-of-network exception request is also pending for MD Anderson Cancer Center.", timestamp: "01:42" },
      { speaker: "agent", text: "This patient is 7 years old with WHO Grade IV medulloblastoma status post posterior fossa craniotomy. Proton therapy is specifically indicated to minimize neurocognitive late effects and growth plate damage in pediatric patients. The treating oncologist has documented that conventional photon radiation would result in significantly higher integral dose to the developing brain. Can you confirm the timeline for the medical director decision?", timestamp: "02:35" },
      { speaker: "ivr", text: "Expedited reviews for oncology cases are processed within 72 hours per Cigna policy. The case was submitted February 17th. A decision should be rendered by end of day February 20th. However, the out-of-network component may require additional review.", timestamp: "03:18" },
      { speaker: "agent", text: "The out-of-network justification is based on the fact that no in-network proton therapy center in Connecticut offers craniospinal irradiation for pediatric patients. The nearest in-network facility is over 400 miles away. Can this be expedited as a concurrent review?", timestamp: "04:02" },
      { speaker: "ivr", text: "I am noting that on the case. The medical director may approve the out-of-network exception as part of the same review. Is there a peer-to-peer contact if the medical director has questions?", timestamp: "04:38" },
      { speaker: "agent", text: "Yes. Dr. Rajesh Gupta, pediatric radiation oncology, is available for peer-to-peer at 860-555-7700 extension 4412. He is available between 8 AM and 5 PM Eastern.", timestamp: "05:02" },
    ],
    callHistory: [
      {
        id: "hist-002a",
        date: "Feb 17, 2026",
        time: "9:30 AM",
        payer: "Cigna",
        callType: "submission",
        duration: "11:24",
        outcome: "submitted",
        trackingId: "CGN-PA-2026-91847",
        recording: { durationSecs: 684, fileSize: "5.5 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Submitting urgent prior authorization for CPT 77523, proton beam radiation therapy craniospinal. Requesting expedited review for a pediatric oncology case.", timestamp: "00:05" },
          { speaker: "ivr", text: "Member ID and patient date of birth.", timestamp: "00:20" },
          { speaker: "agent", text: "Member CGN-6632105. Patient Ethan Nakamura, date of birth August 22, 2018. Age 7.", timestamp: "00:28" },
          { speaker: "ivr", text: "Verified. This is a minor patient. Proceeding with clinical review intake. What is the primary diagnosis?", timestamp: "00:52" },
          { speaker: "agent", text: "ICD-10 C71.6, malignant neoplasm of cerebellum. Histology confirmed medulloblastoma WHO Grade IV. Patient is status post posterior fossa craniotomy on January 28, 2026.", timestamp: "01:22" },
          { speaker: "ivr", text: "This is being flagged as a complex oncology case. Is the radiation facility in-network?", timestamp: "01:55" },
          { speaker: "agent", text: "No. We are requesting an out-of-network exception for MD Anderson Cancer Center proton therapy. There is no in-network pediatric craniospinal proton center within 200 miles.", timestamp: "02:18" },
          { speaker: "ivr", text: "Out-of-network exception noted. Please provide the treating physician NPI and facility information.", timestamp: "02:48" },
          { speaker: "agent", text: "Treating physician Dr. Rajesh Gupta, NPI 1538294706. Facility MD Anderson Proton Center, NPI 1649305817.", timestamp: "03:10" },
          { speaker: "ivr", text: "Request submitted. Reference CGN-PA-2026-91847. Flagged for expedited 72-hour review given oncology urgency. You will receive notification via fax.", timestamp: "04:42" },
          { speaker: "agent", text: "Please confirm the fax number on file.", timestamp: "05:02" },
          { speaker: "ivr", text: "Fax on file is 860-555-7701. Is that correct?", timestamp: "05:15" },
          { speaker: "agent", text: "Confirmed. Thank you.", timestamp: "05:22" },
        ],
      },
    ],
  },

  // ─── 3. QUEUED — Biologic Switch (Humira → Rinvoq) after Step Therapy Failure — Aetna ───
  {
    id: "call-003",
    status: "queued",
    payer: "Aetna",
    payerFull: "Aetna",
    payerPhone: "1-800-555-0177",
    callType: "submission",
    startedAt: null,
    duration: null,
    caseId: "PA-2026-0421",
    patient: { name: "Deborah Vasquez-Kim", dob: "06/15/1971", age: 54, mrn: "NHC-2024-80233", phone: "(860) 555-0558" },
    procedure: { name: "Rinvoq (Upadacitinib) 15mg Daily — JAK Inhibitor", cptCode: "J3490", cptDescription: "Unclassified Drug — Upadacitinib", icd10Code: "M05.79", icd10Description: "Rheumatoid Arthritis w/ Rheumatoid Factor, Multiple Sites" },
    insurance: { memberId: "AET-441927830", planType: "PPO Open Access Plus" },
    physician: "Dr. Patricia Osei",
    documents: [
      "Rheumatology Treatment History (4 years)",
      "Failed Methotrexate Trial (24 weeks) — Lab Toxicity",
      "Failed Humira Trial (32 weeks) — Secondary Loss of Efficacy",
      "Failed Enbrel Trial (16 weeks) — Primary Non-Response",
      "DAS28-CRP Score Documentation (5.8 — High Activity)",
      "TB Screening & Hepatitis Panel",
      "Cardiovascular Risk Assessment (JAK Inhibitor Requirement)",
      "Step Therapy Exception Request",
      "Joint Erosion X-Ray Series",
    ],
    trackingId: null,
    approvalLikelihood: 71,
    recording: null,
    transcript: [],
    callHistory: [
      {
        id: "hist-003a",
        date: "Feb 14, 2026",
        time: "11:45 AM",
        payer: "Aetna",
        callType: "submission",
        duration: "06:15",
        outcome: "rfi-received",
        trackingId: "AET-PA-2026-55291",
        recording: { durationSecs: 375, fileSize: "3.0 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Submitting prior authorization for Rinvoq 15mg daily, J3490, for rheumatoid arthritis.", timestamp: "00:04" },
          { speaker: "ivr", text: "Member ID and prescribing physician.", timestamp: "00:18" },
          { speaker: "agent", text: "Member AET-441927830. Dr. Patricia Osei, NPI 1847293056.", timestamp: "00:25" },
          { speaker: "ivr", text: "Aetna formulary requires step therapy documentation for JAK inhibitors. Has the patient failed at least two biologic DMARDs?", timestamp: "00:52" },
          { speaker: "agent", text: "Yes. Patient failed methotrexate due to hepatotoxicity, Humira due to secondary loss of efficacy at 32 weeks, and Enbrel due to primary non-response at 16 weeks.", timestamp: "01:18" },
          { speaker: "ivr", text: "Request submitted. Reference AET-PA-2026-55291. However, an RFI has been generated. Aetna requires the cardiovascular risk assessment and TB screening results before proceeding with JAK inhibitor review.", timestamp: "02:45" },
          { speaker: "agent", text: "Understood. We will submit the additional documentation. What is the fax number for clinical records?", timestamp: "03:10" },
          { speaker: "ivr", text: "Fax additional records to 1-800-555-0178 with reference AET-PA-2026-55291.", timestamp: "03:28" },
        ],
      },
    ],
  },

  // ─── 4. QUEUED — Robotic-Assisted Partial Nephrectomy — Complex Renal Mass with Cardiac Comorbidity ───
  {
    id: "call-004",
    status: "queued",
    payer: "UHC",
    payerFull: "UnitedHealthcare",
    payerPhone: "1-800-555-0199",
    callType: "submission",
    startedAt: null,
    duration: null,
    caseId: "PA-2026-0422",
    patient: { name: "Harold Okonkwo", dob: "01/29/1953", age: 73, mrn: "NHC-2024-59174", phone: "(860) 555-0671" },
    procedure: { name: "Robotic-Assisted Laparoscopic Partial Nephrectomy", cptCode: "50543", cptDescription: "Laparoscopic Partial Nephrectomy", icd10Code: "C64.1", icd10Description: "Malignant Neoplasm of Right Kidney" },
    insurance: { memberId: "UHC-7729384", planType: "Medicare Advantage PPO" },
    physician: "Dr. Kenji Nakamura",
    documents: [
      "CT Abdomen w/ Renal Protocol — 4.2cm Enhancing Mass",
      "Renal Mass Biopsy — Clear Cell RCC, Fuhrman Grade 2",
      "RENAL Nephrometry Score: 8 (Moderate Complexity)",
      "Pre-Op Cardiac Clearance — Stress Echo",
      "Pulmonology Clearance — Moderate COPD",
      "Anesthesia Risk Assessment (ASA Class III)",
      "Urology Surgical Plan",
      "Multidisciplinary Tumor Board Recommendation",
      "eGFR & Split Renal Function Study",
      "Anticoagulation Bridge Plan (Warfarin → Heparin)",
    ],
    trackingId: null,
    approvalLikelihood: 82,
    recording: null,
    transcript: [],
    callHistory: [],
  },

  // ─── 5. COMPLETED — TAVR (Transcatheter Aortic Valve Replacement) — Approved after Extended Review ───
  {
    id: "call-005",
    status: "completed",
    payer: "Aetna",
    payerFull: "Aetna",
    payerPhone: "1-800-555-0177",
    callType: "status-check",
    startedAt: "2026-02-19T13:42:00Z",
    duration: "07:35",
    caseId: "PA-2026-0398",
    patient: { name: "Evelyn Thornton-Park", dob: "12/03/1944", age: 81, mrn: "NHC-2024-88421", phone: "(860) 555-0147" },
    procedure: { name: "Transcatheter Aortic Valve Replacement (TAVR)", cptCode: "33361", cptDescription: "TAVR w/ Transfemoral Approach", icd10Code: "I35.0", icd10Description: "Nonrheumatic Aortic Valve Stenosis" },
    insurance: { memberId: "AET-882104376", planType: "Medicare Advantage HMO" },
    physician: "Dr. Benjamin Adebayo",
    documents: [
      "Transthoracic Echocardiogram — Severe AS (AVA 0.7 cm²)",
      "CT Aortography w/ Femoral Access Assessment",
      "STS Risk Score: 8.2% (High Risk for SAVR)",
      "Heart Team Conference Documentation",
      "Cardiac Catheterization Report",
      "Frailty Assessment (5-Meter Walk Test)",
      "Geriatric Consultation",
      "Anesthesia Evaluation — ASA Class IV",
      "Dental Clearance (Endocarditis Prevention)",
      "Patient/Family Shared Decision-Making Documentation",
    ],
    trackingId: "AET-PA-2026-33108",
    approvalLikelihood: 93,
    recording: { durationSecs: 455, fileSize: "3.7 MB", quality: "HD", encrypted: true },
    transcript: [
      { speaker: "agent", text: "Checking status of prior authorization AET-PA-2026-33108 for TAVR, transcatheter aortic valve replacement, transfemoral approach.", timestamp: "00:06" },
      { speaker: "ivr", text: "Reference confirmed. One moment while I pull up the case details.", timestamp: "00:22" },
      { speaker: "ivr", text: "Authorization AET-PA-2026-33108 has been approved effective today, February 19, 2026.", timestamp: "01:18" },
      { speaker: "agent", text: "Can you confirm the approval details including approved facility, authorized CPT codes, and validity period?", timestamp: "01:38" },
      { speaker: "ivr", text: "Approved: CPT 33361 TAVR transfemoral approach. Approved for NorthStar Medical Center Cardiac Cath Lab. Valid from February 19 through May 19, 2026. Includes inpatient stay up to 5 days. Fluoroscopy and TEE guidance included.", timestamp: "02:22" },
      { speaker: "agent", text: "Is the prosthetic valve included in the authorization or does it require a separate device authorization?", timestamp: "02:48" },
      { speaker: "ivr", text: "The Edwards SAPIEN 3 valve is included under the procedure authorization. No separate device PA required. However, if the valve model changes, a modification request will be needed.", timestamp: "03:20" },
      { speaker: "agent", text: "Understood. Was there a specific condition or note attached to the approval?", timestamp: "03:42" },
      { speaker: "ivr", text: "Yes. The approval notes state: Heart Team documentation must be present in the medical record at time of procedure. The STS score of 8.2 percent meets the high-risk threshold. Aetna approved based on the Heart Team recommendation and documented shared decision-making.", timestamp: "04:28" },
      { speaker: "agent", text: "One more question. The patient is on warfarin for atrial fibrillation. Is the anticoagulation bridge protocol included in the inpatient authorization?", timestamp: "04:55" },
      { speaker: "ivr", text: "The inpatient stay authorization covers standard periprocedural care including anticoagulation management. No separate auth needed for heparin bridge.", timestamp: "05:22" },
      { speaker: "agent", text: "Excellent. Please confirm the authorization number one more time for our records.", timestamp: "05:42" },
      { speaker: "ivr", text: "Authorization AET-PA-2026-33108 approved. Shall I fax the determination letter?", timestamp: "05:58" },
      { speaker: "agent", text: "Yes please, fax to 860-555-7701. Thank you.", timestamp: "06:12" },
    ],
    callHistory: [
      {
        id: "hist-005a",
        date: "Feb 5, 2026",
        time: "10:30 AM",
        payer: "Aetna",
        callType: "submission",
        duration: "12:18",
        outcome: "submitted",
        trackingId: "AET-PA-2026-33108",
        recording: { durationSecs: 738, fileSize: "6.0 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Submitting prior authorization for CPT 33361, TAVR transfemoral. This is a complex cardiac procedure requiring inpatient authorization.", timestamp: "00:05" },
          { speaker: "ivr", text: "Member ID, provider NPI, and facility.", timestamp: "00:20" },
          { speaker: "agent", text: "Member AET-882104376. Performing physician Dr. Benjamin Adebayo NPI 1740295836. NorthStar Medical Center NPI 1538294706.", timestamp: "00:32" },
          { speaker: "ivr", text: "Verified. Evelyn Thornton-Park, age 81. This is a Medicare Advantage plan. TAVR requires Heart Team documentation per CMS guidelines. Do you have the Heart Team conference note?", timestamp: "01:08" },
          { speaker: "agent", text: "Yes. Heart Team conference completed January 30, 2026 with interventional cardiology, cardiac surgery, cardiac anesthesia, and geriatrics present. Consensus recommendation for transfemoral TAVR due to STS predicted mortality of 8.2 percent making the patient high-risk for surgical valve replacement.", timestamp: "01:52" },
          { speaker: "ivr", text: "STS score confirmed at high-risk threshold. What is the echocardiographic aortic valve area?", timestamp: "02:18" },
          { speaker: "agent", text: "AVA 0.7 square centimeters with mean gradient 48 mmHg. This meets criteria for severe aortic stenosis. Patient is symptomatic with NYHA Class III heart failure and exertional syncope.", timestamp: "02:48" },
          { speaker: "ivr", text: "Request received. Reference AET-PA-2026-33108. This will be reviewed by the cardiovascular medical director. Expected decision in 10-15 business days given complexity.", timestamp: "04:20" },
          { speaker: "agent", text: "Confirmed. Thank you.", timestamp: "04:38" },
        ],
      },
      {
        id: "hist-005b",
        date: "Feb 12, 2026",
        time: "2:10 PM",
        payer: "Aetna",
        callType: "status-check",
        duration: "04:42",
        outcome: "pending",
        trackingId: "AET-PA-2026-33108",
        recording: { durationSecs: 282, fileSize: "2.3 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Checking status of TAVR authorization AET-PA-2026-33108.", timestamp: "00:03" },
          { speaker: "ivr", text: "Reference confirmed. Authorization is still under medical director review.", timestamp: "00:28" },
          { speaker: "agent", text: "This was submitted February 5th. The patient's surgical date is tentatively scheduled for February 26th. Can you expedite the review?", timestamp: "00:52" },
          { speaker: "ivr", text: "I am noting the urgency. The cardiovascular medical director requested additional information regarding the CT aortography and femoral access measurements. An RFI was sent to the provider on February 10th.", timestamp: "01:28" },
          { speaker: "agent", text: "We responded to that RFI on February 11th via fax. Can you confirm receipt?", timestamp: "01:52" },
          { speaker: "ivr", text: "Let me check. Yes, fax received February 11th, 14 pages. It has been attached to the case file. The medical director should have a decision within 3-5 business days.", timestamp: "02:28" },
          { speaker: "agent", text: "Thank you. We will check back.", timestamp: "02:48" },
        ],
      },
    ],
  },

  // ─── 6. COMPLETED — Intrathecal Baclofen Pump Implant — Multiple Sclerosis with Severe Spasticity ───
  {
    id: "call-006",
    status: "completed",
    payer: "UHC",
    payerFull: "UnitedHealthcare",
    payerPhone: "1-800-555-0199",
    callType: "submission",
    startedAt: "2026-02-19T13:05:00Z",
    duration: "09:12",
    caseId: "PA-2026-0391",
    patient: { name: "Catherine Moreau-Williams", dob: "03/18/1976", age: 49, mrn: "NHC-2024-61042", phone: "(860) 555-0893" },
    procedure: { name: "Intrathecal Baclofen Pump Implantation", cptCode: "62362", cptDescription: "Implantation of Intrathecal Drug Infusion Pump", icd10Code: "G35", icd10Description: "Multiple Sclerosis" },
    insurance: { memberId: "UHC-5518290", planType: "EPO Standard" },
    physician: "Dr. Yuki Tanaka",
    documents: [
      "MS Diagnosis & Treatment History (12 years)",
      "Modified Ashworth Scale — Grade 4 Bilateral LE",
      "Failed Oral Baclofen Trial (Max Dose — Sedation)",
      "Failed Tizanidine Trial (Hepatotoxicity)",
      "Failed Dantrolene Trial (Insufficient Response)",
      "Intrathecal Baclofen Trial Results — 65% Spasticity Reduction",
      "Physical Medicine & Rehab Evaluation",
      "Neurosurgery Consultation for Pump Placement",
      "Neuropsychology Assessment — Cognitive Baseline",
      "Home Safety & Caregiver Assessment",
      "MRI Thoracic Spine — Pump Placement Planning",
    ],
    trackingId: "UHC-PA-2026-91205",
    approvalLikelihood: 76,
    recording: { durationSecs: 552, fileSize: "4.5 MB", quality: "HD", encrypted: true },
    transcript: [
      { speaker: "agent", text: "Submitting prior authorization for CPT 62362, intrathecal baclofen pump implantation. Patient has multiple sclerosis with severe refractory spasticity.", timestamp: "00:06" },
      { speaker: "ivr", text: "Member ID and provider information.", timestamp: "00:22" },
      { speaker: "agent", text: "Member UHC-5518290. Patient Catherine Moreau-Williams. Treating physician Dr. Yuki Tanaka, NPI 1649382057, neurosurgery. Referring physician Dr. Elena Kowalski, NPI 1538472906, neurology.", timestamp: "00:42" },
      { speaker: "ivr", text: "Verified. Intrathecal pump implantation requires documentation of a successful intrathecal baclofen trial. Was a trial performed?", timestamp: "01:12" },
      { speaker: "agent", text: "Yes. Intrathecal baclofen trial was performed on January 15, 2026, under fluoroscopic guidance. 50 microgram bolus administered. Patient demonstrated 65 percent reduction in Modified Ashworth Scale from Grade 4 to Grade 1 in bilateral lower extremities. Duration of effect was 8 hours. No adverse events.", timestamp: "01:55" },
      { speaker: "ivr", text: "Trial results noted. What oral medications were tried prior to the intrathecal trial?", timestamp: "02:18" },
      { speaker: "agent", text: "Three oral antispasmodics failed. First, oral baclofen titrated to maximum 80mg daily — discontinued due to excessive sedation and cognitive impairment interfering with the patient's occupation. Second, tizanidine 24mg daily — discontinued due to elevated liver enzymes, ALT 3 times upper limit of normal. Third, dantrolene 100mg QID — insufficient spasticity reduction with only 15 percent improvement on Ashworth Scale.", timestamp: "03:15" },
      { speaker: "ivr", text: "Three failed oral agents documented. UHC guidelines also require documentation that spasticity significantly impairs function. Can you describe the functional impact?", timestamp: "03:48" },
      { speaker: "agent", text: "Patient has been wheelchair-dependent for 2 years due to spasticity. Severe lower extremity adductor spasms prevent perineal hygiene and catheter care. Nocturnal spasms cause recurrent sleep disruption. Spasticity has caused skin breakdown on bilateral medial thighs from scissoring. Physical therapy cannot be performed effectively due to muscle rigidity.", timestamp: "04:32" },
      { speaker: "ivr", text: "Functional documentation is comprehensive. I also need to confirm the pump model and whether this includes the catheter.", timestamp: "05:02" },
      { speaker: "agent", text: "Medtronic SynchroMed II pump. CPT 62362 includes the pump and intrathecal catheter placement. We are also requesting authorization for the initial programming visit, CPT 62368, and the first refill visit, CPT 62370, within the 90-day global period.", timestamp: "05:38" },
      { speaker: "ivr", text: "Multiple CPT codes noted. 62362 for implantation, 62368 for programming, 62370 for refill. This case will require medical director review due to the device implantation. Please hold while I complete the intake.", timestamp: "06:18" },
      { speaker: "ivr", text: "Request submitted. Reference UHC-PA-2026-91205. Expected review period is 15 business days. If the medical director requires a peer-to-peer, who should we contact?", timestamp: "07:42" },
      { speaker: "agent", text: "Dr. Yuki Tanaka for surgical questions and Dr. Elena Kowalski for neurology questions. Both are available at 860-555-7700.", timestamp: "08:12" },
      { speaker: "ivr", text: "Noted. Is there anything else?", timestamp: "08:28" },
      { speaker: "agent", text: "No. Thank you.", timestamp: "08:32" },
    ],
    callHistory: [
      {
        id: "hist-006a",
        date: "Feb 18, 2026",
        time: "9:45 AM",
        payer: "UHC",
        callType: "submission",
        duration: "02:10",
        outcome: "no-answer",
        trackingId: null,
        recording: { durationSecs: 130, fileSize: "1.0 MB", quality: "HD", encrypted: true },
        transcript: [
          { speaker: "agent", text: "Calling UHC PA line for intrathecal baclofen pump submission.", timestamp: "00:03" },
          { speaker: "ivr", text: "Welcome to UnitedHealthcare prior authorization. We are experiencing higher than normal call volume.", timestamp: "00:15" },
          { speaker: "ivr", text: "Estimated wait time is 22 minutes. Please continue to hold or call back later.", timestamp: "00:48" },
          { speaker: "agent", text: "Disconnecting after extended hold. Will retry.", timestamp: "02:05" },
        ],
      },
    ],
  },
];
