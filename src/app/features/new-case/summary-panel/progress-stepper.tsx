import { motion } from "motion/react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { StepState } from "../state/case-builder-state";

interface ProgressStepperProps {
  steps: StepState[];
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                {step.status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-brand/20"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ margin: -3 }}
                  />
                )}
                <StepCircle step={step} index={i} />
              </div>
              <span
                className={`text-[10px] font-medium leading-tight whitespace-nowrap ${
                  step.status === "complete"
                    ? "text-[#099F69]"
                    : step.status === "active"
                    ? "text-brand"
                    : step.status === "needs-attention"
                    ? "text-[#F3903F]"
                    : "text-text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-2 mt-[-14px] rounded-full transition-colors duration-300 ${
                  step.status === "complete" ? "bg-[#099F69]" : "bg-[#e5e5e5]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCircle({ step, index }: { step: StepState; index: number }) {
  const size = 24;

  if (step.status === "complete") {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <CheckCircle size={size} className="text-[#099F69]" fill="#099F69" stroke="white" strokeWidth={2} />
      </motion.div>
    );
  }

  if (step.status === "needs-attention") {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AlertTriangle size={size} className="text-[#F3903F]" fill="#F3903F" stroke="white" strokeWidth={2} />
      </motion.div>
    );
  }

  if (step.status === "active") {
    return (
      <motion.div
        className="w-6 h-6 rounded-full bg-brand flex items-center justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-[11px] font-bold text-white">{index + 1}</span>
      </motion.div>
    );
  }

  // Pending
  return (
    <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
      <span className="text-[11px] font-bold text-text-muted">{index + 1}</span>
    </div>
  );
}
