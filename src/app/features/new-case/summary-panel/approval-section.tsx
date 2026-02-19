import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, TrendingUp, ChevronDown } from "lucide-react";
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
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ApprovalSection({ likelihood, factors, isCollapsed, onToggle }: ApprovalSectionProps) {
  const color = getColor(likelihood);
  const label = getLabel(likelihood);
  const labelStyle = getLabelStyle(likelihood);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="px-5 py-2"
    >
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Approval</span>
          <span className={`px-1.5 py-0 rounded text-[9px] font-semibold ${labelStyle}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className="text-[16px] font-bold leading-none"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {likelihood}%
          </motion.span>
          <motion.div
            animate={{ rotate: isCollapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
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
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-2 border-t border-[#f0f2f4]" />
    </motion.div>
  );
}
