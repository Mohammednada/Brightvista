import navSvg from "@/assets/icons/nav-icon-paths";
import { orgName } from "@/mock/shared";

interface DashboardHeaderProps {
  isPanelOpen: boolean;
  onTogglePanel: () => void;
}

export function DashboardHeader({ isPanelOpen, onTogglePanel }: DashboardHeaderProps) {
  return (
    <div className="bg-background shrink-0 w-full sticky top-0 z-10 border-b border-border-default">
      <div className="flex items-center justify-between px-4 h-[56px]">
        <p
          className="text-[16px] text-text-primary font-semibold"
        >
          {orgName}
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 16 19">
              <path d="M0.62517 0.783593V16.0419" stroke="var(--color-icon-default)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
              <path d={navSvg.p21603800} stroke="var(--color-icon-default)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.25" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9167 17.9167">
              <path d={navSvg.p2d54b540} fill="var(--color-icon-default)" />
              <path d={navSvg.pd18fd00} fill="var(--color-icon-default)" />
              <path d={navSvg.p354bc100} fill="var(--color-icon-default)" />
              <path d={navSvg.p1ba6040} fill="var(--color-icon-default)" />
              <path d={navSvg.p30577c00} fill="var(--color-icon-default)" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
            <svg className="block size-[18px]" fill="none" viewBox="0 0 20 20">
              <path d={navSvg.p167b9440} fill="var(--color-icon-default)" />
              <path d={navSvg.p130f1540} fill="var(--color-icon-default)" />
              <path d={navSvg.pff29400} fill="var(--color-icon-default)" />
            </svg>
          </button>
          <div className="w-4 h-0 border-t border-border-default rotate-90 mx-1" />
          <button
            onClick={onTogglePanel}
            className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
              isPanelOpen ? "bg-icon-active-bg" : "hover:bg-surface-hover"
            }`}
          >
            <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9167 17.9167">
              <path d={navSvg.p39f7e500} fill={isPanelOpen ? "var(--color-primary-brand)" : "var(--color-icon-default)"} />
              <path d={navSvg.p1b36e800} fill={isPanelOpen ? "var(--color-primary-brand)" : "var(--color-icon-default)"} />
              <path d={navSvg.p29166a00} fill={isPanelOpen ? "var(--color-primary-brand)" : "var(--color-icon-default)"} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
