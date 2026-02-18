import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import type { AgentSystemType } from "../types";
import { SYSTEM_THEMES } from "./themes";

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT CURSOR
// ═══════════════════════════════════════════════════════════════════════════════

export function AgentCursor({ x, y, visible = true }: { x: string; y: string; visible?: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, left: x, top: y }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M1 1L1 15.5L5.5 11.5L9 19L12 17.5L8.5 10L14 9.5L1 1Z" fill="var(--color-primary-brand)" stroke="white" strokeWidth="1.2" />
      </svg>
      <motion.div
        className="absolute left-4 top-4 bg-brand rounded-full px-1.5 py-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
      >
        <span className="text-white text-[6px] font-semibold">Agent</span>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AGENT THINKING BAR
// ═══════════════════════════════════════════════════════════════════════════════

export function AgentThinkingBar({ text, phaseIcon }: { text: string; phaseIcon: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 14);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[85%] mb-2"
    >
      <div className="flex items-center gap-2 py-1">
        <motion.div
          className="shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="#e0e0e8" strokeWidth="1.5" />
            <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="text-[13px] text-[#3b3f4a] font-medium leading-snug truncate"
          >
            {displayed}
            {displayed.length < text.length && (
              <span className="text-[#6366f1] animate-pulse">|</span>
            )}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM TRANSITION SCREEN (simplified sizes)
// ═══════════════════════════════════════════════════════════════════════════════

export function SystemTransitionScreen({ fromSystem, toSystem, summaryText }: {
  fromSystem?: AgentSystemType;
  toSystem: AgentSystemType;
  summaryText?: string;
}) {
  const theme = SYSTEM_THEMES[toSystem];
  const connectionSteps = [
    "Resolving endpoint...",
    "TLS 1.3 handshake...",
    "Verifying credentials...",
    "Session established",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = connectionSteps.map((_, i) =>
      setTimeout(() => setStep(i + 1), 400 + i * 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[280px] gap-3" style={{ backgroundColor: theme.navBg }}>
      <motion.div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: `linear-gradient(135deg, ${theme.logoGradient[0]}, ${theme.logoGradient[1]})` }}
        animate={{ boxShadow: [`0 0 20px ${theme.accent}33`, `0 0 40px ${theme.accent}66`, `0 0 20px ${theme.accent}33`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-white font-extrabold" style={{ fontSize: theme.logo.length > 2 ? "7px" : "12px", letterSpacing: "0.5px" }}>
          {theme.logo}
        </span>
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-white/90 text-[13px] font-semibold">{theme.name}</span>
        <span className="text-white/40 text-[10px]">
          {fromSystem ? "Switching systems..." : "Connecting..."}
        </span>
      </div>
      <div className="flex flex-col gap-1 w-[180px]">
        {connectionSteps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={i < step ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {i < step - 1 ? (
              <CheckCircle size={9} className="text-[#4da8da] shrink-0" />
            ) : i === step - 1 ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="shrink-0">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                  <path d="M5 1A4 4 0 0 1 9 5" stroke={theme.accent} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            ) : (
              <div className="w-[9px] h-[9px] shrink-0" />
            )}
            <span className={`text-[8px] ${i < step ? "text-white/60" : "text-white/20"}`}>{s}</span>
          </motion.div>
        ))}
      </div>
      {summaryText && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mt-1 max-w-[240px]"
        >
          <CheckCircle size={9} className="text-white/40 shrink-0" />
          <span className="text-[8px] text-white/50 leading-snug">{summaryText}</span>
        </motion.div>
      )}
    </div>
  );
}
