import { KpiItem } from "@/app/components/shared/kpi-item";
import { managerKpis } from "@/mock/dashboard";

export function KpiCards({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="grid grid-cols-3 grid-rows-2 w-full">
      {managerKpis.map((kpi, i) => {
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
