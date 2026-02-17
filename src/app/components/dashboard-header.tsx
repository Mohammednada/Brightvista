import navSvg from "../../imports/svg-ta501kkcky";

interface DashboardHeaderProps {
  isPanelOpen: boolean;
  onTogglePanel: () => void;
}

export function DashboardHeader({ isPanelOpen, onTogglePanel }: DashboardHeaderProps) {
  return (
    <div className="bg-white shrink-0 w-full sticky top-0 z-10 border-b border-[#e5e5e5]">
      <div className="flex items-center justify-between px-4 py-3">
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[16px] text-[#1a1a1a]"
          style={{ fontWeight: 600 }}
        >
          NorthStar Health Center
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 16 19">
              <path d="M0.62517 0.783593V16.0419" stroke="#565656" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
              <path d={navSvg.p21603800} stroke="#565656" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9167 17.9167">
              <path d={navSvg.p2d54b540} fill="#565656" />
              <path d={navSvg.pd18fd00} fill="#565656" />
              <path d={navSvg.p354bc100} fill="#565656" />
              <path d={navSvg.p1ba6040} fill="#565656" />
              <path d={navSvg.p30577c00} fill="#565656" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 20 20">
              <path d={navSvg.p167b9440} fill="#565656" />
              <path d={navSvg.p130f1540} fill="#565656" />
              <path d={navSvg.pff29400} fill="#565656" />
            </svg>
          </button>
          <div className="w-4 h-0 border-t border-[#e5e5e5] rotate-90 mx-1" />
          <button
            onClick={onTogglePanel}
            className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
              isPanelOpen ? "bg-[#e4e8eb]" : "hover:bg-[#f0f2f4]"
            }`}
          >
            <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9167 17.9167">
              <path d={navSvg.p39f7e500} fill={isPanelOpen ? "#1F425F" : "#565656"} />
              <path d={navSvg.p1b36e800} fill={isPanelOpen ? "#1F425F" : "#565656"} />
              <path d={navSvg.p29166a00} fill={isPanelOpen ? "#1F425F" : "#565656"} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}