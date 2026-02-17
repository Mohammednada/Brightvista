import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { useState } from "react";

interface KpiItemProps {
  value: string;
  label: string;
  change: string;
  changeLabel: string;
  changeType: "up" | "down";
  valueColor?: string;
  barChart?: boolean;
  onAskAgent?: () => void;
}

function KpiItem({
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
          className="font-['Ubuntu_Sans',sans-serif] text-[32px] leading-[48px] tracking-[0.32px]"
          style={{
            color: valueColor,
            fontWeight: 600,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {value}
        </span>
        <span
          className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#97a6b4] truncate max-w-full block"
          style={{ fontWeight: 600 }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {barChart ? (
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
              className="font-['Ubuntu_Sans',sans-serif] text-[12px] leading-[18px] text-[#4d595e] capitalize"
              style={{ fontWeight: 500 }}
            >
              {changeLabel}
            </span>
          </>
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
              {isUp ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
            </span>
            <span
              className="font-['Ubuntu_Sans',sans-serif] text-[12px] leading-[18px] text-[#4d595e] capitalize"
              style={{ fontWeight: 500 }}
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
          className="absolute bottom-2 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F425F] text-white cursor-pointer transition-all hover:bg-[#163349] shadow-md"
          style={{ animation: "kpi-ask-fade-in 0.15s ease-out" }}
        >
          <Sparkles size={12} />
          <span
            className="font-['Ubuntu_Sans',sans-serif] text-[11px] leading-[14px]"
            style={{ fontWeight: 600 }}
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

export function KpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      {/* Row 1, Col 1 */}
      <div className="border-r border-b border-[#e5e5e5]">
        <KpiItem
          value="1,053"
          label="Total Submissions"
          change="1.2%"
          changeLabel="Since last Month"
          changeType="down"
          onAskAgent={onAskAgent ? () => onAskAgent("Give me a breakdown of our 1,053 total submissions this month — how do they compare to last month and which departments are driving the change?") : undefined}
        />
      </div>
      {/* Row 1, Col 2 */}
      <div className="border-r border-b border-[#e5e5e5]">
        <KpiItem
          value="46"
          label="Open Inquiries"
          change="2.5%"
          changeLabel="Since last Month"
          changeType="up"
          onAskAgent={onAskAgent ? () => onAskAgent("What's the status of our 46 open inquiries? Are any at risk of SLA breach or need immediate attention?") : undefined}
        />
      </div>
      {/* Row 1, Col 3 */}
      <div className="border-b border-[#e5e5e5]">
        <KpiItem
          value="16"
          label="Cases Needs PA"
          change=""
          changeLabel="Now Active Cases"
          changeType="up"
          valueColor="#00aeef"
          barChart
          onAskAgent={onAskAgent ? () => onAskAgent("Tell me about the 16 active cases that currently need prior authorization — which are most urgent and what's blocking them?") : undefined}
        />
      </div>
      {/* Row 2, Col 1 */}
      <div className="border-r border-[#e5e5e5]">
        <KpiItem
          value="87%"
          label="Approval Rate"
          change="4.6%"
          changeLabel="Since last Month"
          changeType="up"
          valueColor="#096"
          onAskAgent={onAskAgent ? () => onAskAgent("Break down our 87% approval rate — which departments are driving it up or down, and what can we do to improve it further?") : undefined}
        />
      </div>
      {/* Row 2, Col 2 */}
      <div className="border-r border-[#e5e5e5]">
        <KpiItem
          value="15"
          label="PA Denials"
          change="4.6%"
          changeLabel="Since last Month"
          changeType="up"
          valueColor="#ef4444"
          onAskAgent={onAskAgent ? () => onAskAgent("Give me a detailed breakdown of the 15 PA denials this month — what's causing them and which departments are most affected?") : undefined}
        />
      </div>
      {/* Row 2, Col 3 */}
      <div>
        <KpiItem
          value="1,247"
          label="EHR Scanned Cases"
          change="86"
          changeLabel="Today"
          changeType="up"
          valueColor="#f2883f"
          onAskAgent={onAskAgent ? () => onAskAgent("Summarize the overall PA volume — we have 1,247 total EHR scanned cases with 86 today. What's the trend and are there any bottlenecks?") : undefined}
        />
      </div>
    </div>
  );
}
