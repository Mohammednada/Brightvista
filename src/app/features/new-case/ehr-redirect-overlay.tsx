import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lock } from "lucide-react";
import { redirectPhases, redirectTimings } from "@/mock/new-case";

export function EHRRedirectOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = redirectTimings.map((ms, i) =>
      setTimeout(() => {
        setPhase(i + 1);
        if (i === redirectTimings.length - 1) onComplete();
      }, ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const isLast = phase === redirectPhases.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#0f2440]/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* App icons with connector */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center shadow-xl border border-white/10"
            animate={phase <= 1 ? { scale: [1, 0.95, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles size={22} className="text-white" />
          </motion.div>

          <div className="flex items-center gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor: phase === 0
                    ? ["#4da8da", "#ffffff", "#4da8da"]
                    : phase === 2
                    ? ["#4da8da", "#ffffff", "#4da8da"]
                    : "#4ade80",
                  scale: phase < 3 ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.8,
                  repeat: phase < 3 ? Infinity : 0,
                  delay: phase === 0 ? i * 0.15 : phase === 2 ? (2 - i) * 0.15 : 0,
                }}
              />
            ))}
          </div>

          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4da8da] to-[#1a5fb4] flex items-center justify-center shadow-xl"
            animate={phase >= 1 && phase <= 1 ? { scale: [1, 0.95, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-white text-[14px]" style={{ fontWeight: 800 }}>Epic</span>
          </motion.div>
        </div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className={`text-[14px] font-semibold ${isLast ? "text-[#4ade80]" : "text-white"}`}>
              {redirectPhases[phase].title}
            </span>
            <span className="text-white/50 text-[11px]">
              {redirectPhases[phase].subtitle}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-[240px] h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: isLast ? "#4ade80" : "#4da8da" }}
            animate={{ width: `${((phase + 1) / redirectPhases.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          <Lock size={9} className="text-white/40" />
          <span className="text-[9px] text-white/40">256-bit TLS encrypted</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
