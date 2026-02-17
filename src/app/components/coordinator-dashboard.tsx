import { CoordinatorKpiCards } from "./coord-kpi-cards";
import { CoordinatorNeedsAttention } from "./coord-needs-attention";
import { CaseStatusChart } from "./coord-activity-status";
import { AIAgentPerformance } from "./coord-agent-performance";
import { MyCaseQueue } from "./coord-case-queue";
import { CoordinatorHeader } from "./coord-header";

export function CoordinatorMainContent({
  isPanelOpen,
  onTogglePanel,
  onAskAgent,
}: {
  isPanelOpen: boolean;
  onTogglePanel: () => void;
  onAskAgent: (text: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative border-r border-[#e5e5e5]">
      <CoordinatorHeader isPanelOpen={isPanelOpen} onTogglePanel={onTogglePanel} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* KPI Cards */}
        <CoordinatorKpiCards onAskAgent={onAskAgent} />

        <div className="h-px w-full bg-[#e5e5e5]" />

        {/* Action Items */}
        <CoordinatorNeedsAttention onAskAgent={onAskAgent} />

        {/* Case Status Distribution + AI Agent Activity */}
        <div className="flex flex-col w-full border-b border-[#e5e5e5]">
          <CaseStatusChart />
          <div className="border-t border-[#e5e5e5]">
            <AIAgentPerformance />
          </div>
        </div>

        {/* Case Queue */}
        <MyCaseQueue />
      </div>
    </div>
  );
}
