import { useState } from "react";
import workspaceSvg from "@/assets/icons/workspace-icon-paths";
import navSvg from "@/assets/icons/nav-icon-paths";
// Logo placeholder (original Figma asset not available locally)
const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='16' fill='%231F425F'/%3E%3Cpath d='M12 18l4-8 4 8-4 8z' fill='%2300AEEF'/%3E%3Cpath d='M20 14l4 4-4 4' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E";
import { RoleSwitcher } from "./role-switcher";
import type { RoleId } from "./role-switcher";

// Nav icon SVG definitions using Figma's iconsax paths
function IconAiAdd({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d={navSvg.p14a1ac80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M7 11H15" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M11 15V7" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={navSvg.p13200580} stroke={color} strokeMiterlimit="10" strokeWidth="2" />
    </svg>
  );
}

function IconAiSparkle({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 14.505 14.505">
      <path d={navSvg.p378c1780} stroke={color} strokeMiterlimit="10" strokeWidth="2" />
    </svg>
  );
}

function IconCheckedCircle({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="-0.5 -0.5 22.2 22.2">
      <path d={navSvg.p37fa3c80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={navSvg.p39c28400} stroke={color} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" />
    </svg>
  );
}

function IconSecurityUser({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="-0.5 -0.5 21.2 23">
      <path d={navSvg.p1b692980} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={navSvg.p32bc5d80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d={navSvg.p3094bb00} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconFolder({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 22 22">
      <path d={navSvg.p1920f480} stroke={color} strokeMiterlimit="10" strokeWidth="2" />
      <path d="M7 1H16C18 1 19 2 19 4V5.38" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
    </svg>
  );
}

function IconKey({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="-0.5 -0.5 23 23">
      <path d={navSvg.p25546540} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
      <path d={navSvg.p3f33a100} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" />
      <path d={navSvg.p2f156e00} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconClock({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d={navSvg.p3bce9180} stroke={color} strokeLinecap="square" strokeWidth="2" />
      <path d={navSvg.p145aefe0} stroke={color} strokeLinecap="square" strokeWidth="2" />
    </svg>
  );
}

function IconAiCreateFile({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="-0.5 -0.5 22.5 22.2">
      <path d={navSvg.p10157540} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M11.64 11.4102H16.47" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M9.7 15.2702H16.47" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M10.29 2.10016V7.00016" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d={navSvg.p301bbbc0} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M3.02001 5.88016H6.61001" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

const navItems = [
  { Icon: IconAiAdd, label: "Create" },
  { Icon: IconAiSparkle, label: "AI Dashboard" },
  { Icon: IconCheckedCircle, label: "Approvals" },
  { Icon: IconSecurityUser, label: "Security" },
  { Icon: IconFolder, label: "Documents" },
  { Icon: IconKey, label: "Access" },
  { Icon: IconClock, label: "History" },
  { Icon: IconAiCreateFile, label: "Reports" },
];

// Footer icon SVGs from Figma
function IconLogout({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="0 0 24 24">
      <path d={navSvg.p3dbc0e80} stroke={color} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M10 11.7305H19.2" stroke={color} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M12 19.6709H4V3.6709H12" stroke={color} strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1.5" />
    </svg>
  );
}

function IconSettings({ color }: { color: string }) {
  return (
    <svg className="block size-[20px]" fill="none" viewBox="-0.5 -0.5 22.5 21.4">
      <path d={navSvg.p27a3ec00} fill={color} />
      <path d={navSvg.p9e73100} fill={color} />
    </svg>
  );
}

export function Sidebar({ activeRole, onRoleChange, currentView, onNavigate }: { activeRole: RoleId; onRoleChange: (role: RoleId) => void; currentView?: string; onNavigate?: (view: string) => void }) {
  const [activeIndex, setActiveIndex] = useState(1); // AI Dashboard is active by default

  // When coordinator clicks first icon, navigate to new-case view; index 1 goes back to dashboard
  const handleNavClick = (index: number) => {
    setActiveIndex(index);
    if (activeRole === "pa-coordinator" && onNavigate) {
      if (index === 0) {
        onNavigate("new-case");
      } else {
        onNavigate("dashboard");
      }
    }
  };

  // Sync activeIndex when currentView changes externally (e.g. back button)
  const derivedActiveIndex = activeRole === "pa-coordinator" && currentView === "new-case" ? 0 : activeIndex;

  return (
    <div className="flex flex-col items-center bg-white border-r border-border-default w-[52px] h-full shrink-0">
      {/* Logo */}
      <div className="py-2 flex items-center justify-center">
        <div className="w-[36px] h-[36px] flex items-center justify-center">
          <img src={logoImg} alt="NorthStar Health Center" width={36} height={36} className="object-contain" />
        </div>
      </div>

      <div className="w-[37px] h-px bg-border-default my-1" />

      {/* Nav icons */}
      <div className="flex flex-col items-center gap-0.5 px-2 flex-1 pt-2">
        {navItems.map((item, index) => (
          <SidebarTooltip key={item.label} label={activeRole === "pa-coordinator" && index === 0 ? "New Case" : item.label}>
            <button
              onClick={() => handleNavClick(index)}
              className={`relative w-[36px] h-[36px] flex items-center justify-center rounded-[10px] transition-colors cursor-pointer ${
                derivedActiveIndex === index
                  ? "bg-[#e4e8eb]"
                  : "hover:bg-[#f0f2f4]"
              }`}
            >
              <item.Icon
                color={derivedActiveIndex === index ? "#1F425F" : "#565656"}
              />
            </button>
          </SidebarTooltip>
        ))}

        <div className="w-[37px] h-px bg-border-default my-1" />

        {/* Workspace icons */}
        <div className="flex flex-col gap-1 items-center relative">
          <SidebarTooltip label="Workspace">
            <div className="p-[6px] flex items-center justify-center rounded-[14px] relative cursor-pointer">
              <svg className="block size-[24px]" fill="none" viewBox="0 0 24 24">
                <path clipRule="evenodd" d={workspaceSvg.p16e20a00} fill="#3B82F6" fillRule="evenodd" />
              </svg>
            </div>
          </SidebarTooltip>
          <SidebarTooltip label="Add Workspace">
            <div className="flex items-center justify-center p-[4px] rounded-[6px] relative cursor-pointer hover:bg-[#f5f5f5]">
              <div className="absolute border border-border-default inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
              <svg className="block size-[16px]" fill="none" viewBox="0 0 16 16">
                <path d={workspaceSvg.p1b9e1d40} fill="#767676" />
              </svg>
            </div>
          </SidebarTooltip>
          <div className="absolute bg-[#3b82f6] h-[24px] left-[-6px] rounded-[7px] top-[6px] w-[4px]" />
        </div>
      </div>

      <div className="w-[37px] h-px bg-border-default my-1" />

      {/* Footer */}
      <div className="flex flex-col items-center py-2 gap-0.5 mt-auto">
        <SidebarTooltip label="Log Out">
          <button className="w-[36px] h-[36px] flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
            <IconLogout color="#1F425F" />
          </button>
        </SidebarTooltip>
        <SidebarTooltip label="Settings">
          <button className="w-[36px] h-[36px] flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
            <IconSettings color="#1F425F" />
          </button>
        </SidebarTooltip>
        <div className="h-3" />
        <RoleSwitcher activeRole={activeRole} onRoleChange={onRoleChange} />
      </div>
    </div>
  );
}

function SidebarTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 pointer-events-none">
          <div className="relative flex items-center">
            <div className="absolute -left-[4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[#1b2124]" />
            <div className="bg-[#1b2124] text-white rounded-md px-2.5 py-1 whitespace-nowrap shadow-lg">
              <span
                className="text-[12px] leading-[16px] font-medium"
              >
                {label}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
