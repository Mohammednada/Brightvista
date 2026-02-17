import { Info, AlertTriangle } from "lucide-react";

export function ActiveInsights() {
  const insights = [
    {
      icon: <Info size={16} className="text-[#00AEEF]" />,
      title: "Payer Latency Bypass",
      description:
        "I've rerouted 12 UHC cases to the manual escalation queue to avoid portal delays.",
      bgIcon: "bg-white shadow-sm",
    },
    {
      icon: (
        <AlertTriangle size={16} className="text-[#F3903F]" />
      ),
      title: "Documentation Warning",
      description:
        "6 recent Cardiology referrals are missing medical necessity letters. This will trigger denials.",
      bgIcon: "bg-white shadow-sm",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-text-muted font-bold"
      >
        Active Insights
      </span>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="bg-[#fafafa] rounded-xl border border-[#f5f5f5] p-4"
          >
            <div className="flex gap-3 items-start">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.bgIcon}`}
              >
                {insight.icon}
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p
                  className="text-[14px] leading-[19.5px] text-brand font-bold"
                >
                  {insight.title}
                </p>
                <p
                  className="text-[12px] leading-[1.5] text-[#737373]"
                >
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
