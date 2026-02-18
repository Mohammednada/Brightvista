import { motion } from "motion/react";
import type { AgentSystemType } from "../types";
import { SYSTEM_THEMES } from "./themes";

// ═══════════════════════════════════════════════════════════════════════════════
// SLIM DESKTOP CHROME (~62px total chrome)
// ═══════════════════════════════════════════════════════════════════════════════

export function DesktopChrome({ url, children, footer }: {
  url: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[85%] rounded-xl overflow-hidden shadow-sm border border-[#232334]"
    >
      {/* Thin title bar */}
      <div className="bg-[#1a1a2e] px-3 py-1.5 flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-[#555570] truncate font-mono flex-1">{url}</span>
      </div>

      {/* Content — edge to edge */}
      <div className="bg-[#232334] p-0.5">
        <div className="min-h-[280px] relative overflow-hidden">{children}</div>
      </div>

      {/* Footer */}
      {footer}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MINIMAL HEADER (replaces SystemLayout)
// ═══════════════════════════════════════════════════════════════════════════════

export function MinimalHeader({ systemType }: { systemType: AgentSystemType }) {
  const theme = SYSTEM_THEMES[systemType];
  return (
    <div className="h-6 flex items-center gap-2 px-3" style={{ backgroundColor: theme.navBg }}>
      <div
        className="w-4 h-4 rounded flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${theme.logoGradient[0]}, ${theme.logoGradient[1]})` }}
      >
        <span className="text-white text-[5px] font-extrabold">{theme.logo}</span>
      </div>
      <span className="text-white/60 text-[9px] font-medium">{theme.name}</span>
    </div>
  );
}
