import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { CheckCircle } from "lucide-react";
import { TypeWriter } from "../chat-components";

// Stable progressive reveal hook — survives React strict mode double-mount
function useProgressiveReveal(count: number, delayStart: number, interval: number) {
  const [visible, setVisible] = useState(0);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  useEffect(() => {
    // If we already started (strict mode re-mount), skip
    if (started.current) return;
    started.current = true;

    timerIds.current = Array.from({ length: count }, (_, i) =>
      setTimeout(() => setVisible(prev => Math.max(prev, i + 1)), delayStart + i * interval)
    );

    return () => {
      timerIds.current.forEach(clearTimeout);
    };
  }, []);

  return visible;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED FIELDS (replaces AnimatedFieldGrid — clean vertical text)
// ═══════════════════════════════════════════════════════════════════════════════

export function AnimatedFields({ fields, delayStart = 300 }: {
  fields: { label: string; value: string }[];
  delayStart?: number;
}) {
  const visible = useProgressiveReveal(fields.length, delayStart, 600);

  return (
    <div className="flex flex-col gap-2">
      {fields.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={i < visible ? { opacity: 1, y: 0 } : {}}
          className="flex items-baseline justify-between"
        >
          <span className="text-[9px] text-[#8b95a5] w-[90px] shrink-0">{f.label}</span>
          <span className="text-[11px] text-[#1a2a3d] font-medium flex-1">
            {i < visible ? f.value : ""}
          </span>
          {i < visible && <CheckCircle size={10} className="text-[#1F425F] shrink-0 ml-2" />}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED LIST (replaces AnimatedTable — simple text rows)
// ═══════════════════════════════════════════════════════════════════════════════

export function AnimatedList({ items, delayStart = 300 }: {
  items: { text: string; detail?: string }[];
  delayStart?: number;
}) {
  const visible = useProgressiveReveal(items.length, delayStart, 500);

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={i < visible ? { opacity: 1, x: 0 } : {}}
          className="flex items-center gap-2"
        >
          {i < visible ? (
            <CheckCircle size={10} className="text-[#1F425F] shrink-0" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full border border-[#d0d5dd] shrink-0" />
          )}
          <span className={`text-[10px] ${i < visible ? "text-[#1a2a3d]" : "text-[#b0b8c4]"}`}>
            {item.text}
          </span>
          {item.detail && i < visible && (
            <span className="text-[8px] text-[#8b95a5] ml-auto">{item.detail}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY STEPS (spinner → checkmark progressive steps with label + detail)
// ═══════════════════════════════════════════════════════════════════════════════

export function ActivitySteps({ steps, delayPerStep = 1800, doneMessage }: {
  steps: { label: string; detail: string }[];
  delayPerStep?: number;
  doneMessage?: string;
}) {
  const [activeStep, setActiveStep] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveStep(i), 600 + i * delayPerStep)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      {steps.map((s, i) => {
        const isDone = activeStep > i;
        const isActive = activeStep === i;
        const isPending = activeStep < i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: activeStep >= i ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2.5"
          >
            <div className="mt-0.5 shrink-0">
              {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                  <CheckCircle size={11} className="text-[#1F425F]" />
                </motion.div>
              ) : isActive ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#e2e8f0" strokeWidth="1.5" />
                    <path d="M6 1A5 5 0 0 1 11 6" stroke="#1F425F" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ) : (
                <div className="w-[11px] h-[11px] rounded-full border border-[#d0d5dd]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] block ${isDone ? "text-[#1a2a3d] font-medium" : isActive ? "text-[#1a2a3d] font-medium" : "text-[#b0b8c4]"}`}>
                {s.label}
              </span>
              <span className={`text-[8px] ${isDone || isActive ? "text-[#8b95a5]" : "text-[#c8ced6]"}`}>
                {s.detail}
              </span>
            </div>
          </motion.div>
        );
      })}
      {doneMessage && activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mt-1"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1F425F" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span className="text-[8px] text-[#1F425F] font-medium">{doneMessage}</span>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FORM AUTO FILL (borderless — clean label + typed value)
// ═══════════════════════════════════════════════════════════════════════════════

export function getFormFillSpeed(value: string): number {
  if (value.length <= 15) return 30;
  if (value.length <= 40) return 55;
  return 40;
}

export function FormAutoFill({ fields, delayStart = 400 }: {
  fields: { label: string; value: string }[];
  delayStart?: number;
}) {
  const [activeField, setActiveField] = useState(-1);
  const [completedFields, setCompletedFields] = useState<number[]>([]);

  useEffect(() => {
    let cumDelay = delayStart;
    const timers: ReturnType<typeof setTimeout>[] = [];
    fields.forEach((f, i) => {
      const speed = getFormFillSpeed(f.value);
      timers.push(setTimeout(() => setActiveField(i), cumDelay));
      const typeDuration = f.value.length * speed + 500;
      cumDelay += typeDuration;
      timers.push(setTimeout(() => {
        setCompletedFields(prev => [...prev, i]);
        setActiveField(-1);
      }, cumDelay));
      cumDelay += 400;
    });
    return () => timers.forEach(clearTimeout);
  }, [fields, delayStart]);

  return (
    <div className="flex flex-col gap-2.5 p-4">
      {fields.map((f, i) => {
        const isActive = activeField === i;
        const isDone = completedFields.includes(i);
        return (
          <div key={i}>
            <span className="text-[8px] text-[#8b95a5] block mb-0.5">{f.label}</span>
            <div className="flex items-center gap-2">
              {isDone && <CheckCircle size={9} className="text-[#1F425F] shrink-0" />}
              <span className={`text-[11px] ${isDone ? "text-[#1a2a3d] font-medium" : isActive ? "text-[#1a2a3d]" : "text-[#c8ced6]"}`}>
                {isActive ? (
                  <TypeWriter text={f.value} speed={getFormFillSpeed(f.value)} />
                ) : isDone ? (
                  f.value
                ) : (
                  "\u2014"
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL OUTPUT (kept as-is — already fits minimal aesthetic)
// ═══════════════════════════════════════════════════════════════════════════════

export function TerminalOutput({ lines, delayStart = 400 }: {
  lines: { text: string; type: "command" | "output" | "success" | "info" | "thinking" }[];
  delayStart?: number;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  useEffect(() => {
    let cumDelay = delayStart;
    const timers = lines.map((line, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), cumDelay);
      cumDelay += line.type === "thinking" ? 1400 : line.type === "command" ? 900 : 700;
      return t;
    });
    return () => timers.forEach(clearTimeout);
  }, [lines, delayStart]);

  const getLineStyle = (type: string) => {
    switch (type) {
      case "command": return "text-[#58a6ff]";
      case "success": return "text-[#4da8da]";
      case "info": return "text-[#8b949e]";
      case "thinking": return "text-[#d2a8ff]";
      default: return "text-[#c9d1d9]";
    }
  };

  const getPrefix = (type: string) => {
    switch (type) {
      case "command": return "$ ";
      case "success": return "\u2713 ";
      case "thinking": return "\u25D0 ";
      case "info": return "  ";
      default: return "  ";
    }
  };

  return (
    <div className="font-mono text-[10px] leading-[18px] p-3">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={i < visibleLines ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={getLineStyle(line.type)}
        >
          <span className="opacity-60">{getPrefix(line.type)}</span>
          {line.type === "thinking" && i === visibleLines - 1 ? (
            <span>
              {line.text}
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>...</motion.span>
            </span>
          ) : (
            line.text
          )}
        </motion.div>
      ))}
      {visibleLines < lines.length && (
        <motion.span
          className="text-[#58a6ff] inline-block"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >{"\u258B"}</motion.span>
      )}
    </div>
  );
}
