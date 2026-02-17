import { MoreHorizontal } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const chartData = [
  { period: "Jan-Feb", onTime: 17, delayed: 11, atRisk: 0 },
  { period: "Mar-Apr", onTime: 12, delayed: 3, atRisk: 5 },
  { period: "May-Jun", onTime: 8, delayed: 3, atRisk: 3 },
  { period: "Jul-Aug", onTime: 15, delayed: 0, atRisk: 3 },
  { period: "Sep-Oct", onTime: 12, delayed: 3, atRisk: 0 },
  { period: "Nov-Dec", onTime: 6, delayed: 3, atRisk: 3 },
];

const legendItems = [
  { color: "#00aeef", label: "On Time" },
  { color: "#f3903f", label: "Delayed" },
  { color: "#ff6467", label: "At Risk" },
];

export function AuthorizationVolume() {
  return (
    <div className="bg-surface-bg w-[373px] shrink-0 px-6 py-5 flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            Authorization Volume
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Real-time submissions tracking
          </p>
        </div>
        <button className="p-2 rounded-lg hover:bg-[#e4e8eb] cursor-pointer">
          <MoreHorizontal size={20} className="text-[#1B2124]" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span
              className="text-[12px] leading-[18px] text-text-secondary capitalize"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px]" style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={chartData} barSize={8} barGap={0}>
            <CartesianGrid
              strokeDasharray=""
              stroke="#C3D3DB"
              strokeOpacity={0.6}
              horizontal
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{
                fontSize: 12,
                fill: "#9caeb8",
                fontFamily: "'Ubuntu Sans', sans-serif",
                fontWeight: 600,
              }}
              angle={-47}
              textAnchor="end"
              height={50}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fill: "#9caeb8",
                fontFamily: "'Ubuntu Sans', sans-serif",
              }}
              axisLine={false}
              tickLine={false}
              width={30}
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "'Ubuntu Sans', sans-serif",
              }}
            />
            <Bar
              dataKey="onTime"
              stackId="a"
              fill="#00aeef"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="delayed"
              stackId="a"
              fill="#f3903f"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="atRisk"
              stackId="a"
              fill="#ff6467"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
