import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";
import navSvg from "@/assets/icons/nav-icon-paths";

import type { ChatMsg } from "./types";
import { getNow } from "./types";
import { useCaseBuilder } from "./state/case-builder-state";
import type { CaseBuilderAction } from "./state/case-builder-state";
import { findNewCaseEntry, suggestedPrompts, EXTRACTED_PATIENT_DATA } from "./agent-entries";
import { ThinkingIndicator, UserBubble, AgentBubble, NextBestActionCard } from "./chat-components";
import { EHRConsentCard } from "./ehr-consent-card";
import { EHRRedirectOverlay } from "./ehr-redirect-overlay";
import { EHRAgentPanel } from "./ehr-agent-panel";
import { DocumentUploadZone, DocumentCaptureZone } from "./document-zones";
import { CaseSummaryPanel } from "./summary-panel/case-summary-panel";
import { EnhancedChatInput } from "./chat-enhancements/enhanced-chat-input";
import { SmartEmptyState } from "./chat-enhancements/smart-empty-state";

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
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Case builder state
    const { state: caseState, dispatch: caseDispatch, dispatchActions } = useCaseBuilder();
    const showSummaryPanel = caseState.status !== "draft" || Object.keys(caseState.patient).length > 0;

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
      // Dispatch patient data from special content completion (EHR/Upload/Capture)
      dispatchActions([
        {
          type: "SET_PATIENT_FIELDS",
          payload: {
            data: {
              name: "Margaret Thompson",
              dob: "03/15/1958",
              mrn: "NHC-2024-88421",
              phone: "(860) 555-0147",
              address: "1247 Maple Drive, Hartford, CT 06103",
              insurancePayer: "BlueCross BlueShield",
              memberId: "BCB-447821953",
              planType: "PPO Gold",
              referringPhysician: "Dr. Sarah Patel",
            },
            confidence: {
              name: { source: "ehr", confidence: 98, verified: true, needsReview: false },
              dob: { source: "ehr", confidence: 98, verified: true, needsReview: false },
              mrn: { source: "ehr", confidence: 99, verified: true, needsReview: false },
              phone: { source: "ehr", confidence: 95, verified: true, needsReview: false },
              address: { source: "ehr", confidence: 90, verified: false, needsReview: false },
              insurancePayer: { source: "ehr", confidence: 97, verified: true, needsReview: false },
              memberId: { source: "ehr", confidence: 97, verified: true, needsReview: false },
              planType: { source: "ehr", confidence: 95, verified: true, needsReview: false },
              referringPhysician: { source: "ehr", confidence: 96, verified: true, needsReview: false },
            },
          },
        },
        { type: "ADVANCE_STEP", payload: "procedure" },
      ]);
    }, [addAgentMessage, dispatchActions]);

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

        // Dispatch state updates from agent entries
        if (entry.stateUpdates && entry.stateUpdates.length > 0) {
          dispatchActions(entry.stateUpdates);
        }
      }, thinkingDuration);
    }, [dispatchActions]);

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

      <div className="flex-1 min-w-0 flex flex-row h-full overflow-hidden">
        {/* Left column — Chat */}
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
                <SmartEmptyState onSendMessage={sendMessage} />
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
          <EnhancedChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            isTyping={isTyping}
            currentStep={caseState.currentStep}
            inputRef={inputRef}
          />
        </div>

        {/* Right column — Summary Panel */}
        <AnimatePresence>
          {showSummaryPanel && (
            <CaseSummaryPanel state={caseState} dispatch={caseDispatch} />
          )}
        </AnimatePresence>
      </div>
      </>
    );
  }
);
