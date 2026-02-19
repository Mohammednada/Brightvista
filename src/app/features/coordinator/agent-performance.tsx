import { useState, type ReactNode } from "react";
import {
  Send,
  Phone,
  ArrowRight,
  FileText,
  Upload,
  ScanSearch,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { agentActions } from "@/mock/coordinator";

const iconMap: Record<string, ReactNode> = {
  Send: <Send size={15} />,
  Phone: <Phone size={15} />,
  ArrowRight: <ArrowRight size={15} />,
  FileText: <FileText size={15} />,
  Upload: <Upload size={15} />,
  ScanSearch: <ScanSearch size={15} />,
  MessageSquare: <MessageSquare size={15} />,
  RefreshCw: <RefreshCw size={15} />,
};

export function AIAgentPerformance() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="bg-surface-bg flex-1 min-w-0 px-6 py-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            AI Agent Activity
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Actions performed this week
          </p>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {agentActions.map((action, i) => (
          <div
            key={action.channel}
            className="flex-1 min-w-[140px] bg-card-bg rounded-xl border border-border-default p-3.5 flex flex-col gap-3 cursor-pointer transition-all duration-150"
            style={{
              borderColor: hoveredIdx === i ? action.color : "#e5e5e5",
              boxShadow: hoveredIdx === i ? `0 2px 8px ${action.color}18` : "none",
            }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Top: Icon + Count */}
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: action.bgColor, color: action.color }}
              >
                {iconMap[action.iconName]}
              </div>
              <span
                className="text-[20px] leading-[26px] font-bold"
                style={{ color: action.color }}
              >
                {action.count}
              </span>
            </div>

            {/* Channel name */}
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[13px] leading-[18px] text-text-primary font-semibold"
              >
                {action.channel}
              </span>
              <span
                className="text-[11px] leading-[14px] text-[#9caeb8] font-medium"
              >
                {action.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
