import { CoordinatorKpiCards } from "./kpi-cards";
import { CoordinatorNeedsAttention } from "./needs-attention";
import { CaseStatusChart } from "./activity-status";
import { AIAgentPerformance } from "./agent-performance";
import { MyCaseQueue } from "./case-queue";
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
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative border-r border-border-default">
      <CoordinatorHeader isPanelOpen={isPanelOpen} onTogglePanel={onTogglePanel} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* KPI Cards */}
        <CoordinatorKpiCards onAskAgent={onAskAgent} />

        <div className="h-px w-full bg-border-default" />

        {/* Action Items */}
        <CoordinatorNeedsAttention onAskAgent={onAskAgent} />

        {/* Case Status Distribution + AI Agent Activity */}
        <div className="flex flex-col w-full border-b border-border-default">
          <CaseStatusChart />
          <div className="border-t border-border-default">
            <AIAgentPerformance />
          </div>
        </div>

        {/* Case Queue */}
        <MyCaseQueue />
      </div>
    </div>
  );
}
