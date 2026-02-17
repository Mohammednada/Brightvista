import React, { useState, useEffect, useRef, forwardRef } from "react";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import type { ActionOption } from "./types";

// ── Thinking indicator ────────────────────────────────────────────────────────

export function ThinkingIndicator({ steps }: { steps: string[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 600 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-1.5"
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={i <= currentStep ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {i < currentStep ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="7" fill="#1F425F" />
              <path d="M4 7.2L6 9.2L10 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : i === currentStep ? (
            <motion.div
              className="w-[14px] h-[14px] shrink-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#e0e5e9" strokeWidth="1.5" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#1F425F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          ) : (
            <div className="w-[14px] h-[14px] shrink-0 rounded-full border border-[#e0e5e9]" />
          )}
          <span
            className={`font-['Ubuntu_Sans',sans-serif] text-[12px] leading-[18px] ${
              i <= currentStep ? "text-[#4d595e]" : "text-[#c0c8ce]"
            }`}
            style={{ fontWeight: i === currentStep ? 500 : 400 }}
          >
            {step}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Typewriter component ──────────────────────────────────────────────────────

export function TypeWriter({ text, speed = 40, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const completeRef = useRef(false);

  useEffect(() => {
    let i = 0;
    completeRef.current = false;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (!completeRef.current) {
          completeRef.current = true;
          onComplete?.();
        }
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return <>{displayed}<span className="animate-pulse">|</span></>;
}

// ── Action Options Bar ────────────────────────────────────────────────────────

export function ActionOptionsBar({
  options,
  onSelect,
}: {
  options: ActionOption[];
  onSelect: (prompt: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2 mt-1"
    >
      {options.map((opt, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.15 + i * 0.08 }}
          onClick={() => onSelect(opt.prompt)}
          className="flex items-center gap-2 rounded-full px-3.5 py-2 cursor-pointer hover:shadow-sm transition-all border group"
          style={{ backgroundColor: opt.bgColor, borderColor: opt.borderColor }}
        >
          <span style={{ color: opt.color }}>{opt.icon}</span>
          <span
            className="font-['Ubuntu_Sans',sans-serif] text-[12px]"
            style={{ fontWeight: 500, color: opt.color }}
          >
            {opt.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ── Chat bubbles ─────────────────────────────────────────────────────────────

export function FormattedAgentText({ text }: { text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className="flex flex-col gap-2.5 font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-[#4d595e]">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const bulletLines = lines.filter((l) => l.trimStart().startsWith("*"));
        const nonBulletLines = lines.filter((l) => !l.trimStart().startsWith("*"));

        if (bulletLines.length === 0) {
          const isHeader = lines.length === 1 && lines[0].endsWith(":") && lines[0].length < 60;
          if (isHeader) {
            return (
              <p key={bi} className="text-[#1b2124] text-[13px] tracking-[0.1px] mt-1" style={{ fontWeight: 600 }}>
                {lines[0]}
              </p>
            );
          }
          return (
            <p key={bi} style={{ fontWeight: 400 }}>
              {block}
            </p>
          );
        }

        return (
          <div key={bi} className="flex flex-col gap-1">
            {nonBulletLines.map((line, li) =>
              line.trim() ? (
                <p key={`h-${li}`} className="text-[#1b2124] text-[13px] tracking-[0.1px]" style={{ fontWeight: 600 }}>
                  {line}
                </p>
              ) : null
            )}
            <ul className="flex flex-col gap-1 pl-1">
              {bulletLines.map((line, li) => {
                const content = line.trimStart().replace(/^\*\s*/, "");
                const dashMatch = content.match(/^(.+?)\s*[—–-]{2,}\s*(.+)$/);
                const colonMatch = !dashMatch && content.match(/^(.+?):\s*(.+)$/);

                return (
                  <li key={li} className="flex gap-2 items-start text-[13px] leading-[20px]">
                    <span className="text-[#97a6b4] mt-[2px] shrink-0">&#8226;</span>
                    <span style={{ fontWeight: 400 }}>
                      {dashMatch ? (
                        <>
                          <span className="text-[#1b2124]" style={{ fontWeight: 500 }}>{dashMatch[1]}</span>
                          <span className="text-[#97a6b4] mx-1">{"\u2014"}</span>
                          {dashMatch[2]}
                        </>
                      ) : colonMatch ? (
                        <>
                          <span className="text-[#1b2124]" style={{ fontWeight: 500 }}>{colonMatch[1]}:</span>{" "}
                          {colonMatch[2]}
                        </>
                      ) : (
                        content
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export const UserBubble = forwardRef<HTMLDivElement, { text: string; time: string }>(
  function UserBubble({ text, time }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-end"
      >
        <div className="flex flex-col items-end gap-1 max-w-[75%]">
          <div className="bg-[#1F425F] rounded-2xl rounded-br-md px-4 py-2.5">
            <p
              className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-white"
              style={{ fontWeight: 400 }}
            >
              {text}
            </p>
          </div>
          <span
            className="font-['Ubuntu_Sans',sans-serif] text-[10px] leading-[14px] text-[#c0c8ce] pr-1"
            style={{ fontWeight: 400 }}
          >
            {time}
          </span>
        </div>
      </motion.div>
    );
  }
);

export const AgentBubble = forwardRef<
  HTMLDivElement,
  {
    text: string;
    time: string;
    actionOptions?: ActionOption[];
    onActionSelect?: (prompt: string) => void;
  }
>(
  function AgentBubble({ text, time, actionOptions, onActionSelect }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-1.5 max-w-[85%]"
      >
        {text && <FormattedAgentText text={text} />}
        {actionOptions && actionOptions.length > 0 && onActionSelect && (
          <ActionOptionsBar options={actionOptions} onSelect={onActionSelect} />
        )}
        <span
          className="font-['Ubuntu_Sans',sans-serif] text-[10px] leading-[14px] text-[#c0c8ce]"
          style={{ fontWeight: 400 }}
        >
          {time}
        </span>
      </motion.div>
    );
  }
);

export function NextBestActionCard({ label, onAction }: { label: string; onAction: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      onClick={onAction}
      className="group w-full cursor-pointer"
    >
      <div className="inline-flex items-center gap-1.5 bg-[#f0f7ff] rounded-full border border-[#d6e6f5] px-3 py-1.5 transition-all group-hover:border-[#1F425F]/30 group-hover:shadow-sm">
        <Zap size={12} className="text-[#1F425F] shrink-0" />
        <span
          className="font-['Ubuntu_Sans',sans-serif] text-[13px] leading-[18px] text-[#1F425F]"
          style={{ fontWeight: 500 }}
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
