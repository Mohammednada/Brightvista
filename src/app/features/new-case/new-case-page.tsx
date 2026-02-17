import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";
import navSvg from "@/assets/icons/nav-icon-paths";

import type { ChatMsg } from "./types";
import { getNow } from "./types";
import { findNewCaseEntry, suggestedPrompts, EXTRACTED_PATIENT_DATA } from "./agent-entries";
import { ThinkingIndicator, UserBubble, AgentBubble, NextBestActionCard } from "./chat-components";
import { EHRConsentCard } from "./ehr-consent-card";
import { EHRRedirectOverlay } from "./ehr-redirect-overlay";
import { EHRAgentPanel } from "./ehr-agent-panel";
import { DocumentUploadZone, DocumentCaptureZone } from "./document-zones";

// ── Main export ───────────────────────────────────────────────────────────────

export interface NewCasePageHandle {
  sendMessage: (text: string) => void;
}

export const NewCasePage = forwardRef<NewCasePageHandle, { onBack: () => void }>(
  function NewCasePage({ onBack }, ref) {
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
    const [activeSpecialContent, setActiveSpecialContent] = useState<"ehr-consent" | "ehr-agent" | "upload-zone" | "capture-zone" | null>(null);
    const [showRedirect, setShowRedirect] = useState(false);
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
    }, [messages, isTyping, activeSpecialContent, scrollToBottom]);

    // Delayed scroll for special content that grows over time
    useEffect(() => {
      if (!activeSpecialContent) return;
      const interval = setInterval(scrollToBottom, 500);
      return () => clearInterval(interval);
    }, [activeSpecialContent, scrollToBottom]);

    const addAgentMessage = useCallback((text: string, nextAction?: { label: string; prompt: string }) => {
      const msg: ChatMsg = {
        id: `a-${Date.now()}`,
        role: "agent",
        text,
        timestamp: getNow(),
        nextAction,
      };
      setMessages((prev) => [...prev, msg]);
    }, []);

    const handleSpecialContentComplete = useCallback(() => {
      setActiveSpecialContent(null);
      addAgentMessage(
        EXTRACTED_PATIENT_DATA,
        {
          label: "MRI Cervical Spine -- CPT 72141",
          prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
        }
      );
    }, [addAgentMessage]);

    const handleConsentAuthorize = useCallback(() => {
      setActiveSpecialContent(null);
      setShowRedirect(true);
    }, []);

    const handleConsentCancel = useCallback(() => {
      setActiveSpecialContent(null);
      addAgentMessage(
        "No problem \u2014 the EHR connection was not authorized. You can still provide the patient details manually, upload a document, or capture one with your camera.\n\nHow would you like to proceed?",
        {
          label: "Enter details manually",
          prompt: "Let's go step by step. The patient is Margaret Thompson, DOB 03/15/1958.",
        }
      );
    }, [addAgentMessage]);

    const handleRedirectComplete = useCallback(() => {
      setShowRedirect(false);
      setActiveSpecialContent("ehr-agent");
    }, []);

    const sendMessage = useCallback((text: string) => {
      if (!text.trim()) return;

      // Handle special action triggers
      const lowerText = text.toLowerCase();
      const isEHR = lowerText === "__ehr_system__";
      const isUpload = lowerText === "__upload_document__";
      const isCapture = lowerText === "__capture_document__";

      const displayText = isEHR
        ? "Pull patient details from EHR System"
        : isUpload
        ? "Upload document for OCR extraction"
        : isCapture
        ? "Capture document with camera for OCR"
        : text.trim();

      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: displayText,
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");

      if (isEHR || isUpload || isCapture) {
        const entry = findNewCaseEntry(text);
        setThinkingSteps(entry.thinking);
        setIsTyping(true);

        const thinkingDuration = entry.thinking.length * 800 + 400;
        setTimeout(() => {
          setIsTyping(false);
          setThinkingSteps([]);
          if (isEHR) setActiveSpecialContent("ehr-consent");
          else if (isUpload) setActiveSpecialContent("upload-zone");
          else setActiveSpecialContent("capture-zone");
        }, thinkingDuration);
        return;
      }

      const entry = findNewCaseEntry(text);
      setThinkingSteps(entry.thinking);
      setIsTyping(true);

      const thinkingDuration = entry.thinking.length * 800 + 400;
      setTimeout(() => {
        const agentMsg: ChatMsg = {
          id: `a-${Date.now()}`,
          role: "agent",
          text: entry.response,
          timestamp: getNow(),
          nextAction: entry.nextAction,
          actionOptions: entry.actionOptions,
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

    const lastAgentMsg = !isTyping && !activeSpecialContent && !showRedirect ? [...messages].reverse().find(m => m.role === "agent") : null;
    const showNextAction = lastAgentMsg?.nextAction && !isTyping && !activeSpecialContent && !showRedirect;
    const showEmptyState = messages.length === 0 && !isTyping;

    return (
      <>
      {/* Redirect overlay */}
      <AnimatePresence>
        {showRedirect && <EHRRedirectOverlay onComplete={handleRedirectComplete} />}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-white border-r border-border-default">
        {/* Header */}
        <div className="bg-white shrink-0 w-full sticky top-0 z-10 border-b border-border-default">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-[#f0f2f4] cursor-pointer transition-colors"
            >
              <ArrowLeft size={18} className="text-[#565656]" />
            </button>
            <div className="flex items-center gap-2">
              <p
                className="text-[16px] text-[#1a1a1a] font-semibold"
              >
                New Case
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-[680px] mx-auto px-6 py-6 flex flex-col gap-6">
            {/* Empty state */}
            {showEmptyState && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-8 py-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <p
                    className="text-[22px] leading-[30px] text-text-primary font-bold"
                  >
                    Create a New Case
                  </p>
                  <p
                    className="text-[14px] leading-[22px] text-text-secondary text-center max-w-[420px]"
                  >
                    I'll guide you through the prior authorization submission process — from patient lookup to payer submission.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  {suggestedPrompts.map((sp, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
                      onClick={() => sendMessage(sp.prompt)}
                      className="flex items-center gap-3 bg-white border border-border-default rounded-xl px-4 py-3.5 text-left cursor-pointer hover:border-[#1F425F]/30 hover:shadow-sm transition-all group"
                    >
                      <div className="w-8 h-8 bg-surface-bg rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#eef4f8] transition-colors">
                        {sp.icon}
                      </div>
                      <span
                        className="text-[13px] leading-[18px] text-text-primary font-medium"
                      >
                        {sp.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat messages */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) =>
                    msg.role === "user" ? (
                      <UserBubble key={msg.id} text={msg.text} time={msg.timestamp} />
                    ) : (
                      <AgentBubble
                        key={msg.id}
                        text={msg.text}
                        time={msg.timestamp}
                        actionOptions={msg.actionOptions}
                        onActionSelect={sendMessage}
                      />
                    ),
                  )}
                </AnimatePresence>

                {isTyping && <ThinkingIndicator steps={thinkingSteps} />}

                {/* Special content panels */}
                {activeSpecialContent === "ehr-consent" && (
                  <EHRConsentCard onAuthorize={handleConsentAuthorize} onCancel={handleConsentCancel} />
                )}
                {activeSpecialContent === "ehr-agent" && (
                  <EHRAgentPanel onComplete={handleSpecialContentComplete} />
                )}
                {activeSpecialContent === "upload-zone" && (
                  <DocumentUploadZone onComplete={handleSpecialContentComplete} />
                )}
                {activeSpecialContent === "capture-zone" && (
                  <DocumentCaptureZone onComplete={handleSpecialContentComplete} />
                )}

                {showNextAction && lastAgentMsg?.nextAction && (
                  <NextBestActionCard
                    label={lastAgentMsg.nextAction.label}
                    onAction={() => sendMessage(lastAgentMsg.nextAction!.prompt)}
                  />
                )}
              </div>
            )}

            {isTyping && messages.length === 0 && (
              <ThinkingIndicator steps={thinkingSteps} />
            )}
          </div>
        </div>

        {/* Chat input */}
        <div className="bg-white border-t border-border-default px-5 py-4">
          <div className="max-w-[680px] mx-auto">
            <div className="flex items-center bg-white rounded-[14px] border border-border-default shadow-sm overflow-hidden">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the case or ask a question..."
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
                <div className="w-px h-5 bg-border-default mx-1" />
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isTyping}
                  className={`w-8 h-8 flex items-center justify-center rounded-[10px] cursor-pointer transition-colors ${
                    inputValue.trim() && !isTyping
                      ? "bg-brand hover:bg-[#2d5a7a]"
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
      </div>
      </>
    );
  }
);
