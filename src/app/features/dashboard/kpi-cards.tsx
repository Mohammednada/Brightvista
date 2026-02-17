import { KpiItem } from "@/app/components/shared/kpi-item";

export function KpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      {/* Row 1, Col 1 */}
      <div className="border-r border-b border-border-default">
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
      <div className="border-r border-b border-border-default">
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
      <div className="border-b border-border-default">
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
      <div className="border-r border-border-default">
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
      <div className="border-r border-border-default">
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
