import { motion } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import type { ApprovalFactor } from "../state/case-builder-state";

function getColor(likelihood: number): string {
  if (likelihood >= 70) return "#099F69";
  if (likelihood >= 40) return "#F3903F";
  return "#D02241";
}

function getLabel(likelihood: number): string {
  if (likelihood >= 70) return "High Likelihood";
  if (likelihood >= 40) return "Moderate Likelihood";
  return "Low Likelihood";
}

function getLabelStyle(likelihood: number): string {
  if (likelihood >= 70) return "bg-[#dcfce7] text-[#099F69]";
  if (likelihood >= 40) return "bg-[#fef3cd] text-[#F3903F]";
  return "bg-[#fef2f2] text-[#D02241]";
}

interface ApprovalSectionProps {
  likelihood: number;
  factors: ApprovalFactor[];
}

export function ApprovalSection({ likelihood, factors }: ApprovalSectionProps) {
  const color = getColor(likelihood);
  const label = getLabel(likelihood);
  const labelStyle = getLabelStyle(likelihood);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="px-5 py-4"
    >
      {/* Section header + score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Approval</span>
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0 rounded text-[9px] font-semibold ${labelStyle}`}>
            {label}
          </span>
          <motion.span
            className="text-[16px] font-bold leading-none"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {likelihood}%
          </motion.span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-[#f0f2f4] overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${likelihood}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      {/* Factors */}
      <div className="flex flex-col gap-1">
        {factors.map((factor, i) => (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-2 py-0.5"
          >
            {factor.met ? (
              <CheckCircle size={12} className="text-[#099F69] shrink-0" />
            ) : (
              <XCircle size={12} className="text-[#D02241] shrink-0" />
            )}
            <span className="text-[11px] text-text-secondary flex-1">{factor.label}</span>
            <span
              className={`text-[11px] font-semibold ${
                factor.met ? "text-[#099F69]" : "text-text-muted"
              }`}
            >
              {factor.met ? "+" : ""}{factor.weight}%
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
