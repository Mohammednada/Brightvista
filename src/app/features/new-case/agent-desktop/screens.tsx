import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  CheckCircle, FileText, Shield, Terminal, MessageSquare,
  Send, Zap, Clock, Bell, Phone, Globe, Play, Pause,
} from "lucide-react";
import { TypeWriter } from "../chat-components";
import { SYSTEM_THEMES } from "./themes";
import { MinimalHeader } from "./chrome";
import { AbstractProcessingLayout, PhoneSmsLayout } from "./layouts";
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

function NotifySendingAnimation() {
  const channels = [
    { label: "SMS", detail: "(860) 555-0147", icon: MessageSquare, delay: 0 },
    { label: "MyChart Portal", detail: "Patient portal update", icon: Bell, delay: 1.8 },
  ];

  return (
    <div className="h-[280px] bg-[#f7fafc] flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Animated envelope launching */}
      <motion.div
        className="mb-6"
        initial={{ y: 0, scale: 1 }}
        animate={{ y: -120, scale: 0.3, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeIn" }}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#1F425F] flex items-center justify-center shadow-lg">
          <Send size={20} className="text-white" />
        </div>
      </motion.div>

      {/* Channel delivery rows */}
      <div className="flex flex-col gap-3 w-full max-w-[260px] -mt-8">
        {channels.map((ch) => (
          <NotifyChannelRow key={ch.label} channel={ch} />
        ))}
      </div>

      <motion.span
        className="text-[10px] text-[#8b95a5] mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Delivering to patient...
      </motion.span>
    </div>
  );
}

function NotifyChannelRow({ channel }: { channel: { label: string; detail: string; icon: typeof MessageSquare; delay: number } }) {
  const [phase, setPhase] = useState<"waiting" | "sending" | "done">("waiting");
  const Icon = channel.icon;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("sending"), channel.delay * 1000 + 600);
    const t2 = setTimeout(() => setPhase("done"), channel.delay * 1000 + 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [channel.delay]);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: channel.delay * 0.5 + 0.5, duration: 0.4 }}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
        phase === "done" ? "bg-[#099F69]" : "bg-[#1F425F]"
      }`}>
        {phase === "done" ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
            <CheckCircle size={13} className="text-white" />
          </motion.div>
        ) : (
          <Icon size={13} className="text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#1a365d] font-semibold">{channel.label}</span>
          <span className={`text-[8px] font-medium transition-colors duration-300 ${
            phase === "done" ? "text-[#099F69]" : phase === "sending" ? "text-[#4da8da]" : "text-[#8b95a5]"
          }`}>
            {phase === "done" ? "Delivered" : phase === "sending" ? "Sending..." : "Queued"}
          </span>
        </div>
        <span className="text-[8px] text-[#8b95a5] block">{channel.detail}</span>
        {/* Progress bar */}
        <div className="h-[3px] rounded-full bg-[#e5e8ee] mt-1 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${phase === "done" ? "bg-[#099F69]" : "bg-[#4da8da]"}`}
            initial={{ width: "0%" }}
            animate={{ width: phase === "waiting" ? "0%" : phase === "sending" ? "70%" : "100%" }}
            transition={{ duration: phase === "sending" ? 1.2 : 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

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
  // Screen 1: Sending animation — progress channels
  if (screenIndex === 1) {
    return <NotifySendingAnimation />;
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

function CallAvatarBadge({ label, color, pulse = false }: { label: string; color: string; pulse?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `1.5px solid ${color}` }}
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center" style={{ background: color }}>
        <span className="text-[7px] text-white font-semibold leading-none">{label}</span>
      </div>
    </div>
  );
}

const TRANSCRIPT_LINES: { speaker: "agent" | "ivr"; text: string }[] = [
  { speaker: "agent", text: "Requesting prior authorization for CPT 62323, Lumbar Epidural Steroid Injection." },
  { speaker: "ivr",   text: "Member ID please." },
  { speaker: "agent", text: "Member ID UHC-8847291." },
  { speaker: "ivr",   text: "Verified. Patient Linda Nakamura. Please provide diagnosis code." },
  { speaker: "agent", text: "ICD-10 M54.17, Lumbar Radiculopathy." },
  { speaker: "ivr",   text: "Authorization request received. Reference UHC-PA-2026-84521. Review in 5-7 business days." },
  { speaker: "agent", text: "Confirmed. Thank you." },
];

function LiveTranscript() {
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= TRANSCRIPT_LINES.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 600 : 1600);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleCount]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-4 space-y-2 scrollbar-none">
      {TRANSCRIPT_LINES.slice(0, visibleCount).map((line, i) => {
        const isAgent = line.speaker === "agent";
        const isLatest = i === visibleCount - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 ${isAgent ? "" : "flex-row-reverse"}`}
          >
            <CallAvatarBadge
              label={isAgent ? "NS" : "UHC"}
              color={isAgent ? "#6b7280" : "#FF612B"}
              pulse={isLatest}
            />
            <div
              className={`max-w-[80%] rounded-lg px-2.5 py-1.5 ${isAgent ? "bg-white border border-[#e5e7eb]" : "bg-[#FF612B]/8 border border-[#FF612B]/15"}`}
            >
              <span className="text-[9px] leading-relaxed block text-[#374151]">{line.text}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function AudioWaveformPlayer() {
  const BAR_COUNT = 18;
  const barHeights = useRef(Array.from({ length: BAR_COUNT }, () => 12 + Math.random() * 16)).current;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = useCallback(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
    } else {
      setProgress(0);
      setPlaying(true);
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 8000;
        if (elapsed >= 1) {
          setProgress(1);
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else {
          setProgress(elapsed);
        }
      }, 50);
    }
  }, [playing]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const elapsed = Math.floor(progress * 222);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-lg mx-4 border border-[#e5e7eb]">
      <button onClick={togglePlay} className="w-[26px] h-[26px] rounded-full bg-[#FF612B] flex items-center justify-center flex-shrink-0 hover:bg-[#e5551f] transition-colors">
        {playing ? <Pause size={10} className="text-white" /> : <Play size={10} className="text-white ml-[1px]" />}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-end gap-[2px] h-[24px]">
          {barHeights.map((h, i) => {
            const barProgress = i / BAR_COUNT;
            const isActive = barProgress <= progress;
            return (
              <motion.div
                key={i}
                className="w-[2px] rounded-full"
                style={{ background: isActive ? "#FF612B" : "#d1d5db" }}
                animate={playing ? { height: [h * 0.5, h, h * 0.7, h * 0.9, h * 0.5] } : { height: h }}
                transition={playing ? { duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: i * 0.04 } : { duration: 0.3 }}
              />
            );
          })}
        </div>
        <div className="w-full h-[2px] bg-[#e5e7eb] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#FF612B] rounded-full" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <span className="text-[8px] text-[#9ca3af] tabular-nums flex-shrink-0">{timeStr} / 3:42</span>
    </div>
  );
}

function VoiceSubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="northstar-pa" toSystem="uhc-voice" summaryText="PA form complete — submitting via UHC Voice/IVR" />;
  }
  // Screen 1: Dialing
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="uhc-voice">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="flex items-center gap-4">
            <CallAvatarBadge label="NS" color="#6b7280" pulse />
            <motion.div className="flex gap-1.5" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-[4px] h-[4px] rounded-full bg-[#9ca3af]" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }} />
              ))}
            </motion.div>
            <CallAvatarBadge label="UHC" color="#FF612B" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[11px] text-[#6b7280] font-medium">
              Calling...
            </motion.span>
            <span className="text-[9px] text-[#9ca3af]">1-800-555-0199</span>
          </div>
        </div>
      </AbstractProcessingLayout>
    );
  }

  // Screen 2: Connected with live transcript
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="uhc-voice">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e7eb]">
            <div className="flex items-center gap-2">
              <CallAvatarBadge label="NS" color="#6b7280" />
              <span className="text-[9px] text-[#6b7280]">Agent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div className="w-[5px] h-[5px] rounded-full bg-[#22c55e]" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[8px] text-[#9ca3af] tabular-nums">02:18</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#6b7280]">IVR</span>
              <CallAvatarBadge label="UHC" color="#FF612B" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden pt-2">
            <LiveTranscript />
          </div>
        </div>
      </AbstractProcessingLayout>
    );
  }

  // Screen 3: Call ended + audio playback
  return (
    <AbstractProcessingLayout systemType="uhc-voice">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-1.5">
            <Phone size={10} className="text-[#9ca3af]" />
            <span className="text-[9px] text-[#6b7280]">Call Ended</span>
          </div>
          <span className="text-[8px] text-[#9ca3af] tabular-nums">Duration: 3:42</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-none">
          {TRANSCRIPT_LINES.map((line, i) => {
            const isAgent = line.speaker === "agent";
            const isRef = line.text.includes("UHC-PA-2026-84521");
            return (
              <div key={i} className={`flex items-start gap-1.5 ${isAgent ? "" : "flex-row-reverse"}`}>
                <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: isAgent ? "#6b7280" : "#FF612B" }}>
                  <span className="text-[5px] text-white font-semibold">{isAgent ? "NS" : "UHC"}</span>
                </div>
                <div className={`max-w-[80%] rounded-lg px-2 py-1 ${isAgent ? "bg-white border border-[#e5e7eb]" : "bg-[#FF612B]/8 border border-[#FF612B]/15"}`}>
                  <span className={`text-[8px] leading-relaxed block ${isRef ? "text-[#FF612B] font-semibold" : "text-[#374151]"}`}>{line.text}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="py-2 border-t border-[#e5e7eb]">
          <AudioWaveformPlayer />
        </div>
      </div>
    </AbstractProcessingLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Fax Submit Screen (UHC — PA Form Fax after Voice Call)
// ═══════════════════════════════════════════════════════════════════════════════

const FAX_PAGES = [
  { label: "PA Request Form", detail: "Patient demographics, procedure & diagnosis codes" },
  { label: "Clinical Notes", detail: "Dr. Martinez — lumbar radiculopathy assessment" },
  { label: "Imaging Referral", detail: "MRI results & specialist recommendation" },
  { label: "Medical Necessity Letter", detail: "Clinical justification for epidural injection" },
  { label: "Insurance Verification", detail: "UHC member eligibility confirmation" },
];

function FaxSubmitScreen({ screenIndex }: { screenIndex: number }) {
  if (screenIndex === 0) {
    return <SystemTransitionScreen fromSystem="uhc-voice" toSystem="uhc-fax" summaryText="Voice call complete — faxing PA form and supporting documents to UHC" />;
  }

  // Screen 1: Generating PDF
  if (screenIndex === 1) {
    return (
      <AbstractProcessingLayout systemType="uhc-fax">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={12} className="text-[#FF612B]" />
            <span className="text-[10px] text-[#6b7280] font-medium">Generating PA Form Package</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {FAX_PAGES.map((page, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.6, duration: 0.3 }}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#e5e7eb]"
              >
                <div className="w-[18px] h-[22px] rounded-[3px] bg-[#FF612B]/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={10} className="text-[#FF612B]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] text-[#374151] font-medium block">{page.label}</span>
                  <span className="text-[7px] text-[#9ca3af] block">{page.detail}</span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.6 + 0.4, type: "spring" }}
                  className="ml-auto"
                >
                  <CheckCircle size={10} className="text-[#22c55e]" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </AbstractProcessingLayout>
    );
  }

  // Screen 2: Transmitting fax
  if (screenIndex === 2) {
    return (
      <AbstractProcessingLayout systemType="uhc-fax">
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
          <motion.div
            className="w-[48px] h-[48px] rounded-full border-2 border-[#FF612B]/20 flex items-center justify-center"
            animate={{ borderColor: ["rgba(255,97,43,0.2)", "rgba(255,97,43,0.6)", "rgba(255,97,43,0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Send size={18} className="text-[#FF612B]" />
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] text-[#374151] font-medium">Transmitting Secure Fax</span>
            <span className="text-[9px] text-[#9ca3af]">1-800-555-0143 — 5 pages</span>
          </div>
          <div className="w-[180px]">
            <div className="flex justify-between mb-1">
              <span className="text-[7px] text-[#9ca3af]">Sending...</span>
              <motion.span
                className="text-[7px] text-[#FF612B] tabular-nums"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                HIPAA Encrypted
              </motion.span>
            </div>
            <div className="w-full h-[3px] bg-[#e5e7eb] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF612B] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </AbstractProcessingLayout>
    );
  }

  // Screen 3: Fax delivered
  return (
    <AbstractProcessingLayout systemType="uhc-fax">
      <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={28} className="text-[#22c55e]" />
        </motion.div>
        <span className="text-[12px] text-[#374151] font-semibold">Fax Delivered Successfully</span>
        <div className="bg-white rounded-lg border border-[#e5e7eb] px-4 py-2.5 space-y-1">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[8px] text-[#9ca3af]">Confirmation</span>
            <span className="text-[9px] text-[#FF612B] font-semibold">FX-84521</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[8px] text-[#9ca3af]">Fax Number</span>
            <span className="text-[9px] text-[#374151]">1-800-555-0143</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[8px] text-[#9ca3af]">Pages Sent</span>
            <span className="text-[9px] text-[#374151]">5 of 5</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[8px] text-[#9ca3af]">Reference</span>
            <span className="text-[9px] text-[#374151]">UHC-PA-2026-84521</span>
          </div>
        </div>
        <span className="text-[8px] text-[#9ca3af]">PA form + clinical documents delivered to UHC</span>
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
    case "submit-voice-fax": return <FaxSubmitScreen screenIndex={screenIndex} />;
    case "submit-rpa": return <RpaSubmitScreen screenIndex={screenIndex} />;
    case "patient-notify": return <NotifyScreen screenIndex={screenIndex} />;
    case "check-status": return <StatusScreen screenIndex={screenIndex} />;
    default: return <div className="h-[280px] flex items-center justify-center text-[#8b95a5] text-[11px]">Unknown phase</div>;
  }
}
