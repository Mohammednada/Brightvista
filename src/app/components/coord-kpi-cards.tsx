import { useState } from "react";
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react";

interface CoordKpiItemProps {
  value: string;
  label: string;
  change: string;
  changeLabel: string;
  changeType: "up" | "down";
  valueColor?: string;
  barChart?: boolean;
  onAskAgent?: () => void;
}

function CoordKpiItem({
  value,
  label,
  change,
  changeLabel,
  changeType,
  valueColor = "#1b2124",
  barChart = false,
  onAskAgent,
}: CoordKpiItemProps) {
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
              {[14, 18, 6, 20, 11, 16, 8, 22].map((h, i) => (
                <div
                  key={i}
                  className="w-[4px] rounded-full bg-[#97a6b4]"
                  style={{
                    height: `${h}px`,
                    opacity: [0.6, 0.8, 0.4, 1, 0.6, 0.8, 0.4, 1][i],
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
              {isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
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
      {onAskAgent && hovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAskAgent();
          }}
          className="absolute bottom-2 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F425F] text-white cursor-pointer transition-all hover:bg-[#163349] shadow-md"
          style={{ animation: "coord-kpi-fade 0.15s ease-out" }}
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
        @keyframes coord-kpi-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function CoordinatorKpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      <div className="border-r border-b border-[#e5e5e5]">
        <CoordKpiItem
          value="24"
          label="My Active Cases"
          change="3.1%"
          changeLabel="Since last Week"
          changeType="up"
          valueColor="#00aeef"
          onAskAgent={onAskAgent ? () => onAskAgent("Show me a breakdown of my 24 active cases \u2014 which ones are highest priority and what's the status of each?") : undefined}
        />
      </div>
      <div className="border-r border-b border-[#e5e5e5]">
        <CoordKpiItem
          value="8"
          label="Pending Reviews"
          change="2.0%"
          changeLabel="Since last Week"
          changeType="down"
          valueColor="#f2883f"
          onAskAgent={onAskAgent ? () => onAskAgent("What's the status of my 8 pending reviews? Which ones are closest to their deadline?") : undefined}
        />
      </div>
      <div className="border-b border-[#e5e5e5]">
        <CoordKpiItem
          value="12"
          label="Completed Today"
          change=""
          changeLabel="Processed today"
          changeType="up"
          valueColor="#096"
          barChart
          onAskAgent={onAskAgent ? () => onAskAgent("Give me details on the 12 cases I completed today \u2014 any that need follow-up or documentation?") : undefined}
        />
      </div>
      <div className="border-r border-[#e5e5e5]">
        <CoordKpiItem
          value="2.4"
          label="Avg Turnaround (days)"
          change="8.2%"
          changeLabel="Since last Month"
          changeType="up"
          valueColor="#096"
          onAskAgent={onAskAgent ? () => onAskAgent("How does my 2.4 day average turnaround compare to the team? What can I do to improve it?") : undefined}
        />
      </div>
      <div className="border-r border-[#e5e5e5]">
        <CoordKpiItem
          value="3"
          label="Appeals In Progress"
          change="1"
          changeLabel="Filed this week"
          changeType="up"
          valueColor="#ef4444"
          onAskAgent={onAskAgent ? () => onAskAgent("Tell me about the 3 appeals I have in progress \u2014 what are the expected outcomes and timelines?") : undefined}
        />
      </div>
      <div>
        <CoordKpiItem
          value="7"
          label="Documents Pending"
          change="5"
          changeLabel="Urgent"
          changeType="down"
          valueColor="#f2883f"
          onAskAgent={onAskAgent ? () => onAskAgent("Which of my 7 pending documents are most urgent? What's needed for each?") : undefined}
        />
      </div>
    </div>
  );
}
