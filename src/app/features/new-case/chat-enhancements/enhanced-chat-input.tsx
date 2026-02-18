import React, { useState, useEffect, useRef } from "react";
import navSvg from "@/assets/icons/nav-icon-paths";
import type { StepId } from "../state/case-builder-state";
import { stepSuggestions } from "@/mock/new-case";

// ── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1a1a1a] text-white text-[10px] font-medium rounded-md whitespace-nowrap z-50 pointer-events-none">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1a1a1a]" />
        </div>
      )}
    </div>
  );
}

// ── Enhanced Chat Input ──────────────────────────────────────────────────────

interface EnhancedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  currentStep: StepId;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function EnhancedChatInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  isTyping,
  currentStep,
  inputRef,
}: EnhancedChatInputProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const suggestions = stepSuggestions[currentStep] || [];

  // Auto-resize the textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [value, inputRef]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    // Focus and move cursor to end
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="bg-white border-t border-border-default px-5 py-4">
      <div className="max-w-[680px] mx-auto">
        {/* Input container */}
        <div className="flex items-end bg-white rounded-[14px] border border-border-default shadow-sm overflow-hidden">
          {/* Hidden mirror for measuring */}
          <div ref={mirrorRef} className="sr-only" aria-hidden />

          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Describe the case or ask a question..."
            rows={1}
            className="flex-1 px-4 py-3 text-[16px] font-['Ubuntu',sans-serif] text-[#1a1a1a] placeholder-[#a5a5a5] outline-none bg-transparent tracking-[-0.25px] resize-none overflow-y-auto"
            style={{ maxHeight: 96 }}
          />
          <div className="flex items-center gap-0.5 p-2">
            <Tooltip label="Formatting">
              <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
                <svg className="block size-[18px]" fill="none" viewBox="0 0 17.0833 16.2501">
                  <path d={navSvg.pee57f00} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                  <path d={navSvg.p25344a00} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                  <path d="M1.45833 5.62506H16.4583" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                  <path d="M0.625 10.6251H15.625" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                </svg>
              </button>
            </Tooltip>
            <Tooltip label="Attach file">
              <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
                <svg className="block size-[18px]" fill="none" viewBox="0 0 16.2021 15.3042">
                  <path d={navSvg.pe160000} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                </svg>
              </button>
            </Tooltip>
            <Tooltip label="Quick actions">
              <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
                <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9249 17.9167">
                  <path d={navSvg.pa48ab00} fill="#565656" />
                  <path d={navSvg.p921f100} fill="#565656" />
                  <path d={navSvg.p2750400} fill="#565656" />
                  <path d={navSvg.p91b3380} fill="#565656" />
                  <path d={navSvg.p255db200} fill="#565656" />
                </svg>
              </button>
            </Tooltip>
            <div className="w-px h-5 bg-border-default mx-1" />
            <button
              onClick={onSubmit}
              disabled={!value.trim() || isTyping}
              className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
                value.trim() && !isTyping
                  ? "bg-brand hover:bg-[#2d5a7a]"
                  : "hover:bg-[#f0f2f4]"
              }`}
            >
              <svg className="block size-full" fill="none" viewBox="0 0 32 32">
                <path d={navSvg.p9d83400} fill={value.trim() && !isTyping ? "white" : "#565656"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
