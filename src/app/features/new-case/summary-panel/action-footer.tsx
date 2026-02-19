import { motion } from "motion/react";
import { Send, Save, Loader2, CheckCircle } from "lucide-react";
import type { CaseStatus, StepId } from "../state/case-builder-state";

interface ActionFooterProps {
  status: CaseStatus;
  currentStep: StepId;
  onSubmit: () => void;
  onSaveDraft: () => void;
  agentModeActive: boolean;
  activePhaseLabel: string | null;
}

export function ActionFooter({ status, currentStep, onSubmit, onSaveDraft, agentModeActive, activePhaseLabel }: ActionFooterProps) {
  const canSubmit = currentStep === "review" || currentStep === "submit";
  const isSubmitted = status === "submitted";

  // Agent is actively working on a phase
  if (agentModeActive && activePhaseLabel && !isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 pt-3 border-t border-border-default"
      >
        <Loader2 size={16} className="text-brand animate-spin shrink-0" />
        <span className="text-[13px] text-text-secondary font-medium truncate">
          {activePhaseLabel}
        </span>
      </motion.div>
    );
  }

  // After submission
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center gap-2 pt-3 border-t border-border-default"
      >
        <CheckCircle size={16} className="text-[#099F69]" />
        <span className="text-[13px] text-[#099F69] font-semibold">Case Submitted</span>
      </motion.div>
    );
  }

  // Default: Submit / Save buttons
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-center gap-2 pt-3 border-t border-border-default"
    >
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
          canSubmit
            ? "bg-brand text-white hover:bg-[#2d5a7a] cursor-pointer shadow-sm"
            : "bg-[#f0f2f4] text-text-muted cursor-not-allowed"
        }`}
      >
        <Send size={14} />
        Submit Case
      </button>
      <button
        onClick={onSaveDraft}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-border-default text-text-secondary hover:bg-surface-bg cursor-pointer transition-all"
      >
        <Save size={14} />
        Save Draft
      </button>
    </motion.div>
  );
}
