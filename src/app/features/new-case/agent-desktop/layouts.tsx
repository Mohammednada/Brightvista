import { motion } from "motion/react";
import type { AgentSystemType } from "../types";
import { TypeWriter } from "../chat-components";
import { SYSTEM_THEMES } from "./themes";
import { MinimalHeader } from "./chrome";

// ═══════════════════════════════════════════════════════════════════════════════
// ABSTRACT PROCESSING LAYOUT (simplified — no AbstractBackground)
// ═══════════════════════════════════════════════════════════════════════════════

export function AbstractProcessingLayout({ systemType, children }: {
  systemType: AgentSystemType;
  children: React.ReactNode;
}) {
  const theme = SYSTEM_THEMES[systemType];
  return (
    <div className="flex flex-col h-[280px]" style={{ backgroundColor: theme.contentBg }}>
      <MinimalHeader systemType={systemType} />
      <div className="flex-1 relative overflow-hidden">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHONE SMS LAYOUT (Phase 12 — Patient Notify)
// ═══════════════════════════════════════════════════════════════════════════════

export function PhoneSmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-[280px]" style={{ background: "linear-gradient(145deg, #0f0f1e 0%, #1a1a30 50%, #12122a 100%)" }}>
      <div className="relative">
        <div className="absolute -inset-4 rounded-[32px] opacity-20" style={{ background: "radial-gradient(ellipse at center, #4da8da40, transparent 70%)" }} />
        <div className="relative w-[195px] h-[255px] bg-[#1a1a1a] rounded-[26px] p-[3px] shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset" }}>
          <div className="w-full h-full bg-[#000] rounded-[23px] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[56px] h-[14px] bg-[#000] rounded-full z-30" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04)" }}>
              <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#0a0a0a]" style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08) inset" }} />
            </div>

            {/* Status bar */}
            <div className="h-[30px] flex items-center justify-between px-5 pt-[2px] bg-[#f2f2f7]">
              <span className="text-[8px] text-[#1c1c1e] font-semibold" style={{ letterSpacing: "0.3px" }}>9:41</span>
              <div className="flex items-center gap-[3px]">
                <div className="flex items-end gap-[1.5px] h-[10px]">
                  {[4, 6, 8, 10].map((h, i) => (
                    <div key={i} className="w-[2.5px] rounded-[0.5px] bg-[#1c1c1e]" style={{ height: `${h}px` }} />
                  ))}
                </div>
                <svg width="10" height="8" viewBox="0 0 10 8" className="ml-[2px]">
                  <path d="M5 7.5a0.8 0.8 0 1 0 0-1.6 0.8 0.8 0 0 0 0 1.6z" fill="#1c1c1e" />
                  <path d="M2.8 5.2a3.2 3.2 0 0 1 4.4 0" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" fill="none" />
                  <path d="M1.2 3.4a5.6 5.6 0 0 1 7.6 0" stroke="#1c1c1e" strokeWidth="1" strokeLinecap="round" fill="none" />
                </svg>
                <div className="flex items-center ml-[2px]">
                  <div className="w-[16px] h-[8px] rounded-[2px] border border-[#1c1c1e] relative" style={{ borderWidth: "0.8px" }}>
                    <div className="absolute inset-[1px] rounded-[1px] bg-[#1c1c1e]" style={{ width: "calc(100% - 3px)" }} />
                  </div>
                  <div className="w-[1.5px] h-[4px] rounded-r-[1px] bg-[#1c1c1e] ml-[0.5px]" />
                </div>
              </div>
            </div>

            {/* Messages header */}
            <div className="h-[32px] bg-[#f2f2f7] flex items-center justify-center relative" style={{ borderBottom: "0.5px solid #c6c6c8" }}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                  <path d="M6.5 1L1.5 6L6.5 11" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#1c1c1e] font-semibold">NorthStar Health</span>
                <span className="text-[6px] text-[#8e8e93]">SMS</span>
              </div>
            </div>

            {/* SMS content */}
            <div className="bg-[#ffffff] overflow-hidden" style={{ height: "calc(100% - 62px)" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHONE CALL LAYOUT (Voice IVR — active call screen)
// ═══════════════════════════════════════════════════════════════════════════════

export function PhoneCallLayout({ callerName, phoneNumber, status, duration, children }: {
  callerName: string;
  phoneNumber: string;
  status: "dialing" | "ringing" | "connected" | "ended";
  duration?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-[280px]" style={{ background: "linear-gradient(145deg, #002677 0%, #003399 50%, #001f5c 100%)" }}>
      <div className="relative">
        <div className="absolute -inset-4 rounded-[32px] opacity-20" style={{ background: "radial-gradient(ellipse at center, #FF612B40, transparent 70%)" }} />
        <div className="relative w-[195px] h-[255px] bg-[#1a1a1a] rounded-[26px] p-[3px] shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset" }}>
          <div className="w-full h-full bg-[#000] rounded-[23px] overflow-hidden relative">
            {/* Dynamic Island */}
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[56px] h-[14px] bg-[#000] rounded-full z-30" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04)" }}>
              <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#0a0a0a]" style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08) inset" }} />
            </div>

            {/* Call screen */}
            <div className="h-full flex flex-col items-center justify-between py-8" style={{ background: "linear-gradient(180deg, #002677 0%, #001a5c 100%)" }}>
              {/* Caller info */}
              <div className="flex flex-col items-center gap-1 mt-2">
                <span className="text-[13px] text-white font-semibold">{callerName}</span>
                <span className="text-[9px] text-white/60">{phoneNumber}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {status === "dialing" && (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-[8px] text-white/80">
                      Calling...
                    </motion.span>
                  )}
                  {status === "ringing" && (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-[8px] text-[#FF612B] font-medium">
                      Ringing...
                    </motion.span>
                  )}
                  {status === "connected" && (
                    <>
                      <motion.div className="w-[5px] h-[5px] rounded-full bg-[#30d158]" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                      <span className="text-[8px] text-white/80">{duration || "00:00"}</span>
                    </>
                  )}
                  {status === "ended" && (
                    <span className="text-[8px] text-white/60">Call Ended · {duration}</span>
                  )}
                </div>
              </div>

              {/* IVR content area */}
              <div className="w-full flex-1 overflow-hidden mt-3">
                {children}
              </div>

              {/* End call button */}
              <div className="flex items-center justify-center mt-2">
                <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${status === "ended" ? "bg-[#48484a]" : "bg-[#ff3b30]"}`}>
                  <svg width="14" height="6" viewBox="0 0 14 6" fill="none">
                    <path d="M1 3C1 1.5 3.5 0.5 7 0.5C10.5 0.5 13 1.5 13 3V4.5C13 5 12.5 5.5 12 5.5H10.5C10 5.5 9.5 5 9.5 4.5V3.5C9.5 3 8.5 2.5 7 2.5C5.5 2.5 4.5 3 4.5 3.5V4.5C4.5 5 4 5.5 3.5 5.5H2C1.5 5.5 1 5 1 4.5V3Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SMS BUBBLE
// ═══════════════════════════════════════════════════════════════════════════════

export function SmsBubble({ text, type, delay = 0, showDelivered = false, useTypeWriter = false }: {
  text: string;
  type: "sent" | "received";
  delay?: number;
  showDelivered?: boolean;
  useTypeWriter?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 22 }}
      className={`flex flex-col ${type === "sent" ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[82%] px-2.5 py-[6px] ${
          type === "sent"
            ? "bg-[#34c759] text-white rounded-[14px] rounded-br-[4px]"
            : "bg-[#e9e9eb] text-[#1c1c1e] rounded-[14px] rounded-bl-[4px]"
        }`}
      >
        <span className="text-[7.5px] leading-[1.4]" style={{ wordSpacing: "-0.3px" }}>
          {useTypeWriter ? <TypeWriter text={text} speed={18} /> : text}
        </span>
      </div>
      {showDelivered && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 2 }}
          className="text-[5.5px] text-[#8e8e93] mt-[2px] mr-1 font-medium"
        >
          Delivered
        </motion.span>
      )}
    </motion.div>
  );
}
