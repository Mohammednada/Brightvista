import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle, FileText, Shield, Terminal, MessageSquare,
  Send, Zap, Clock, Bell, Phone, Globe,
} from "lucide-react";
import { TypeWriter } from "../chat-components";
import { SYSTEM_THEMES } from "./themes";
import { MinimalHeader } from "./chrome";
import { AbstractProcessingLayout, PhoneSmsLayout, PhoneCallLayout } from "./layouts";
import { AgentCursor, SystemTransitionScreen } from "./shared";
import { AnimatedFields, AnimatedList, ActivitySteps, FormAutoFill, TerminalOutput, getFormFillSpeed } from "./primitives";

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 1: Scan EHR Orders
// ═══════════════════════════════════════════════════════════════════════════════

function ScanOrdersScreen({ screenIndex }: { screenIndex: number }) {
  const theme = SYSTEM_THEMES["epic-ehr"];

  if (screenIndex === 0) {
    return <SystemTransitionScreen toSystem="epic-ehr" />;
  }
  if (screenIndex === 1) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center gap-3" style={{ backgroundColor: theme.contentBg }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M12 2A10 10 0 0 1 22 12" stroke="#1a365d" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <span className="text-[12px] text-[#1a365d] font-medium">Navigating to Orders...</span>
        </div>
      </div>
    );
  }
  if (screenIndex === 2) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden p-3" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[11px] text-[#1a365d] font-semibold block mb-2">Pending Orders</span>
          <AnimatedList
            items={[
              { text: "Margaret Thompson \u2014 MRI Cervical Spine", detail: "CPT 72141" },
              { text: "James Rodriguez \u2014 CT Abdomen/Pelvis", detail: "CPT 74178" },
              { text: "Linda Nakamura \u2014 Epidural Injection", detail: "CPT 62323" },
              { text: "Robert Chen \u2014 Knee Arthroscopy", detail: "CPT 29881" },
            ]}
            delayStart={400}
          />
        </div>
      </div>
    );
  }
  // Screen 3: Filtered results
  return (
    <div className="flex flex-col h-[280px]">
      <MinimalHeader systemType="epic-ehr" />
      <div className="flex-1 overflow-hidden p-3 flex flex-col" style={{ backgroundColor: theme.contentBg }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-[#1a365d] font-semibold">PA-Eligible Orders</span>
          <span className="text-[8px] text-[#1F425F] font-medium">4 PA-eligible orders</span>
        </div>
        <AnimatedList
          items={[
            { text: "Margaret Thompson \u2014 MRI Cervical Spine" },
            { text: "James Rodriguez \u2014 CT Abdomen/Pelvis" },
            { text: "Linda Nakamura \u2014 Epidural Injection" },
            { text: "Robert Chen \u2014 Knee Arthroscopy" },
          ]}
          delayStart={200}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 3: Patient Details
// ═══════════════════════════════════════════════════════════════════════════════

function PatientDetailsScreen({ screenIndex }: { screenIndex: number }) {
  const theme = SYSTEM_THEMES["epic-ehr"];

  // Screen 0: Centered patient name + loading spinner
  if (screenIndex === 0) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center gap-3" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[16px] text-[#1a365d] font-semibold">Margaret Thompson</span>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M12 2A10 10 0 0 1 22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>
    );
  }
  // Screen 1: Demographics
  if (screenIndex === 1) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden p-4" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[10px] text-[#8b95a5] block mb-3">Demographics</span>
          <AnimatedFields
            fields={[
              { label: "Full Name", value: "Margaret Thompson" },
              { label: "Date of Birth", value: "03/15/1958 (Age 67)" },
              { label: "MRN", value: "NHC-2024-88421" },
              { label: "Phone", value: "(860) 555-0147" },
              { label: "Address", value: "1247 Maple Drive, Hartford, CT" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  // Screen 2: Insurance
  if (screenIndex === 2) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden p-4" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[10px] text-[#8b95a5] block mb-3">Insurance</span>
          <AnimatedFields
            fields={[
              { label: "Insurance Payer", value: "BlueCross BlueShield" },
              { label: "Member ID", value: "BCB-447821953" },
              { label: "Plan Type", value: "PPO Gold" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  // Screen 3: PA History
  if (screenIndex === 3) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden p-4" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[10px] text-[#8b95a5] block mb-3">Prior Authorization History</span>
          <div className="flex flex-col gap-2">
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-baseline justify-between">
              <span className="text-[10px] text-[#1a2a3d]">PA-2025-0892 \u2014 CT Scan</span>
              <span className="text-[8px] text-[#8b95a5]">Sep 2025 \u2022 Completed</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex items-baseline justify-between">
              <span className="text-[10px] text-[#1a2a3d]">PA-2025-1204 \u2014 Physical Therapy</span>
              <span className="text-[8px] text-[#8b95a5]">Dec 2025 \u2022 Active</span>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  // Screen 4: Complete
  return (
    <div className="flex flex-col h-[280px]">
      <MinimalHeader systemType="epic-ehr" />
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center gap-2" style={{ backgroundColor: theme.contentBg }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5 }}>
          <CheckCircle size={28} className="text-[#1F425F]" />
        </motion.div>
        <span className="text-[13px] text-[#1F425F] font-semibold">8 fields extracted</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 4: Payer Rules
// ═══════════════════════════════════════════════════════════════════════════════

function PayerRulesScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="epic-ehr" toSystem="pa-engine" summaryText="Patient data extracted: 8 fields verified from EHR" />;
  }
  // Screen 1: Agent reading policy documents — progressive activity
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="pa-engine">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Reading Policy Documents</span>
          <ActivitySteps
            steps={[
              { label: "Searching BCBS policy database", detail: "BCBS PPO Gold + CPT 72141" },
              { label: "Reading coverage guidelines", detail: "Imaging \u2014 MRI authorization rules" },
              { label: "Extracting PA requirements", detail: "InterQual / MCG clinical criteria" },
              { label: "Policy matched", detail: "MRI Cervical Spine \u2014 Prior Auth Required" },
            ]}
            delayPerStep={1800}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 2: Criteria found from documents
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="pa-engine">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Clinical Criteria Gathered</span>
          <AnimatedList
            items={[
              { text: "Conservative therapy \u2265 6 weeks documented" },
              { text: "Clinical exam with neurological findings" },
              { text: "Specialist referral on file" },
              { text: "Medication trial documented" },
              { text: "Functional limitations described" },
            ]}
            delayStart={500}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 3: Requirements summary
  if (screenIndex === 3) {
    return (
      <AbstractProcessingLayout systemType="pa-engine">
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={28} className="text-[#1F425F]" />
          </motion.div>
          <span className="text-[13px] text-[#1F425F] font-semibold">5 Requirements Identified</span>
          <span className="text-[9px] text-[#8b95a5]">Clinical criteria loaded for form validation</span>
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 4: Formatting + saving to knowledge base
  return (
    <AbstractProcessingLayout systemType="pa-engine">
      <div className="p-4 h-full overflow-hidden">
        <span className="text-[10px] text-[#8b95a5] block mb-3">Formatting &amp; Saving Policy</span>
        <ActivitySteps
          steps={[
            { label: "Analyzing rule pattern", detail: "BCBS PPO Gold \u2192 MRI Cervical Spine" },
            { label: "Formatting criteria template", detail: "5 InterQual requirements \u2192 structured format" },
            { label: "Saved to knowledge base", detail: "Future BCBS + MRI PAs will auto-apply" },
          ]}
          delayPerStep={2000}
          doneMessage="Next BCBS MRI PA will skip rules lookup \u2014 saved ~10s"
        />
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 6: Submission Channel
// ═══════════════════════════════════════════════════════════════════════════════

function ChannelScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="epic-ehr" toSystem="bcbs-availity" summaryText="4/4 required documents located in EHR" />;
  }
  // Screen 1: Channel comparison list
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="bcbs-availity">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Submission Channel Comparison</span>
          <AnimatedList
            items={[
              { text: "X12 278 API", detail: "99.2% \u2022 24-48 hrs" },
              { text: "Voice/Phone", detail: "94.1% \u2022 5-7 days" },
              { text: "Web Portal", detail: "97.8% \u2022 3-5 days" },
            ]}
            delayStart={300}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 2: Selected channel
  return (
    <AbstractProcessingLayout systemType="bcbs-availity">
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#1F425F]" />
          <span className="text-[14px] text-[#1F425F] font-bold">X12 278 API</span>
          <span className="text-[7px] bg-[#1F425F] text-white px-1.5 py-0.5 rounded-full font-medium">Fastest</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] text-[#8b95a5]">
          <span>99.2% success</span>
          <span>24-48 hrs</span>
          <span>X12 278 format</span>
        </div>
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 7: Document Checklist
// ═══════════════════════════════════════════════════════════════════════════════

function ChecklistScreen({ screenIndex }: { screenIndex: number }) {
  const docs = [
    { name: "Conservative Therapy Records", required: true },
    { name: "Specialist Referral Letter", required: true },
    { name: "Physical Exam Notes", required: true },
    { name: "Medication History", required: true },
    { name: "Clinical Justification", required: true },
    { name: "Previous Imaging Results", required: false },
  ];

  return (
    <AbstractProcessingLayout systemType="pa-engine">
      <div className="p-4 h-full overflow-hidden">
        <span className="text-[10px] text-[#8b95a5] block mb-3">Required Documents</span>
        <AnimatedList
          items={docs.map(d => ({
            text: d.name,
            detail: d.required ? "Required" : "Recommended",
          }))}
          delayStart={400}
        />
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 8: Fetch Documents
// ═══════════════════════════════════════════════════════════════════════════════

function FetchDocsScreen({ screenIndex }: { screenIndex: number }) {
  const theme = SYSTEM_THEMES["epic-ehr"];

  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="pa-engine" toSystem="epic-ehr" summaryText="Document checklist ready: 5 required + 1 recommended" />;
  }
  // Screen 1: Locating documents — ActivitySteps
  if (screenIndex === 1) {
    return (
      <div className="flex flex-col h-[280px]">
        <MinimalHeader systemType="epic-ehr" />
        <div className="flex-1 overflow-hidden p-4" style={{ backgroundColor: theme.contentBg }}>
          <span className="text-[10px] text-[#8b95a5] block mb-3">Locating Clinical Documents</span>
          <ActivitySteps
            steps={[
              { label: "Conservative Therapy Records", detail: "EMR \u2014 8 weeks PT documented" },
              { label: "Specialist Referral Letter", detail: "Dr. Patel \u2014 Feb 10, 2026" },
              { label: "Physical Exam Notes", detail: "EMR \u2014 Feb 12, 2026" },
              { label: "Medication History", detail: "NSAIDs + muscle relaxants trial" },
            ]}
            delayPerStep={2500}
          />
        </div>
      </div>
    );
  }
  // Screen 2: All found
  return (
    <div className="flex flex-col h-[280px]">
      <MinimalHeader systemType="epic-ehr" />
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center gap-2" style={{ backgroundColor: theme.contentBg }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={28} className="text-[#1F425F]" />
        </motion.div>
        <span className="text-[13px] text-[#1F425F] font-semibold">All Documents Located</span>
        <span className="text-[9px] text-[#8b95a5]">4/4 required documents found in EHR</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 9: Fill PA Form
// ═══════════════════════════════════════════════════════════════════════════════

function FillFormScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="bcbs-availity" toSystem="northstar-pa" summaryText="Submission channel: X12 278 API selected (99.2% success)" />;
  }
  // Screen 1: Patient fields
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="northstar-pa">
        <div className="h-full overflow-y-auto">
          <FormAutoFill
            fields={[
              { label: "Patient Name", value: "Margaret Thompson" },
              { label: "Date of Birth", value: "03/15/1958" },
              { label: "Member ID", value: "BCB-447821953" },
              { label: "Phone", value: "(860) 555-0147" },
            ]}
            delayStart={200}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 2: Clinical fields
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="northstar-pa">
        <div className="h-full overflow-y-auto">
          <FormAutoFill
            fields={[
              { label: "CPT Code", value: "72141 \u2014 MRI Cervical Spine w/o Contrast" },
              { label: "ICD-10 Code", value: "M54.12 \u2014 Cervical Radiculopathy" },
              { label: "Ordering Physician", value: "Dr. Sarah Patel" },
            ]}
            delayStart={200}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 3: Documents + justification
  if (screenIndex === 3) {
    const docs = [
      "Conservative Therapy Records",
      "Specialist Referral Letter",
      "Physical Exam Notes",
      "Medication History",
    ];
    const [attached, setAttached] = useState<number[]>([]);
    useEffect(() => {
      const timers = docs.map((_, i) =>
        setTimeout(() => setAttached(prev => [...prev, i]), 800 + i * 1200)
      );
      return () => timers.forEach(clearTimeout);
    }, []);

    return (
      <AbstractProcessingLayout systemType="northstar-pa">
        <div className="p-4 h-full overflow-y-auto">
          <span className="text-[8px] text-[#8b95a5] block mb-2">Attaching Documents</span>
          <div className="flex flex-col gap-1 mb-3">
            {docs.map((doc, i) => (
              <motion.div
                key={doc}
                initial={{ opacity: 0.3 }}
                animate={attached.includes(i) ? { opacity: 1 } : {}}
                className="flex items-center gap-2"
              >
                {attached.includes(i) ? (
                  <CheckCircle size={9} className="text-[#1F425F] shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full border border-[#d0d5dd] shrink-0" />
                )}
                <span className={`text-[9px] ${attached.includes(i) ? "text-[#1a2a3d]" : "text-[#b0b8c4]"}`}>{doc}</span>
              </motion.div>
            ))}
          </div>
          <span className="text-[8px] text-[#8b95a5] block mb-1">Clinical Justification</span>
          <div className="text-[9px] text-[#1a2a3d] leading-relaxed">
            <TypeWriter
              text="Patient presents with cervical radiculopathy (M54.12) unresponsive to 8 weeks of conservative therapy including NSAIDs and physical therapy. MRI is medically necessary to evaluate for disc herniation or spinal stenosis."
              speed={35}
            />
          </div>
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 4: Validation
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); return 100; }
        return prev + 4;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <AbstractProcessingLayout systemType="northstar-pa">
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
        {progress < 100 ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#e2e8f0" strokeWidth="2" />
                <path d="M16 2A14 14 0 0 1 30 16" stroke="#4da8da" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
            <span className="text-[12px] text-[#1a2a3d] font-semibold">Validating form...</span>
          </>
        ) : (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <CheckCircle size={28} className="text-[#1F425F]" />
            </motion.div>
            <span className="text-[12px] text-[#1a2a3d] font-semibold">Form Validation Passed</span>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-2">
              <Zap size={10} className="text-[#1F425F]" />
              <span className="text-[10px] text-[#1F425F] font-semibold">92% Approval Likelihood</span>
            </motion.div>
            <div className="flex flex-col gap-1 w-full max-w-[240px]">
              {[
                { label: "Conservative therapy documented", score: "+24%" },
                { label: "Complete clinical documentation", score: "+22%" },
                { label: "InterQual criteria met 5/5", score: "+28%" },
                { label: "Prior BCBS approval history", score: "+18%" },
              ].map((factor, i) => (
                <motion.div
                  key={factor.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.3 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-[8px] text-[#8b95a5]">{factor.label}</span>
                  <span className="text-[8px] text-[#1F425F] font-bold">{factor.score}</span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 11: Submit (Terminal — kept as-is)
// ═══════════════════════════════════════════════════════════════════════════════

function SubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="api-terminal" summaryText="PA form complete: 22/22 fields, 92% approval likelihood" />;
  }
  if (screenIndex === 1) {
    return (
      <div className="h-[280px] bg-[#0d1117] flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
          <Terminal size={10} className="text-[#58a6ff]" />
          <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">NorthStar PA Agent</span>
          <span className="text-[7px] text-[#8b949e] font-mono">\u2014</span>
          <span className="text-[7px] text-[#d2a8ff] font-mono">claude-4-opus</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[7px] text-[#8b949e] font-mono bg-[#161b22] px-1.5 py-0.5 rounded">X12 278</span>
            <div className="flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#4da8da]" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[7px] text-[#8b949e] font-mono">live</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <TerminalOutput
            lines={[
              { text: "northstar-agent submit --protocol x12-278 --payer BCBS", type: "command" },
              { text: "Initializing secure connection to BCBS API gateway...", type: "thinking" },
              { text: "TLS 1.3 handshake complete \u2014 endpoint verified", type: "output" },
              { text: "Compiling submission package...", type: "thinking" },
              { text: "  \u2192 Patient: Margaret Thompson (NHC-2024-88421)", type: "info" },
              { text: "  \u2192 Procedure: CPT 72141 \u2014 MRI Cervical Spine", type: "info" },
              { text: "  \u2192 Documents: 4 clinical attachments (PDF)", type: "info" },
              { text: "Encoding X12 278 transaction set...", type: "thinking" },
              { text: "  BHT*0007*11*BCBS2026021547*20260215*1423*18", type: "output" },
              { text: "  HL*1**20*1", type: "output" },
              { text: "  2000E SV1*HC:72141*1*UN***1:2:3", type: "output" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  if (screenIndex === 2) {
    return (
      <div className="h-[280px] bg-[#0d1117] flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
          <Terminal size={10} className="text-[#58a6ff]" />
          <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">X12 278 \u2014 Response</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <TerminalOutput
            lines={[
              { text: "POST https://api.availity.com/bcbs/x12/278", type: "command" },
              { text: "Transmitting encrypted payload (12.4 KB)...", type: "thinking" },
              { text: "HTTP/1.1 200 OK", type: "success" },
              { text: "Content-Type: application/x12", type: "output" },
              { text: "  AAA*Y**42*C", type: "output" },
              { text: "Transaction acknowledged by payer", type: "success" },
              { text: "  Tracking ID: BCBS-2026-0215-4721", type: "info" },
              { text: "  Status: Accepted for Review", type: "info" },
              { text: "  Expected Response: 3-5 business days", type: "info" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  // Screen 3: Success
  return (
    <div className="h-[280px] bg-[#0d1117] flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
        <Terminal size={10} className="text-[#4da8da]" />
        <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">Submission Complete</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-14 h-14 rounded-full bg-[#1F425F] flex items-center justify-center shadow-lg shadow-[#4da8da]/20">
          <CheckCircle size={28} className="text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-1">
          <span className="text-[14px] text-[#4da8da] font-bold font-mono">PA Request Submitted</span>
          <span className="text-[10px] text-[#8b949e] font-mono">Tracking: BCBS-2026-0215-4721</span>
        </motion.div>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[8px] text-[#8b949e] font-mono">
          Case PA-2026-0215 \u2022 Under Review \u2022 Est. 3-5 business days
        </motion.span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 12: Patient Notify
// ═══════════════════════════════════════════════════════════════════════════════

function NotifyScreen({ screenIndex }: { screenIndex: number }) {
  // Screen 0: Composing message with typewriter
  if (screenIndex === 0) {
    return (
      <div className="h-[280px] bg-[#f7fafc] p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={12} className="text-[#4da8da]" />
          <span className="text-[11px] text-[#1a365d] font-semibold">Composing Notification</span>
        </div>
        <div className="flex items-center gap-2 mb-2 text-[9px] text-[#8b95a5]">
          <span>To:</span>
          <span className="text-[#1a365d] font-medium">Margaret Thompson</span>
          <span>(860) 555-0147</span>
        </div>
        <div className="text-[9px] text-[#1a365d] leading-relaxed">
          <TypeWriter
            text="Hi Margaret, this is NorthStar Health. Your prior authorization for MRI Cervical Spine has been submitted to BlueCross BlueShield. Tracking ID: BCBS-2026-0215-4721. Expected response: 3-5 business days. Check MyChart for updates."
            speed={20}
          />
        </div>
      </div>
    );
  }
  // Screen 1: Sending animation — messages flying out
  if (screenIndex === 1) {
    return (
      <div className="h-[280px] bg-[#f7fafc] flex flex-col items-center justify-center gap-4 overflow-hidden relative">
        {/* Ripple rings */}
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 rounded-full border border-[#4da8da]/30"
            initial={{ scale: 0.5, opacity: 0.8 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 2, delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

        {/* SMS flying out */}
        <motion.div
          className="relative z-10"
          initial={{ y: 0, scale: 1 }}
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-full bg-[#1F425F] flex items-center justify-center shadow-lg">
            <Send size={20} className="text-white" />
          </div>
        </motion.div>

        {/* Flying message cards */}
        {[
          { label: "SMS", delay: 0.3, x: -80, y: -60 },
          { label: "MyChart", delay: 1.0, x: 80, y: -50 },
        ].map((msg) => (
          <motion.div
            key={msg.label}
            className="absolute z-10 bg-white rounded-lg px-3 py-1.5 shadow-md border border-[#e5e8ee]"
            initial={{ opacity: 1, x: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: [1, 1, 0], x: msg.x, y: msg.y, scale: [0.8, 1, 0.6] }}
            transition={{ duration: 1.8, delay: msg.delay, repeat: Infinity, repeatDelay: 1 }}
          >
            <span className="text-[8px] text-[#1F425F] font-semibold">{msg.label}</span>
          </motion.div>
        ))}

        <span className="text-[11px] text-[#1a365d] font-medium relative z-10 mt-2">Sending notifications...</span>
      </div>
    );
  }
  // Screen 2: All delivered
  return (
    <div className="h-[280px] flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "#f7fafc" }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="w-14 h-14 rounded-full bg-[#1F425F] flex items-center justify-center shadow-lg"
      >
        <CheckCircle size={28} className="text-white" />
      </motion.div>
      <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[14px] text-[#1F425F] font-bold">
        Notifications Delivered
      </motion.span>
      <div className="flex items-center gap-4">
        {[
          { label: "SMS Delivered", delay: 0.5 },
          { label: "MyChart Updated", delay: 0.7 },
        ].map((item) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: item.delay }} className="flex items-center gap-1">
            <CheckCircle size={9} className="text-[#099F69]" />
            <span className="text-[9px] text-[#8b95a5]">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase 13: Status Check
// ═══════════════════════════════════════════════════════════════════════════════

function StatusScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return (
      <AbstractProcessingLayout systemType="northstar-pa">
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#e2e8f0" strokeWidth="2" />
              <path d="M14 2A12 12 0 0 1 26 14" stroke="#4da8da" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <span className="text-[11px] text-[#1a2a3d] font-medium">Querying BCBS status API...</span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-2"
          >
            <Clock size={10} className="text-[#d97706]" />
            <span className="text-[10px] text-[#92400e] font-semibold">Status: Under Review</span>
          </motion.div>
        </div>
      </AbstractProcessingLayout>
    );
  }
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="northstar-pa">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Auto-Monitoring Configured</span>
          <AnimatedList
            items={[
              { text: "Status polling", detail: "Every 4 hours via BCBS API" },
              { text: "Alert on decision", detail: "Notify via SMS + email" },
              { text: "RFI detection", detail: "Auto-detect additional info requests" },
            ]}
            delayStart={500}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 2: All green
  return (
    <AbstractProcessingLayout systemType="northstar-pa">
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={28} className="text-[#1F425F]" />
        </motion.div>
        <span className="text-[14px] text-[#1F425F] font-bold">PA Workflow Complete</span>
        <span className="text-[9px] text-[#8b95a5]">All systems operational \u2014 monitoring active</span>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4 mt-1">
          {["Submitted", "Notified", "Monitoring"].map(s => (
            <div key={s} className="flex items-center gap-1">
              <CheckCircle size={8} className="text-[#1F425F]" />
              <span className="text-[8px] text-[#8b95a5]">{s}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Channel Routing Screen
// ═══════════════════════════════════════════════════════════════════════════════

function ChannelRoutingScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="pa-engine" summaryText="PA form approved — routing all 4 orders to submission channels" />;
  }
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="pa-engine">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Checking Payer Directory</span>
          <ActivitySteps
            steps={[
              { label: "BlueCross BlueShield", detail: "API — X12 278 endpoint available" },
              { label: "UnitedHealthcare", detail: "Voice — IVR hotline configured" },
              { label: "Aetna", detail: "RPA — Portal automation configured" },
            ]}
            delayPerStep={2000}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 2: Routing overview with channel badges
  return (
    <AbstractProcessingLayout systemType="pa-engine">
      <div className="p-4 h-full overflow-hidden">
        <span className="text-[10px] text-[#8b95a5] block mb-3">Channel Routing — 4 Orders</span>
        <AnimatedList
          items={[
            { text: "Margaret Thompson — MRI Cervical Spine", detail: "BCBS → API" },
            { text: "Robert Chen — Knee Arthroscopy", detail: "BCBS → API" },
            { text: "Linda Nakamura — Epidural Injection", detail: "UHC → Voice" },
            { text: "James Rodriguez — CT Abdomen/Pelvis", detail: "Aetna → RPA" },
          ]}
          delayStart={300}
        />
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// API Submit Screen (single BCBS order — terminal UI)
// ═══════════════════════════════════════════════════════════════════════════════

function ApiSubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="api-terminal" summaryText="PA form complete — submitting via BCBS X12 278 API" />;
  }
  if (screenIndex === 1) {
    return (
      <div className="h-[280px] bg-[#0d1117] flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
          <Terminal size={10} className="text-[#58a6ff]" />
          <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">NorthStar PA Agent</span>
          <span className="text-[7px] text-[#8b949e] font-mono">&mdash;</span>
          <span className="text-[7px] text-[#d2a8ff] font-mono">claude-4-opus</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[7px] text-[#8b949e] font-mono bg-[#161b22] px-1.5 py-0.5 rounded">X12 278</span>
            <div className="flex items-center gap-1">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#4da8da]" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[7px] text-[#8b949e] font-mono">live</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <TerminalOutput
            lines={[
              { text: "northstar-agent submit --protocol x12-278 --payer BCBS", type: "command" },
              { text: "Initializing secure connection to BCBS API gateway...", type: "thinking" },
              { text: "TLS 1.3 handshake complete — endpoint verified", type: "output" },
              { text: "Compiling submission package...", type: "thinking" },
              { text: "  \u2192 Patient: Margaret Thompson (NHC-2024-88421)", type: "info" },
              { text: "  \u2192 Procedure: CPT 72141 — MRI Cervical Spine", type: "info" },
              { text: "  \u2192 Documents: 4 clinical attachments (PDF)", type: "info" },
              { text: "Encoding X12 278 transaction set...", type: "thinking" },
              { text: "  BHT*0007*11*BCBS2026021547*20260215*1423*18", type: "output" },
              { text: "  HL*1**20*1", type: "output" },
              { text: "  2000E SV1*HC:72141*1*UN***1:2:3", type: "output" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  if (screenIndex === 2) {
    return (
      <div className="h-[280px] bg-[#0d1117] flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
          <Terminal size={10} className="text-[#58a6ff]" />
          <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">X12 278 — Response</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <TerminalOutput
            lines={[
              { text: "POST https://api.availity.com/bcbs/x12/278", type: "command" },
              { text: "Transmitting encrypted payload (12.4 KB)...", type: "thinking" },
              { text: "HTTP/1.1 200 OK", type: "success" },
              { text: "Content-Type: application/x12", type: "output" },
              { text: "  AAA*Y**42*C", type: "output" },
              { text: "Transaction acknowledged by payer", type: "success" },
              { text: "  Tracking ID: BCBS-2026-0215-4721", type: "info" },
              { text: "  Status: Accepted for Review", type: "info" },
              { text: "  Expected Response: 3-5 business days", type: "info" },
            ]}
            delayStart={200}
          />
        </div>
      </div>
    );
  }
  // Screen 3: Success
  return (
    <div className="h-[280px] bg-[#0d1117] flex flex-col">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#21262d]">
        <Terminal size={10} className="text-[#4da8da]" />
        <span className="text-[9px] text-[#c9d1d9] font-mono font-semibold">Submission Complete</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-14 h-14 rounded-full bg-[#1F425F] flex items-center justify-center shadow-lg shadow-[#4da8da]/20">
          <CheckCircle size={28} className="text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-1">
          <span className="text-[14px] text-[#4da8da] font-bold font-mono">PA Request Submitted</span>
          <span className="text-[9px] text-[#8b949e] font-mono">Tracking: BCBS-2026-0215-4721</span>
        </motion.div>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[8px] text-[#8b949e] font-mono">
          Case PA-2026-0215 &bull; Under Review &bull; Est. 3-5 business days
        </motion.span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Voice Submit Screen (UHC — Activity Steps IVR)
// ═══════════════════════════════════════════════════════════════════════════════

function VoiceSubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="uhc-voice" summaryText="PA form complete — submitting via UHC Voice/IVR" />;
  }
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="uhc-voice">
        <div className="p-4 h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Phone size={11} className="text-[#FF612B]" />
            <span className="text-[10px] text-[#8b95a5]">Calling 1-800-555-0199</span>
          </div>
          <ActivitySteps
            steps={[
              { label: "Dialing UHC PA hotline", detail: "1-800-555-0199" },
              { label: "Connected to IVR system", detail: "Automated voice menu answered" },
              { label: "Navigating menu \u2192 Prior Auth", detail: "Selected New Request" },
            ]}
            delayPerStep={2000}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="uhc-voice">
        <div className="p-4 h-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Phone size={11} className="text-[#FF612B]" />
            <span className="text-[10px] text-[#8b95a5]">Active Call — 02:18</span>
          </div>
          <ActivitySteps
            steps={[
              { label: "Dictating patient details", detail: "Linda Nakamura, DOB, Member ID" },
              { label: "Dictating procedure info", detail: "CPT 62323 — Lumbar Epidural Injection" },
              { label: "Dictating diagnosis", detail: "M54.17 — Lumbar Radiculopathy" },
              { label: "Reference number received", detail: "UHC-PA-2026-84521" },
            ]}
            delayPerStep={1800}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 3: Call complete
  return (
    <AbstractProcessingLayout systemType="uhc-voice">
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={28} className="text-[#FF612B]" />
        </motion.div>
        <span className="text-[14px] text-[#002677] font-bold">Voice Submission Complete</span>
        <span className="text-[10px] text-[#8b95a5]">Reference: UHC-PA-2026-84521</span>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-3 mt-1">
          <span className="text-[8px] text-[#8b95a5]">Call duration: 3:42</span>
          <span className="text-[8px] text-[#8b95a5]">Linda Nakamura</span>
        </motion.div>
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RPA Submit Screen (Aetna — Portal Automation)
// ═══════════════════════════════════════════════════════════════════════════════

function RpaSubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="aetna-portal" summaryText="Portal credentials authorized — launching Aetna RPA bot" />;
  }
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="aetna-portal">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Authenticating to Aetna Portal</span>
          <ActivitySteps
            steps={[
              { label: "Launching headless browser", detail: "Chromium instance initialized" },
              { label: "Injecting provider credentials", detail: "Encrypted credential injection" },
              { label: "Completing MFA challenge", detail: "TOTP code verified" },
              { label: "Authenticated", detail: "provider.aetna.com — session active" },
            ]}
            delayPerStep={1500}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="aetna-portal">
        <div className="h-full overflow-y-auto">
          <FormAutoFill
            fields={[
              { label: "Patient Name", value: "James Rodriguez" },
              { label: "Date of Birth", value: "07/22/1971" },
              { label: "Member ID", value: "AET-882104376" },
              { label: "CPT Code", value: "74178 — CT Abdomen & Pelvis" },
              { label: "ICD-10", value: "R10.9 — Abdominal Pain" },
              { label: "Ordering Physician", value: "Dr. Michael Chen" },
            ]}
            delayStart={200}
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  if (screenIndex === 3) {
    return (
      <AbstractProcessingLayout systemType="aetna-portal">
        <div className="p-4 h-full overflow-hidden">
          <span className="text-[10px] text-[#8b95a5] block mb-3">Uploading Clinical Documents</span>
          <ActivitySteps
            steps={[
              { label: "CT Indication Notes", detail: "Uploaded — 142 KB" },
              { label: "Lab Results (CBC, CMP)", detail: "Uploaded — 89 KB" },
              { label: "Referral Letter", detail: "Uploaded — 67 KB" },
            ]}
            delayPerStep={2000}
            doneMessage="3/3 documents attached to submission"
          />
        </div>
      </AbstractProcessingLayout>
    );
  }
  // Screen 4: Submission confirmation
  return (
    <AbstractProcessingLayout systemType="aetna-portal">
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={28} className="text-[#7C3AED]" />
        </motion.div>
        <span className="text-[14px] text-[#56166A] font-bold">Aetna PA Submitted</span>
        <span className="text-[10px] text-[#8b95a5]">Reference: AET-PA-2026-33108</span>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[8px] text-[#8b95a5]">
          James Rodriguez • CT Abdomen/Pelvis • Est. 5-7 business days
        </motion.span>
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE SCREEN ROUTER
// ═══════════════════════════════════════════════════════════════════════════════

export function PhaseScreenRenderer({ phaseId, screenIndex }: { phaseId: string; screenIndex: number }) {
  switch (phaseId) {
    case "scan-ehr": return <ScanOrdersScreen screenIndex={screenIndex} />;
    case "patient-details": return <PatientDetailsScreen screenIndex={screenIndex} />;
    case "payer-rules": return <PayerRulesScreen screenIndex={screenIndex} />;
    case "submission-channel": return <ChannelScreen screenIndex={screenIndex} />;
    case "document-checklist": return <ChecklistScreen screenIndex={screenIndex} />;
    case "fetch-documents": return <FetchDocsScreen screenIndex={screenIndex} />;
    case "fill-form": return <FillFormScreen screenIndex={screenIndex} />;
    case "submit": return <SubmitScreen screenIndex={screenIndex} />;
    case "channel-routing": return <ChannelRoutingScreen screenIndex={screenIndex} />;
    case "submit-api": return <ApiSubmitScreen screenIndex={screenIndex} />;
    case "submit-voice": return <VoiceSubmitScreen screenIndex={screenIndex} />;
    case "submit-rpa": return <RpaSubmitScreen screenIndex={screenIndex} />;
    case "patient-notify": return <NotifyScreen screenIndex={screenIndex} />;
    case "check-status": return <StatusScreen screenIndex={screenIndex} />;
    default: return <div className="h-[280px] flex items-center justify-center text-[#8b95a5] text-[11px]">Unknown phase</div>;
  }
}
