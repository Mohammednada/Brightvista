import { motion } from "motion/react";
import { TrendingUp, CheckCircle, XCircle } from "lucide-react";
import type { ApprovalFactor } from "../state/case-builder-state";

// ── Color helpers ────────────────────────────────────────────────────────────

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

function getLabelBg(likelihood: number): string {
  if (likelihood >= 70) return "bg-[#dcfce7] text-[#099F69]";
  if (likelihood >= 40) return "bg-[#fef3cd] text-[#F3903F]";
  return "bg-[#fef2f2] text-[#D02241]";
}

// ── Semi-circular SVG Gauge ──────────────────────────────────────────────────

function SemiCircleGauge({ value, color }: { value: number; color: string }) {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 20 }}>
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={describeArc(size / 2, size / 2 + strokeWidth / 2, radius, 180, 360)}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <motion.path
          d={describeArc(size / 2, size / 2 + strokeWidth / 2, radius, 180, 360)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {/* Center percentage */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <motion.span
          className="text-[32px] font-bold leading-none"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Describe a semicircular SVG arc path from startAngle to endAngle (degrees).
 */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// ── Approval Gauge Component ─────────────────────────────────────────────────

interface ApprovalGaugeProps {
  likelihood: number;
  factors: ApprovalFactor[];
}

export function ApprovalGauge({ likelihood, factors }: ApprovalGaugeProps) {
  const color = getColor(likelihood);
  const label = getLabel(likelihood);
  const labelBg = getLabelBg(likelihood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-card-bg rounded-2xl border border-border-default overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default">
        <div className="w-6 h-6 rounded-md bg-[#F3903F]/10 flex items-center justify-center">
          <TrendingUp size={13} className="text-[#F3903F]" />
        </div>
        <span className="text-[13px] font-semibold text-text-primary">Approval Likelihood</span>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center pt-4 pb-2 px-4">
        <SemiCircleGauge value={likelihood} color={color} />
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className={`px-3 py-1 rounded-full text-[11px] font-semibold mt-1 ${labelBg}`}
        >
          {label}
        </motion.span>
      </div>

      {/* Contributing factors */}
      <div className="px-4 pb-4 pt-2">
        <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
          Contributing Factors
        </p>
        <div className="flex flex-col gap-1.5">
          {factors.map((factor, i) => (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.7 + i * 0.1 }}
              className="flex items-center gap-2"
            >
              {factor.met ? (
                <CheckCircle size={13} className="text-[#099F69] shrink-0" />
              ) : (
                <XCircle size={13} className="text-[#D02241] shrink-0" />
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
      </div>
    </motion.div>
  );
}
