import { useState, type ReactNode } from "react";
import { Upload, Phone, Send, CheckCircle, FileText } from "lucide-react";
import { coordActivities, caseStatusData } from "@/mock/coordinator";

/* ===================== RECENT ACTIVITY TIMELINE ===================== */

const activityIconMap: Record<string, ReactNode> = {
  Upload: <Upload size={16} className="text-[#3385F0]" />,
  Phone: <Phone size={16} className="text-[#3385F0]" />,
  Send: <Send size={16} className="text-[#3385F0]" />,
  CheckCircle: <CheckCircle size={16} className="text-[#3385F0]" />,
  FileText: <FileText size={16} className="text-[#3385F0]" />,
};

export function CoordinatorRecentActivity() {
  return (
    <div className="flex-1 min-w-0 border-l border-border-default px-6 py-5 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[21px] leading-[32px] text-text-primary font-bold">
            My Recent Activity
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Your latest actions and updates
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {coordActivities.map((activity, index) => (
          <div key={index} className="flex gap-4 pb-2">
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-[#eaf3fd] p-2 rounded-full">{activityIconMap[activity.iconName]}</div>
              {index < coordActivities.length - 1 && <div className="w-px flex-1 bg-border-default mt-2 rounded" />}
            </div>
            <div className="flex-1 flex flex-col gap-2 pb-2 min-w-0">
              <div className="h-8 flex items-center">
                <p className="text-[16px] leading-[26px] text-text-primary font-bold">
                  {activity.title}
                </p>
              </div>
              <div className="flex gap-2 items-start text-[14px] leading-[22px]">
                <p className="flex-1 min-w-0 text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap">
                  {activity.description}
                </p>
                <p className="shrink-0 text-[#9caeb8]">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== CASE STATUS DISTRIBUTION ===================== */

const caseStatusTotal = caseStatusData.reduce((s, d) => s + d.value, 0);

export function CaseStatusChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-[21px] leading-[32px] text-text-primary font-bold">
              My Case Status Distribution
            </p>
            <p className="text-[14px] leading-[18px] text-text-secondary">
              Breakdown of your active cases by status
            </p>
          </div>
        </div>

        {/* Individual horizontal bars */}
        <div className="flex flex-col gap-3">
          {caseStatusData.map((item, i) => {
            const pct = Math.round((item.value / caseStatusTotal) * 100);
            return (
              <div
                key={item.name}
                className="flex items-center gap-3 cursor-pointer"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span
                  className="text-[13px] leading-[18px] text-text-secondary shrink-0 font-medium"
                  style={{ width: 100 }}
                >
                  {item.name}
                </span>
                <div className="flex-1 h-[22px] bg-surface-hover rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-300"
                    style={{
                      backgroundColor: item.color,
                      width: `${pct}%`,
                      opacity: activeIndex !== null ? (activeIndex === i ? 1 : 0.45) : 0.8,
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0" style={{ width: 52 }}>
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-bold"
                  >
                    {item.value}
                  </span>
                  <span
                    className="text-[11px] leading-[14px] text-[#9caeb8] font-medium"
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
