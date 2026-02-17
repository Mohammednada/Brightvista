import React, { useState } from "react";
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

interface AgentAction {
  icon: React.ReactNode;
  channel: string;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

const agentActions: AgentAction[] = [
  {
    icon: <Send size={15} />,
    channel: "Through Payer Portal",
    label: "Portal submissions",
    count: 18,
    color: "#3385f0",
    bgColor: "#eaf3fd",
  },
  {
    icon: <Phone size={15} />,
    channel: "Through Voice Calls",
    label: "IVR & live calls to payers",
    count: 7,
    color: "#096",
    bgColor: "#ecfdf5",
  },
  {
    icon: <ArrowRight size={15} />,
    channel: "Through API's",
    label: "Direct API submissions",
    count: 12,
    color: "#00aeef",
    bgColor: "#e8f8fd",
  },
  {
    icon: <FileText size={15} />,
    channel: "Provider Messages",
    label: "Doc update requests sent",
    count: 9,
    color: "#f2883f",
    bgColor: "#fff7ed",
  },
  {
    icon: <Upload size={15} />,
    channel: "Auto-Attach",
    label: "Clinical docs auto-attached",
    count: 14,
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  {
    icon: <ScanSearch size={15} />,
    channel: "Auth Scanning",
    label: "Scanned for authorization",
    count: 22,
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
  {
    icon: <MessageSquare size={15} />,
    channel: "Follow-Ups",
    label: "Automated follow-up messages",
    count: 11,
    color: "#d946ef",
    bgColor: "#fdf4ff",
  },
  {
    icon: <RefreshCw size={15} />,
    channel: "Status Checks",
    label: "Payer status verifications",
    count: 16,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
];

export function AIAgentPerformance() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="bg-[#f7fafc] flex-1 min-w-0 px-6 py-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p
            className="font-['Ubuntu_Sans',sans-serif] text-[21px] leading-[32px] text-[#1b2124]"
            style={{ fontWeight: 700 }}
          >
            AI Agent Activity
          </p>
          <p className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#4d595e]">
            Actions performed this week
          </p>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-4 gap-3">
        {agentActions.map((action, i) => (
          <div
            key={action.channel}
            className="flex-1 min-w-[140px] bg-white rounded-xl border border-[#e5e5e5] p-3.5 flex flex-col gap-3 cursor-pointer transition-all duration-150"
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
                {action.icon}
              </div>
              <span
                className="font-['Ubuntu_Sans',sans-serif] text-[20px] leading-[26px]"
                style={{ fontWeight: 700, color: action.color }}
              >
                {action.count}
              </span>
            </div>

            {/* Channel name */}
            <div className="flex flex-col gap-0.5">
              <span
                className="font-['Ubuntu_Sans',sans-serif] text-[13px] leading-[18px] text-[#1b2124]"
                style={{ fontWeight: 600 }}
              >
                {action.channel}
              </span>
              <span
                className="font-['Ubuntu_Sans',sans-serif] text-[11px] leading-[14px] text-[#9caeb8]"
                style={{ fontWeight: 500 }}
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
