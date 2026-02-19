import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { caseQueueTasks } from "@/mock/coordinator";
import { useCoordinatorAnalytics } from "@/hooks/use-api";

const priorityStyles: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: "bg-[#fef2f2]", text: "text-[#d02241]", border: "border-[#fca5a5]" },
  high: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", border: "border-[#fdba74]" },
  medium: { bg: "bg-[#fefce8]", text: "text-[#a16207]", border: "border-[#fde68a]" },
  low: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]", border: "border-[#bbf7d0]" },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-[#f0f4f8]", text: "text-text-secondary", label: "Pending" },
  "in-review": { bg: "bg-[#eff6ff]", text: "text-[#2563eb]", label: "In Review" },
  "awaiting-docs": { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", label: "Awaiting Docs" },
  approved: { bg: "bg-[#ecfdf5]", text: "text-[#096]", label: "Approved" },
  denied: { bg: "bg-[#fef2f2]", text: "text-[#d02241]", label: "Denied" },
};

export function MyCaseQueue() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useCoordinatorAnalytics();
  const tasks = (data.case_queue.length > 0 ? data.case_queue : caseQueueTasks) as typeof caseQueueTasks;

  return (
    <div className="w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            My Case Queue
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Cases assigned to you for processing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-surface-hover">
            <span
              className="text-[14px] leading-[18px] text-dropdown-text font-semibold"
            >
              Filter
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--color-scrollbar-thumb) transparent" }}>
        <div style={{ minWidth: 780 }}>
          {/* Table Header */}
          <div className="bg-surface-bg rounded-t-lg py-2 px-4">
            <div className="grid grid-cols-[100px_140px_1fr_80px_100px_100px_100px] gap-3 items-center">
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Case ID</span>
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Patient</span>
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Procedure</span>
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Priority</span>
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Status</span>
              <span className="text-[14px] leading-[18px] text-text-primary font-medium">Payer</span>
              <span className="text-[14px] leading-[18px] text-text-primary text-right font-medium">Deadline</span>
            </div>
          </div>

          {/* Table Rows */}
          {tasks.map((task, index) => {
            const ps = priorityStyles[task.priority] || { bg: "bg-[#f0f4f8]", text: "text-text-secondary", border: "border-[#e5e5e5]" };
            const ss = statusStyles[task.status] || { bg: "bg-[#f0f4f8]", text: "text-text-secondary", label: task.status };
            return (
              <div key={task.id}>
                <div className="grid grid-cols-[100px_140px_1fr_80px_100px_100px_100px] gap-3 items-center px-4 py-2.5 hover:bg-surface-hover transition-colors group">
                  <span
                    className="text-[14px] leading-[22px] text-[#3385f0] cursor-pointer hover:underline font-medium"
                  >
                    {task.id}
                  </span>
                  <span className="text-[14px] leading-[22px] text-text-primary truncate">
                    {task.patient}
                  </span>
                  <span className="text-[14px] leading-[22px] text-text-secondary truncate">
                    {task.type}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] leading-[14px] border w-fit ${ps.bg} ${ps.text} ${ps.border} font-semibold`}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] leading-[14px] w-fit ${ss.bg} ${ss.text} font-medium`}
                  >
                    {ss.label}
                  </span>
                  <span className="text-[13px] leading-[22px] text-text-secondary truncate">
                    {task.payer}
                  </span>
                  <span className="text-[13px] leading-[22px] text-text-secondary text-right">
                    {task.deadline}
                  </span>
                </div>
                {index < tasks.length - 1 && <div className="h-px bg-border-default" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-surface-bg rounded-b-lg flex items-center justify-between px-4 py-2">
        <span
          className="text-[12px] leading-[18px] text-text-secondary font-bold"
        >
          6 out of 24
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-icon-active-bg"
          >
            <ChevronLeft size={16} className="text-[#9caeb8]" />
            <span
              className="text-[14px] leading-[18px] text-[#9caeb8] font-semibold"
            >
              Previous
            </span>
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-icon-active-bg"
          >
            <span
              className="text-[14px] leading-[18px] text-[#3385f0] font-semibold"
            >
              Next
            </span>
            <ChevronRight size={16} className="text-[#3385f0]" />
          </button>
        </div>
      </div>
    </div>
  );
}
