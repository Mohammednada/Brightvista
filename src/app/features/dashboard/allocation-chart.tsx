import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { allocationData, allocationMonths } from "@/mock/dashboard";

const total = allocationData.reduce((s, d) => s + d.value, 0);

export function AllocationChart() {
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [monthOpen, setMonthOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setMonthOpen(false));

  return (
    <div className="w-full border-b border-border-default">
      <div className="flex flex-col gap-4 px-6 py-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p
              className="text-[21px] leading-[32px] text-text-primary font-bold"
            >
              Allocation Per Department
            </p>
            <p className="text-[14px] leading-[18px] text-text-secondary">
              Inter - department comparisons
            </p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMonthOpen(!monthOpen)}
              className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]"
            >
              <span
                className="text-[14px] leading-[18px] text-[#111417] font-semibold"
              >
                {selectedMonth}
              </span>
              <ChevronDown size={16} className="text-[#111417]" />
            </button>
            {monthOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-border-default rounded-lg shadow-lg z-20 w-[140px] max-h-[200px] overflow-y-auto">
                {allocationMonths.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setMonthOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-bg cursor-pointer ${
                      m === selectedMonth
                        ? "text-brand bg-[#f0f4f8] font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative" style={{ width: 326, height: 170 }}>
            <PieChart width={326} height={170}>
              <Pie
                data={allocationData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={88}
                outerRadius={155}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={(props: any) => (
                  <Sector
                    {...props}
                    outerRadius={props.outerRadius + 6}
                    fill={props.fill}
                    opacity={1}
                    stroke="white"
                    strokeWidth={2}
                  />
                )}
                onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ cursor: "pointer" }}
              >
                {allocationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex !== null ? (activeIndex === index ? 1 : 0.45) : 0.8}
                    style={{ transition: "opacity 0.2s ease" }}
                  />
                ))}
              </Pie>
            </PieChart>
            {/* Center label */}
            <div className="absolute left-1/2 bottom-0 -translate-x-1/2 border border-white rounded-full w-[130px] h-[65px] flex flex-col items-center justify-center overflow-hidden pointer-events-none">
              <span
                className="text-[16px] leading-[21px] text-text-primary transition-all duration-200 font-bold"
              >
                {activeIndex !== null ? allocationData[activeIndex].value : total}
              </span>
              <span
                className="text-[12px] leading-[18px] text-[#9caeb8] transition-all duration-200 font-medium"
              >
                {activeIndex !== null ? allocationData[activeIndex].name : "Total"}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-start justify-between w-full">
            {[
              [allocationData[0], allocationData[4]],
              [allocationData[1], allocationData[2]],
              [allocationData[3], allocationData[5]],
            ].map((group, gi) => (
              <div key={gi} className="flex flex-col gap-4">
                {group.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-[4px] self-stretch rounded-sm opacity-80"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex flex-col text-[12px] text-text-secondary">
                      <span
                        className="font-medium"
                      >
                        {item.name}
                      </span>
                      <span
                        className="font-bold"
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
