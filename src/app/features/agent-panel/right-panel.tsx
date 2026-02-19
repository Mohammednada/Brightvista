import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { AnimatePresence } from "motion/react";
import navSvg from "@/assets/icons/nav-icon-paths";
import {
  type ChatMsg,
  matchThinkingSteps,
  matchNextAction,
  matchResponse,
} from "./agent-entries";
import { getNow } from "@/shared/types";
import { ai } from "@/services/api";
import { MorningBriefing } from "@/app/components/shared/morning-briefing";
import { ActiveInsights } from "@/app/components/shared/active-insights";
import { RecommendedAction } from "@/app/components/shared/recommended-action";
import {
  ThinkingIndicator,
  UserBubble,
  AgentBubble,
  NextBestActionCard,
} from "@/app/components/shared/chat";

// ── Main export ───────────────────────────────────────────────────────────────

export interface RightPanelHandle {
  sendMessage: (text: string) => void;
}

export const RightPanel = forwardRef<RightPanelHandle>(function RightPanel(_, ref) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: getNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setThinkingSteps(matchThinkingSteps(text));
    setIsTyping(true);

    // Try backend AI chat first, fall back to local pattern matching
    ai.chat(text)
      .then((result) => {
        const agentMsg: ChatMsg = {
          id: `a-${Date.now()}`,
          role: "agent",
          text: result.response,
          timestamp: getNow(),
          nextAction: result.next_action || matchNextAction(text),
        };
        setIsTyping(false);
        setThinkingSteps([]);
        setMessages((prev) => [...prev, agentMsg]);
      })
      .catch(() => {
        // Fallback to local pattern matching
        const steps = matchThinkingSteps(text);
        const thinkingDuration = steps.length * 800 + 400;
        setTimeout(() => {
          const agentMsg: ChatMsg = {
            id: `a-${Date.now()}`,
            role: "agent",
            text: matchResponse(text),
            timestamp: getNow(),
            nextAction: matchNextAction(text),
          };
          setIsTyping(false);
          setThinkingSteps([]);
          setMessages((prev) => [...prev, agentMsg]);
        }, thinkingDuration);
      });
  }, []);

  useImperativeHandle(ref, () => ({
    sendMessage,
  }), [sendMessage]);

  const handleSubmit = useCallback(() => {
    sendMessage(inputValue);
    inputRef.current?.focus();
  }, [inputValue, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  // Determine the last agent message's next action (only show when not typing)
  const lastAgentMsg = !isTyping ? [...messages].reverse().find(m => m.role === "agent") : null;
  const showNextAction = lastAgentMsg?.nextAction && !isTyping;

  return (
    <div className="w-[476px] shrink-0 h-full flex flex-col bg-background">
      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        <MorningBriefing />
        <ActiveInsights />
        <RecommendedAction />

        {/* Chat messages appear below the original content */}
        {messages.length > 0 && (
          <>
            <div className="h-px w-full bg-border-default" />
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <UserBubble key={msg.id} text={msg.text} time={msg.timestamp} />
                  ) : (
                    <AgentBubble key={msg.id} text={msg.text} time={msg.timestamp} />
                  ),
                )}
              </AnimatePresence>
              {isTyping && <ThinkingIndicator steps={thinkingSteps} />}
              {showNextAction && lastAgentMsg?.nextAction && (
                <NextBestActionCard
                  label={lastAgentMsg.nextAction.label}
                  onAction={() => sendMessage(lastAgentMsg.nextAction!.prompt)}
                />
              )}
            </div>
          </>
        )}

        {isTyping && messages.length === 0 && (
          <>
            <div className="h-px w-full bg-border-default" />
            <ThinkingIndicator steps={thinkingSteps} />
          </>
        )}
      </div>

      {/* Chat input */}
      <div className="bg-background border-t border-border-default px-5 py-4">
        <div className="flex items-center bg-background rounded-[14px] border border-border-default shadow-sm overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write anything here..."
            className="flex-1 px-4 py-3 text-[16px] font-['Ubuntu',sans-serif] text-text-primary placeholder-text-muted outline-none bg-transparent tracking-[-0.25px]"
          />
          <div className="flex items-center gap-0.5 p-2">
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 17.0833 16.2501">
                <path d={navSvg.pee57f00} stroke="var(--color-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d={navSvg.p25344a00} stroke="var(--color-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M1.45833 5.62506H16.4583" stroke="var(--color-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M0.625 10.6251H15.625" stroke="var(--color-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </svg>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 16.2021 15.3042">
                <path d={navSvg.pe160000} stroke="var(--color-icon-default)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </svg>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-surface-hover cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9249 17.9167">
                <path d={navSvg.pa48ab00} fill="var(--color-icon-default)" />
                <path d={navSvg.p921f100} fill="var(--color-icon-default)" />
                <path d={navSvg.p2750400} fill="var(--color-icon-default)" />
                <path d={navSvg.p91b3380} fill="var(--color-icon-default)" />
                <path d={navSvg.p255db200} fill="var(--color-icon-default)" />
              </svg>
            </button>
            <div className="w-px h-5 bg-border-default mx-1" />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isTyping}
              className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
                inputValue.trim() && !isTyping
                  ? "bg-brand hover:bg-[#2d5a7a]"
                  : "hover:bg-surface-hover"
              }`}
            >
              <svg className="block size-full" fill="none" viewBox="0 0 32 32">
                <path d={navSvg.p9d83400} fill={inputValue.trim() && !isTyping ? "white" : "var(--color-icon-default)"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
