import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { useState } from "react";
import type { KpiItemProps } from "@/shared/types";

export function KpiItem({
  value,
  label,
  change,
  changeLabel,
  changeType,
  valueColor = "#1b2124",
  barChart = false,
  onAskAgent,
}: KpiItemProps) {
  const [hovered, setHovered] = useState(false);
  const isUp = changeType === "up";
  return (
    <div
      className="min-w-0 px-6 pt-4 pb-5 relative cursor-pointer transition-colors duration-150 h-full"
      style={{ backgroundColor: hovered ? "#f7fafc" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-[32px] leading-[48px] tracking-[0.32px] font-semibold"
          style={{
            color: valueColor,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {value}
        </span>
        <span
          className="text-[14px] leading-[18px] text-text-muted truncate max-w-full block font-semibold"
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {barChart ? (
          <BarChartIndicator changeLabel={changeLabel} />
        ) : (
          <>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[12px] leading-[16px] tracking-[-0.06px] font-['Ubuntu',sans-serif] ${
                isUp
                  ? "bg-[#ecfdf5] text-[#096] border border-[#a4f4cf]"
                  : "bg-[#fef2f2] text-[#b91c1c] border border-[#fca5a5]"
              }`}
            >
              {change}
              {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </span>
            <span
              className="text-[12px] leading-[18px] text-text-secondary capitalize font-medium"
            >
              {changeLabel}
            </span>
          </>
        )}
      </div>
      {/* Ask Agent button on hover */}
      {onAskAgent && hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAskAgent();
          }}
          className="absolute bottom-2 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand text-white cursor-pointer transition-all hover:bg-[#163349] shadow-md"
          style={{ animation: "kpi-ask-fade-in 0.15s ease-out" }}
        >
          <Sparkles size={12} />
          <span
            className="text-[11px] leading-[14px] font-semibold"
          >
            Ask Agent
          </span>
        </button>
      )}
      <style>{`
        @keyframes kpi-ask-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function BarChartIndicator({ changeLabel }: { changeLabel: string }) {
  return (
    <>
      <div className="flex items-center gap-[2px] opacity-80 w-[59px]">
        {[20, 11, 2.76, 14, 20, 17, 7.4, 12].map((h, i) => (
          <div
            key={i}
            className="w-[4px] rounded-full bg-[#97a6b4]"
            style={{
              height: `${h}px`,
              opacity: [0.6, 0.6, 0.6, 0.4, 1, 0.6, 0.6, 0.8][i],
            }}
          />
        ))}
      </div>
      <span
        className="text-[12px] leading-[18px] text-text-secondary capitalize font-medium"
      >
        {changeLabel}
      </span>
    </>
  );
}
