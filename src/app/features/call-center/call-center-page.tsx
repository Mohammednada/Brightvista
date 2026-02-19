import { useState, useMemo } from "react";
import { callQueueData } from "@/mock/call-center";
import { CallQueuePanel } from "./call-queue-panel";
import { ActiveCallPanel } from "./active-call-panel";
import { PaDetailsPanel } from "./pa-details-panel";

// ── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "queued" | "completed";

// ── Page ─────────────────────────────────────────────────────────────────────

export function CallCenterPage() {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(callQueueData[0]?.id ?? null);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const selectedCall = useMemo(
    () => callQueueData.find((c) => c.id === selectedCallId) ?? null,
    [selectedCallId],
  );

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
      {/* Header — matches DashboardHeader pattern (sticky, border-b) */}
      <div className="bg-white shrink-0 w-full sticky top-0 z-10 border-b border-border-default">
        <div className="flex items-center px-4 h-[56px]">
          <p className="text-[16px] text-[#1a1a1a] font-semibold">Voice Call Center</p>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <CallQueuePanel
          calls={callQueueData}
          selectedCallId={selectedCallId}
          onSelectCall={setSelectedCallId}
          filterTab={filterTab}
          onFilterChange={setFilterTab}
        />
        <div className="flex-1 min-w-0 flex flex-col bg-white border-r border-border-default">
          <ActiveCallPanel call={selectedCall} />
        </div>
        <PaDetailsPanel call={selectedCall} />
      </div>
    </div>
  );
}
