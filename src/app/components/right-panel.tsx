import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  AlertTriangle,
  Info,
  ArrowRight,
  Zap,
} from "lucide-react";
import navSvg from "../../imports/svg-ta501kkcky";
import {
  type ChatMsg,
  matchThinkingSteps,
  matchNextAction,
  matchResponse,
} from "./agent-entries";

// ── Time helper ───────────────────────────────────────────────────────────────

function getNow() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MorningBriefing() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles size={12} className="text-[#1F425F]" />
        <span
          className="font-['Ubuntu_Sans',sans-serif] text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-[#97a6b4]"
          style={{ fontWeight: 700 }}
        >
          Morning Briefing
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[16px] leading-[1.35] text-[#1a1a1a] capitalize"
          style={{ fontWeight: 600 }}
        >
          Everything is Stable, But Imaging Risk is Emerging.
        </p>
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22.75px] text-[#737373]"
          style={{ fontWeight: 500 }}
        >
          Overall authorization flow is healthy. However, I've detected a trend
          in Orthopedic MRI RFIs that may impact next week's surgery schedule.
        </p>
      </div>
    </div>
  );
}

function ActiveInsights() {
  const insights = [
    {
      icon: <Info size={16} className="text-[#00AEEF]" />,
      title: "Payer Latency Bypass",
      description:
        "I've rerouted 12 UHC cases to the manual escalation queue to avoid portal delays.",
      bgIcon: "bg-white shadow-sm",
    },
    {
      icon: (
        <AlertTriangle size={16} className="text-[#F3903F]" />
      ),
      title: "Documentation Warning",
      description:
        "6 recent Cardiology referrals are missing medical necessity letters. This will trigger denials.",
      bgIcon: "bg-white shadow-sm",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <span
        className="font-['Ubuntu_Sans',sans-serif] text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-[#97a6b4]"
        style={{ fontWeight: 700 }}
      >
        Active Insights
      </span>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="bg-[#fafafa] rounded-xl border border-[#f5f5f5] p-4"
          >
            <div className="flex gap-3 items-start">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.bgIcon}`}
              >
                {insight.icon}
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <p
                  className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[19.5px] text-[#1f425f]"
                  style={{ fontWeight: 700 }}
                >
                  {insight.title}
                </p>
                <p
                  className="font-['Ubuntu_Sans',sans-serif] text-[12px] leading-[1.5] text-[#737373]"
                  style={{ fontWeight: 400 }}
                >
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendedAction() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <span
        className="font-['Ubuntu_Sans',sans-serif] text-[11px] leading-[16.5px] tracking-[1.1px] uppercase text-[#97a6b4]"
        style={{ fontWeight: 700 }}
      >
        Recommended action
      </span>
      <div className="bg-[#1f425f] rounded-2xl p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#00AEEF]" />
          <span
            className="font-['Ubuntu_Sans',sans-serif] text-[10px] leading-[15px] tracking-[1px] uppercase text-[#00aeef]"
            style={{ fontWeight: 700 }}
          >
            Intervention Needed
          </span>
        </div>
        <p
          className="font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[24.375px] text-white"
          style={{ fontWeight: 500 }}
        >
          Escalate Imaging RFIs older than 48 hours to prevent surgical delays.
        </p>
        <button
          onClick={() => setApproved(!approved)}
          className={`w-full rounded-lg px-2.5 py-1.5 text-center font-['Ubuntu',sans-serif] text-[14px] leading-[20px] text-white cursor-pointer transition-colors ${
            approved
              ? "bg-[#099f69] hover:bg-[#088a5b]"
              : "bg-[#00aeef] hover:bg-[#009bd6]"
          }`}
          style={{ fontWeight: 500 }}
        >
          {approved ? "Escalation Approved" : "Approve Escalation"}
        </button>
        <button
          className="w-full bg-[#35556f] rounded-lg px-2.5 py-1.5 text-center font-['Ubuntu',sans-serif] text-[14px] leading-[20px] text-white cursor-pointer hover:bg-[#2d4960]"
          style={{ fontWeight: 500 }}
        >
          Explain Why
        </button>
      </div>
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────

function ThinkingIndicator({ steps }: { steps: string[] }) {
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

// ── Chat messages ─────────────────────────────────────────────────────────────

const UserBubble = React.forwardRef<HTMLDivElement, { text: string; time: string }>(
  function UserBubble({ text, time }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-end"
      >
        <div className="flex flex-col items-end gap-1 max-w-[85%]">
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

function FormattedAgentText({ text }: { text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className="flex flex-col gap-2.5 font-['Ubuntu_Sans',sans-serif] text-[14px] leading-[22px] text-[#4d595e]">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const bulletLines = lines.filter((l) => l.trimStart().startsWith("\u2022"));
        const nonBulletLines = lines.filter((l) => !l.trimStart().startsWith("\u2022"));

        // Pure paragraph (no bullets)
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

        // Block with header + bullet list
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
                const content = line.trimStart().replace(/^\u2022\s*/, "");
                const dashMatch = content.match(/^(.+?)\s*[\u2014\u2013]\s*(.+)$/);
                const colonMatch = !dashMatch && content.match(/^(.+?):\s*(.+)$/);

                return (
                  <li key={li} className="flex gap-2 items-start text-[13px] leading-[20px]">
                    <span className="text-[#97a6b4] mt-[2px] shrink-0">{"\u2022"}</span>
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

const AgentBubble = React.forwardRef<HTMLDivElement, { text: string; time: string }>(
  function AgentBubble({ text, time }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-1.5"
      >
        <FormattedAgentText text={text} />
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

function NextBestActionCard({ label, onAction }: { label: string; onAction: () => void }) {
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
    <div className="w-[476px] shrink-0 h-full flex flex-col bg-white">
      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        <MorningBriefing />
        <ActiveInsights />
        <RecommendedAction />

        {/* Chat messages appear below the original content */}
        {messages.length > 0 && (
          <>
            <div className="h-px w-full bg-[#e5e5e5]" />
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
            <div className="h-px w-full bg-[#e5e5e5]" />
            <ThinkingIndicator steps={thinkingSteps} />
          </>
        )}
      </div>

      {/* Chat input */}
      <div className="bg-white border-t border-[#e5e5e5] px-5 py-4">
        <div className="flex items-center bg-white rounded-[14px] border border-[#e5e5e5] shadow-sm overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write anything here..."
            className="flex-1 px-4 py-3 text-[16px] font-['Ubuntu',sans-serif] text-[#1a1a1a] placeholder-[#a5a5a5] outline-none bg-transparent tracking-[-0.25px]"
          />
          <div className="flex items-center gap-0.5 p-2">
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 17.0833 16.2501">
                <path d={navSvg.pee57f00} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d={navSvg.p25344a00} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M1.45833 5.62506H16.4583" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
                <path d="M0.625 10.6251H15.625" stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </svg>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 16.2021 15.3042">
                <path d={navSvg.pe160000} stroke="#565656" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              </svg>
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer">
              <svg className="block size-[18px]" fill="none" viewBox="0 0 17.9249 17.9167">
                <path d={navSvg.pa48ab00} fill="#565656" />
                <path d={navSvg.p921f100} fill="#565656" />
                <path d={navSvg.p2750400} fill="#565656" />
                <path d={navSvg.p91b3380} fill="#565656" />
                <path d={navSvg.p255db200} fill="#565656" />
              </svg>
            </button>
            <div className="w-px h-5 bg-[#e5e5e5] mx-1" />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isTyping}
              className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
                inputValue.trim() && !isTyping
                  ? "bg-[#1F425F] hover:bg-[#2d5a7a]"
                  : "hover:bg-[#f0f2f4]"
              }`}
            >
              <svg className="block size-full" fill="none" viewBox="0 0 32 32">
                <path d={navSvg.p9d83400} fill={inputValue.trim() && !isTyping ? "white" : "#565656"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
