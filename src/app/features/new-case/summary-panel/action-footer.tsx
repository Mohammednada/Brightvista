import { motion } from "motion/react";
import { Send, Save } from "lucide-react";
import type { CaseStatus, StepId } from "../state/case-builder-state";

interface ActionFooterProps {
  status: CaseStatus;
  currentStep: StepId;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

export function ActionFooter({ status, currentStep, onSubmit, onSaveDraft }: ActionFooterProps) {
  const canSubmit = currentStep === "review" || currentStep === "submit";
  const isSubmitted = status === "submitted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex items-center gap-2 pt-3 border-t border-border-default"
    >
      <button
        onClick={onSubmit}
        disabled={!canSubmit || isSubmitted}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
          canSubmit && !isSubmitted
            ? "bg-brand text-white hover:bg-[#2d5a7a] cursor-pointer shadow-sm"
            : "bg-[#f0f2f4] text-text-muted cursor-not-allowed"
        }`}
      >
        <Send size={14} />
        {isSubmitted ? "Submitted" : "Submit Case"}
      </button>
      <button
        onClick={onSaveDraft}
        disabled={isSubmitted}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
          isSubmitted
            ? "border-border-default text-text-muted cursor-not-allowed"
            : "border-border-default text-text-secondary hover:bg-surface-bg cursor-pointer"
        }`}
      >
        <Save size={14} />
        Save Draft
      </button>
    </motion.div>
  );
}
