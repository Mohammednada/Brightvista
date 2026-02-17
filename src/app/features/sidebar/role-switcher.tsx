import { useState, useRef, useEffect } from "react";

const roles = [
  {
    id: "pa-manager",
    label: "PA Manager",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1675526607070-f5cbd71dde92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRvY3RvciUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90JTIwc21pbGV8ZW58MXx8fHwxNzcxMTczNjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "pa-coordinator",
    label: "PA Coordinator",
    name: "James Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1631596577204-53ad0d6e6978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzExNzUwNzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export type RoleId = "pa-manager" | "pa-coordinator";

interface RoleSwitcherProps {
  activeRole: RoleId;
  onRoleChange: (role: RoleId) => void;
}

export function RoleSwitcher({ activeRole, onRoleChange }: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = roles.find((r) => r.id === activeRole)!;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-[36px] h-[36px] flex items-center justify-center rounded-full cursor-pointer p-[2px] ring-2 ring-[#1B2124] hover:ring-[#000000] transition-all"
      >
        <img
          src={current.avatar}
          alt={current.name}
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-full bottom-0 ml-2.5 z-50 w-[220px]">
          <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.12)] border border-border-default py-2 overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2">
              <p
                className="text-[11px] leading-[16px] text-[#9caeb8] uppercase tracking-wider font-semibold"
              >
                Switch Role
              </p>
            </div>

            {/* Role options */}
            {roles.map((role) => {
              const isActive = role.id === activeRole;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id as RoleId);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#f0f5ff]"
                      : "hover:bg-[#f7f8fa]"
                  }`}
                >
                  <div
                    className={`w-[28px] h-[28px] rounded-full shrink-0 overflow-hidden ${
                      isActive ? "ring-2 ring-[#3B82F6]" : ""
                    }`}
                  >
                    <img
                      src={role.avatar}
                      alt={role.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span
                      className={`text-[13px] leading-[18px] text-text-primary truncate w-full text-left${isActive ? " font-semibold" : ""}`}
                    >
                      {role.name}
                    </span>
                    <span
                      className="text-[11px] leading-[16px] text-text-secondary truncate w-full text-left"
                    >
                      {role.label}
                    </span>
                  </div>
                  {isActive && (
                    <svg
                      className="ml-auto shrink-0"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
