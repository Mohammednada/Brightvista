import { KpiItem } from "@/app/components/shared/kpi-item";
import { managerKpis } from "@/mock/dashboard";
import { useDashboardAnalytics } from "@/hooks/use-api";

export function KpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  const { data } = useDashboardAnalytics();

  // Map backend KPI data to display format, preserving askAgentQuery from mock
  const kpis = data.kpis.map((kpi, i) => ({
    value: kpi.value,
    label: kpi.label,
    change: kpi.change || undefined,
    changeLabel: kpi.change_label || undefined,
    changeType: (kpi.change_type as "up" | "down" | undefined) || undefined,
    valueColor: kpi.value_color || undefined,
    barChart: kpi.bar_chart || undefined,
    askAgentQuery: managerKpis[i]?.askAgentQuery,
  }));

  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      {kpis.map((kpi, i) => {
        const isLastCol = i % 3 === 2;
        const isLastRow = i >= 3;
        const cls = [
          !isLastCol && "border-r",
          !isLastRow && "border-b",
          (!isLastCol || !isLastRow) && "border-border-default",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={kpi.label} className={cls || undefined}>
            <KpiItem
              value={kpi.value}
              label={kpi.label}
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              changeType={kpi.changeType}
              valueColor={kpi.valueColor}
              barChart={kpi.barChart}
              onAskAgent={
                onAskAgent && kpi.askAgentQuery
                  ? () => onAskAgent(kpi.askAgentQuery!)
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}
