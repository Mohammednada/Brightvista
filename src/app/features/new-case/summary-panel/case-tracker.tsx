import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { StepState } from "../state/case-builder-state";

interface CaseTrackerProps {
  steps: StepState[];
}

export function CaseTracker({ steps }: CaseTrackerProps) {
  return (
    <div className="px-5 pt-3 pb-2">
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-2.5">
        Case Tracker
      </span>

      <div className="flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const done = step.status === "complete";
          const active = step.status === "active";
          const attention = step.status === "needs-attention";

          return (
            <div key={step.id} className="flex gap-3">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <Dot status={step.status} />
                {!isLast && (
                  <div
                    className={`w-px flex-1 min-h-[16px] ${
                      done ? "bg-[#099F69]" : "bg-[#e5e5e5]"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <div className={`pb-3 ${isLast ? "pb-0" : ""} min-h-[16px] flex flex-col justify-center`}>
                <span
                  className={`text-[12px] leading-[16px] ${
                    done
                      ? "text-text-secondary line-through decoration-text-muted/40"
                      : active
                      ? "text-brand font-semibold"
                      : attention
                      ? "text-[#F3903F] font-medium"
                      : "text-text-muted"
                  }`}
                >
                  {step.label}
                </span>
                {step.sublabel && (
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      active ? "text-brand/60" : "text-text-muted/70"
                    }`}
                  >
                    {step.sublabel}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Dot({ status }: { status: StepState["status"] }) {
  if (status === "complete") {
    return (
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-4 h-4 rounded-full bg-[#099F69] flex items-center justify-center shrink-0"
      >
        <Check size={9} className="text-white" strokeWidth={3} />
      </motion.div>
    );
  }

  if (status === "active") {
    return (
      <div className="w-4 h-4 shrink-0 relative flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-brand" />
      </div>
    );
  }

  if (status === "needs-attention") {
    return (
      <div className="w-4 h-4 rounded-full border-2 border-[#F3903F] flex items-center justify-center shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[#F3903F]" />
      </div>
    );
  }

  // Pending
  return (
    <div className="w-4 h-4 rounded-full border-[1.5px] border-[#ddd] shrink-0" />
  );
}
