import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TaskItem {
  id: string;
  patient: string;
  type: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "pending" | "in-review" | "awaiting-docs" | "approved" | "denied";
  payer: string;
  deadline: string;
  department: string;
}

const myTasks: TaskItem[] = [
  {
    id: "PA-2024-1847",
    patient: "Margaret Thompson",
    type: "MRI - Lumbar Spine",
    priority: "urgent",
    status: "awaiting-docs",
    payer: "BlueCross BlueShield",
    deadline: "Feb 16, 2026",
    department: "Orthopedics",
  },
  {
    id: "PA-2024-1852",
    patient: "Robert Chen",
    type: "CT Scan - Chest",
    priority: "high",
    status: "in-review",
    payer: "Aetna",
    deadline: "Feb 17, 2026",
    department: "Oncology",
  },
  {
    id: "PA-2024-1839",
    patient: "Lisa Rodriguez",
    type: "Cardiac Catheterization",
    priority: "high",
    status: "pending",
    payer: "United Healthcare",
    deadline: "Feb 18, 2026",
    department: "Cardiology",
  },
  {
    id: "PA-2024-1861",
    patient: "James Wilson",
    type: "Physical Therapy - 12 Sessions",
    priority: "medium",
    status: "in-review",
    payer: "Cigna",
    deadline: "Feb 19, 2026",
    department: "Orthopedics",
  },
  {
    id: "PA-2024-1855",
    patient: "Patricia Davis",
    type: "Nerve Block Injection",
    priority: "medium",
    status: "pending",
    payer: "Humana",
    deadline: "Feb 20, 2026",
    department: "Neurology",
  },
  {
    id: "PA-2024-1868",
    patient: "David Kim",
    type: "Dermatology Biopsy",
    priority: "low",
    status: "approved",
    payer: "Kaiser Permanente",
    deadline: "Feb 22, 2026",
    department: "Dermatology",
  },
];

const priorityStyles: Record<string, { bg: string; text: string; border: string }> = {
  urgent: { bg: "bg-[#fef2f2]", text: "text-[#d02241]", border: "border-[#fca5a5]" },
  high: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", border: "border-[#fdba74]" },
  medium: { bg: "bg-[#fefce8]", text: "text-[#a16207]", border: "border-[#fde68a]" },
  low: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]", border: "border-[#bbf7d0]" },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-[#f0f4f8]", text: "text-[#4d595e]", label: "Pending" },
  "in-review": { bg: "bg-[#eff6ff]", text: "text-[#2563eb]", label: "In Review" },
  "awaiting-docs": { bg: "bg-[#fff7ed]", text: "text-[#c2410c]", label: "Awaiting Docs" },
  approved: { bg: "bg-[#ecfdf5]", text: "text-[#096]", label: "Approved" },
  denied: { bg: "bg-[#fef2f2]", text: "text-[#d02241]", label: "Denied" },
};

export function MyCaseQueue() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <p
            className="font-['Ubuntu_Sans',sans-serif] text-[21px] leading-[32px] text-[#1b2124]"
            style={{ fontWeight: 700 }}
          >
            My Case Queue
          </p>
          <p className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#4d595e]">
            Cases assigned to you for processing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#ebf2f5] rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]">
            <span
              className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#111417]"
              style={{ fontWeight: 600 }}
            >
              Filter
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#c4cdd5 transparent" }}>
        <div style={{ minWidth: 780 }}>
          {/* Table Header */}
          <div className="bg-[#f7fafc] rounded-t-lg py-2 px-4">
            <div className="grid grid-cols-[100px_140px_1fr_80px_100px_100px_100px] gap-3 items-center">
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Case ID</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Patient</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Procedure</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Priority</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Status</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124]" style={{ fontWeight: 500 }}>Payer</span>
              <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#1b2124] text-right" style={{ fontWeight: 500 }}>Deadline</span>
            </div>
          </div>

          {/* Table Rows */}
          {myTasks.map((task, index) => {
            const ps = priorityStyles[task.priority];
            const ss = statusStyles[task.status];
            return (
              <div key={task.id}>
                <div className="grid grid-cols-[100px_140px_1fr_80px_100px_100px_100px] gap-3 items-center px-4 py-2.5 hover:bg-[#fafbfc] transition-colors group">
                  <span
                    className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-[#3385f0] cursor-pointer hover:underline"
                    style={{ fontWeight: 500 }}
                  >
                    {task.id}
                  </span>
                  <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-[#1b2124] truncate">
                    {task.patient}
                  </span>
                  <span className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-[#4d595e] truncate">
                    {task.type}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] leading-[14px] border w-fit ${ps.bg} ${ps.text} ${ps.border}`}
                    style={{ fontWeight: 600 }}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] leading-[14px] w-fit ${ss.bg} ${ss.text}`}
                    style={{ fontWeight: 500 }}
                  >
                    {ss.label}
                  </span>
                  <span className="font-['Ubuntu_Sans',sans-serif] text-[13px] leading-[22px] text-[#4d595e] truncate">
                    {task.payer}
                  </span>
                  <span className="font-['Ubuntu_Sans',sans-serif] text-[13px] leading-[22px] text-[#4d595e] text-right">
                    {task.deadline}
                  </span>
                </div>
                {index < myTasks.length - 1 && <div className="h-px bg-[#e5e5e5]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f7fafc] rounded-b-lg flex items-center justify-between px-4 py-2">
        <span
          className="font-['Ubuntu_Sans',sans-serif] text-[12px] leading-[18px] text-[#4d595e]"
          style={{ fontWeight: 700 }}
        >
          6 out of 24
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-[#e4e8eb]"
          >
            <ChevronLeft size={16} className="text-[#9caeb8]" />
            <span
              className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#9caeb8]"
              style={{ fontWeight: 600 }}
            >
              Previous
            </span>
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-[#e4e8eb]"
          >
            <span
              className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[18px] text-[#3385f0]"
              style={{ fontWeight: 600 }}
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
