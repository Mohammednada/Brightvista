import { useState, useRef } from "react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import {
  Phone,
  Store,
  HelpCircle,
  Tag,
  ChevronDown,
} from "lucide-react";

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  isLast?: boolean;
}

function TimelineItem({
  icon,
  title,
  description,
  time,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="flex gap-4 pb-2">
      {/* Timeline icon */}
      <div className="flex flex-col items-center shrink-0">
        <div className="bg-[#eaf3fd] p-2 rounded-full">{icon}</div>
        {!isLast && (
          <div className="w-px flex-1 bg-border-default mt-2 rounded" />
        )}
      </div>
      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 pb-2 min-w-0">
        <div className="h-8 flex items-center">
          <p
            className="text-[16px] leading-[26px] text-text-primary font-bold"
          >
            {title}
          </p>
        </div>
        <div className="flex gap-2 items-start text-[14px] leading-[22px]">
          <p className="flex-1 min-w-0 text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap">
            {description}
          </p>
          <p className="shrink-0 text-[#9caeb8]">{time}</p>
        </div>
      </div>
    </div>
  );
}

const activities = [
  {
    icon: <Phone size={16} className="text-[#3385F0]" />,
    title: "Outbound Payer Follow-Up Initiated",
    description:
      "The agent initiated an outbound call to the payer to...",
    time: "Today · 9:12 AM",
  },
  {
    icon: <Store size={16} className="text-[#3385F0]" />,
    title: "RFI Response Packet Submitted",
    description:
      "The agent compiled and submitted additional clini...",
    time: "Today · 10:04 AM",
  },
  {
    icon: <HelpCircle size={16} className="text-[#3385F0]" />,
    title: "Appeal Prepared and Filed",
    description:
      "The agent prepared an appeal packet for a deni...",
    time: "Yesterday · 4:38 PM",
  },
  {
    icon: <Tag size={16} className="text-[#3385F0]" />,
    title: "Escalation Triggered for SLA Risk",
    description:
      "The agent escalated 3 Imaging prior authorizati...",
    time: "Yesterday · 2:15 PM",
  },
  {
    icon: <Tag size={16} className="text-[#3385F0]" />,
    title: "Proactive Documentation Rule Applied",
    description:
      "Based on recent denial patterns, the agent en...",
    time: "Yesterday · 11:42 AM",
  },
];

export function AgentActivities() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  return (
    <div className="flex-1 min-w-0 border-l border-border-default px-6 py-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            Agent Activities
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Details on agent daily activities
          </p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]"
          >
            <span
              className="text-[14px] leading-[18px] text-[#111417] font-semibold"
            >
              {timeRange}
            </span>
            <ChevronDown size={16} className="text-[#111417]" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-border-default rounded-lg shadow-lg z-20 w-[140px]">
              {["Last 7 Days", "Last 30 Days", "Last 90 Days"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setTimeRange(r);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-bg cursor-pointer ${
                    r === timeRange
                      ? "text-brand bg-[#f0f4f8] font-semibold"
                      : "text-text-secondary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden">
        {activities.map((activity, index) => (
          <TimelineItem
            key={index}
            {...activity}
            isLast={index === activities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
