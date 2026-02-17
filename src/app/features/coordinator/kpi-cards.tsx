import { KpiItem } from "@/app/components/shared/kpi-item";

export function CoordinatorKpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      <div className="border-r border-b border-border-default">
        <KpiItem
          value="24"
          label="My Active Cases"
          change="3.1%"
          changeLabel="Since last Week"
          changeType="up"
          valueColor="#00aeef"
          onAskAgent={onAskAgent ? () => onAskAgent("Show me a breakdown of my 24 active cases — which ones are highest priority and what's the status of each?") : undefined}
        />
      </div>
      <div className="border-r border-b border-border-default">
        <KpiItem
          value="8"
          label="Pending Reviews"
          change="2.0%"
          changeLabel="Since last Week"
          changeType="down"
          valueColor="#f2883f"
          onAskAgent={onAskAgent ? () => onAskAgent("What's the status of my 8 pending reviews? Which ones are closest to their deadline?") : undefined}
        />
      </div>
      <div className="border-b border-border-default">
        <KpiItem
          value="12"
          label="Completed Today"
          change=""
          changeLabel="Processed today"
          changeType="up"
          valueColor="#096"
          barChart
          onAskAgent={onAskAgent ? () => onAskAgent("Give me details on the 12 cases I completed today — any that need follow-up or documentation?") : undefined}
        />
      </div>
      <div className="border-r border-border-default">
        <KpiItem
          value="2.4"
          label="Avg Turnaround (days)"
          change="8.2%"
          changeLabel="Since last Month"
          changeType="up"
          valueColor="#096"
          onAskAgent={onAskAgent ? () => onAskAgent("How does my 2.4 day average turnaround compare to the team? What can I do to improve it?") : undefined}
        />
      </div>
      <div className="border-r border-border-default">
        <KpiItem
          value="3"
          label="Appeals In Progress"
          change="1"
          changeLabel="Filed this week"
          changeType="up"
          valueColor="#ef4444"
          onAskAgent={onAskAgent ? () => onAskAgent("Tell me about the 3 appeals I have in progress — what are the expected outcomes and timelines?") : undefined}
        />
      </div>
      <div>
        <KpiItem
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
