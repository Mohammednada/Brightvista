import { useState } from "react";
import { Info } from "lucide-react";

export function RecommendedAction() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-text-muted font-bold"
      >
        Recommended action
      </span>
      <div className="bg-brand rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#00AEEF]" />
          <span
            className="text-[10px] leading-[15px] tracking-[1px] uppercase text-[#00aeef] font-bold"
          >
            Intervention Needed
          </span>
        </div>
        <p
          className="text-[14px] leading-[24.375px] text-white font-medium"
        >
          Escalate Imaging RFIs older than 48 hours to prevent surgical delays.
        </p>
        <button
          onClick={() => setApproved(!approved)}
          className={`w-full rounded-lg px-2.5 py-1.5 text-center font-['Ubuntu',sans-serif] text-[14px] leading-[20px] text-white cursor-pointer transition-colors font-medium ${
            approved
              ? "bg-[#099f69] hover:bg-[#088a5b]"
              : "bg-[#00aeef] hover:bg-[#009bd6]"
          }`}
        >
          {approved ? "Escalation Approved" : "Approve Escalation"}
        </button>
        <button
          className="w-full bg-[#35556f] rounded-lg px-2.5 py-1.5 text-center font-['Ubuntu',sans-serif] text-[14px] leading-[20px] text-white cursor-pointer hover:bg-[#2d4960] font-medium"
        >
          Explain Why
        </button>
      </div>
    </div>
  );
}
