import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowLeft } from "lucide-react";
import navSvg from "@/assets/icons/nav-icon-paths";

import type { ChatMsg, AgentStepsPhase, OrderCardData } from "./types";
import { getNow } from "./types";
import { useCaseBuilder } from "./state/case-builder-state";
import type { CaseBuilderAction } from "./state/case-builder-state";
import { findNewCaseEntry, suggestedPrompts, EXTRACTED_PATIENT_DATA } from "./agent-entries";
import { ThinkingIndicator, UserBubble, AgentBubble } from "./chat-components";
import { EHRConsentCard } from "./ehr-consent-card";
import { EHRRedirectOverlay } from "./ehr-redirect-overlay";
import { EHRAgentPanel } from "./ehr-agent-panel";
import { DocumentUploadZone, DocumentCaptureZone } from "./document-zones";
import { CaseSummaryPanel } from "./summary-panel/case-summary-panel";
import { EnhancedChatInput } from "./chat-enhancements/enhanced-chat-input";
import { SmartEmptyState } from "./chat-enhancements/smart-empty-state";
import { AgentDesktopPanel } from "./agent-desktop";
import { OrdersCard } from "./orders-card";
import { ReviewCard } from "./review-card";
import { phase1_scanEHR, ehrOrderCards, autonomousPhases, submissionPhasesApi, submissionPhasesVoice, submissionPhasesRpa } from "@/mock/agent-mode-flow";
import { RpaConsentCard } from "./rpa-consent-card";
import type { SubmissionChannel } from "@/shared/types";

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

    // Agent mode state
    const [agentModeActive, setAgentModeActive] = useState(false);
    const [activePhase, setActivePhase] = useState<AgentStepsPhase | null>(null);
    const [waitingForReview, setWaitingForReview] = useState(false);
    const [waitingForRpaConsent, setWaitingForRpaConsent] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<SubmissionChannel | null>(null);
    const currentPhasesRef = useRef<AgentStepsPhase[]>([]);

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
    }, [messages, isTyping, activeSpecialContent, activePhase, scrollToBottom]);

    // Delayed scroll for special content / agent mode that grows over time
    useEffect(() => {
      if (!activeSpecialContent && !activePhase) return;
      const interval = setInterval(scrollToBottom, 500);
      return () => clearInterval(interval);
    }, [activeSpecialContent, activePhase, scrollToBottom]);

    const addAgentMessage = useCallback((
      text: string,
      extras?: {
        nextAction?: { label: string; prompt: string };
        agentStepsPhase?: AgentStepsPhase;
        agentDesktopPhases?: AgentStepsPhase[];
        orderCards?: OrderCardData[];
        reviewCard?: boolean;
        rpaConsentCard?: boolean;
      }
    ) => {
      const msg: ChatMsg = {
        id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: "agent",
        text,
        timestamp: getNow(),
        nextAction: extras?.nextAction,
        agentStepsPhase: extras?.agentStepsPhase,
        agentDesktopPhases: extras?.agentDesktopPhases,
        orderCards: extras?.orderCards,
        reviewCard: extras?.reviewCard,
        rpaConsentCard: extras?.rpaConsentCard,
      };
      setMessages((prev) => [...prev, msg]);
    }, []);

    // ── Agent Mode handlers ─────────────────────────────────────────────────

    const startAgentMode = useCallback(() => {
      setAgentModeActive(true);

      // Add user message
      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: "Agent Mode — Scan EHR for Orders",
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");

      // Start phase 1 using desktop panel
      setTimeout(() => {
        currentPhasesRef.current = [phase1_scanEHR];
        setActivePhase(phase1_scanEHR);
        addAgentMessage("", { agentDesktopPhases: [phase1_scanEHR] });
      }, 400);
    }, [addAgentMessage]);

    const handlePhaseComplete = useCallback((completedPhase: AgentStepsPhase) => {
      // Dispatch state updates from the completed phase
      if (completedPhase.onCompleteActions.length > 0) {
        dispatchActions(completedPhase.onCompleteActions);
      }
      // Advance activePhase to the next phase in the group
      const phases = currentPhasesRef.current;
      const idx = phases.findIndex((p) => p.phaseId === completedPhase.phaseId);
      if (idx >= 0 && idx < phases.length - 1) {
        setActivePhase(phases[idx + 1]);
      }
    }, [dispatchActions]);

    // Called when all phases in a desktop panel instance are done
    const handleDesktopAllComplete = useCallback((lastPhase: AgentStepsPhase) => {
      setActivePhase(null);

      // Determine what to show based on the last phase in the group
      if (lastPhase.phaseId === "scan-ehr") {
        // Phase 1 complete → show order cards
        setTimeout(() => {
          addAgentMessage(lastPhase.followUpMessage!, { orderCards: ehrOrderCards });
        }, 400);
      } else if (lastPhase.phaseId === "fill-form") {
        // Phase 9 complete → show review card
        setTimeout(() => {
          setWaitingForReview(true);
          addAgentMessage(lastPhase.followUpMessage!, { reviewCard: true });
        }, 400);
      } else if (lastPhase.phaseId === "check-status") {
        // Submission complete → show final summary
        setTimeout(() => {
          addAgentMessage(lastPhase.followUpMessage!);
        }, 400);
      }
    }, [addAgentMessage]);

    const handleOrderSelect = useCallback((order: OrderCardData) => {
      // Track the selected order's submission channel
      setSelectedChannel(order.channelType);

      // Add user selection message
      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: `Selected: ${order.patientName} — ${order.procedure}`,
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const channelLabel = order.channelType === "api" ? "X12 278 API" : order.channelType === "voice" ? "Voice/IVR" : "RPA Bot (Portal)";

      // Launch all autonomous phases in a single desktop panel
      setTimeout(() => {
        addAgentMessage(
          `Starting autonomous PA workflow for **${order.patientName}** — ${order.procedure} (CPT ${order.cptCode}).\nDiagnosis: ${order.diagnosis} (${order.icd10Code}). Payer: **${order.payer}** — Submission channel: **${channelLabel}**. I'll handle everything from here.`,
        );
        setTimeout(() => {
          currentPhasesRef.current = autonomousPhases;
          setActivePhase(autonomousPhases[0]);
          addAgentMessage("", { agentDesktopPhases: autonomousPhases });
        }, 600);
      }, 300);
    }, [addAgentMessage]);

    const handleReviewApprove = useCallback(() => {
      setWaitingForReview(false);

      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: "Approved — Submit the PA request",
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Route to the correct submission channel
      if (selectedChannel === "rpa") {
        // RPA requires credential consent before submission
        setTimeout(() => {
          setWaitingForRpaConsent(true);
          addAgentMessage(
            "This order requires **portal automation (RPA)**. I need your authorization to use provider credentials for the Aetna portal before I can submit.",
            { rpaConsentCard: true },
          );
        }, 500);
      } else if (selectedChannel === "voice") {
        setTimeout(() => {
          currentPhasesRef.current = submissionPhasesVoice;
          setActivePhase(submissionPhasesVoice[0]);
          addAgentMessage("", { agentDesktopPhases: submissionPhasesVoice });
        }, 500);
      } else {
        // Default: API
        setTimeout(() => {
          currentPhasesRef.current = submissionPhasesApi;
          setActivePhase(submissionPhasesApi[0]);
          addAgentMessage("", { agentDesktopPhases: submissionPhasesApi });
        }, 500);
      }
    }, [addAgentMessage, selectedChannel]);

    const handleRpaConsent = useCallback(() => {
      setWaitingForRpaConsent(false);

      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: "Authorized — Portal credentials approved",
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Launch RPA submission phases
      setTimeout(() => {
        currentPhasesRef.current = submissionPhasesRpa;
        setActivePhase(submissionPhasesRpa[0]);
        addAgentMessage("", { agentDesktopPhases: submissionPhasesRpa });
      }, 500);
    }, [addAgentMessage]);

    const handleRpaConsentDeny = useCallback(() => {
      setWaitingForRpaConsent(false);

      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: "Denied — Skip portal submission",
        timestamp: getNow(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setTimeout(() => {
        addAgentMessage("Understood — the RPA portal submission was not authorized. This order will need to be submitted manually through the Aetna provider portal.");
      }, 400);
    }, [addAgentMessage]);

    const handleReviewEdit = useCallback(() => {
      setWaitingForReview(false);
      setAgentModeActive(false);
      addAgentMessage(
        "Exiting agent mode. You can now manually edit any fields. When you're ready, type \"submit\" to submit the case or start agent mode again.",
        { nextAction: { label: "Resume Agent Mode", prompt: "__AGENT_MODE__" } },
      );
    }, [addAgentMessage]);

    // ── Standard (non-agent) handlers ───────────────────────────────────────

    const handleSpecialContentComplete = useCallback(() => {
      setActiveSpecialContent(null);
      addAgentMessage(
        EXTRACTED_PATIENT_DATA,
        {
          nextAction: {
            label: "MRI Cervical Spine -- CPT 72141",
            prompt: "The procedure is MRI Cervical Spine, CPT code 72141. Dr. Patel is ordering it for cervical radiculopathy, ICD-10 M54.12.",
          },
        }
      );
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
          nextAction: {
            label: "Enter details manually",
            prompt: "Let's go step by step. The patient is Margaret Thompson, DOB 03/15/1958.",
          },
        }
      );
    }, [addAgentMessage]);

    const handleRedirectComplete = useCallback(() => {
      setShowRedirect(false);
      setActiveSpecialContent("ehr-agent");
    }, []);

    const sendMessage = useCallback((text: string) => {
      if (!text.trim()) return;

      // Handle agent mode trigger
      const lowerText = text.toLowerCase();
      if (lowerText === "__agent_mode__" || lowerText === "agent mode" || lowerText.includes("scan ehr for orders")) {
        startAgentMode();
        return;
      }

      // Handle special action triggers
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

      // Check if entry triggers agent mode
      if (entry.triggerAgentMode) {
        startAgentMode();
        return;
      }

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

        if (entry.stateUpdates && entry.stateUpdates.length > 0) {
          dispatchActions(entry.stateUpdates);
        }
      }, thinkingDuration);
    }, [dispatchActions, startAgentMode]);

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

    // Determine what shows at the bottom of the chat
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
                <p className="text-[16px] text-[#1a1a1a] font-semibold">
                  New Case
                </p>
                {agentModeActive && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] font-semibold text-white bg-brand px-2 py-0.5 rounded-full"
                  >
                    Agent Mode
                  </motion.span>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-[680px] mx-auto px-6 py-6 flex flex-col gap-6">
              {/* Empty state */}
              {showEmptyState && (
                <SmartEmptyState onSendMessage={sendMessage} onStartAgentMode={startAgentMode} />
              )}

              {/* Chat messages */}
              {messages.length > 0 && (
                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {messages.map((msg) => {
                      // User bubble
                      if (msg.role === "user") {
                        return <UserBubble key={msg.id} text={msg.text} time={msg.timestamp} />;
                      }

                      // Desktop panel (multi-phase immersive simulation)
                      if (msg.agentDesktopPhases) {
                        const desktopPhases = msg.agentDesktopPhases;
                        const lastPhaseInGroup = desktopPhases[desktopPhases.length - 1];
                        return (
                          <AgentDesktopPanel
                            key={msg.id}
                            phases={desktopPhases}
                            onPhaseComplete={handlePhaseComplete}
                            onAllComplete={() => handleDesktopAllComplete(lastPhaseInGroup)}
                          />
                        );
                      }

                      // Legacy agent steps phase card (unused but kept for safety)
                      if (msg.agentStepsPhase) {
                        return null;
                      }

                      // Order cards
                      if (msg.orderCards) {
                        return (
                          <motion.div key={msg.id} className="flex flex-col gap-3">
                            <AgentBubble
                              text={msg.text}
                              time={msg.timestamp}
                              onActionSelect={sendMessage}
                            />
                            <OrdersCard orders={msg.orderCards} onSelect={handleOrderSelect} />
                          </motion.div>
                        );
                      }

                      // Review card
                      if (msg.reviewCard) {
                        return (
                          <motion.div key={msg.id} className="flex flex-col gap-3">
                            <AgentBubble
                              text={msg.text}
                              time={msg.timestamp}
                              onActionSelect={sendMessage}
                            />
                            <ReviewCard onApprove={handleReviewApprove} onEdit={handleReviewEdit} />
                          </motion.div>
                        );
                      }

                      // RPA consent card
                      if (msg.rpaConsentCard) {
                        return (
                          <motion.div key={msg.id} className="flex flex-col gap-3">
                            <AgentBubble
                              text={msg.text}
                              time={msg.timestamp}
                              onActionSelect={sendMessage}
                            />
                            <RpaConsentCard onAuthorize={handleRpaConsent} onDeny={handleRpaConsentDeny} />
                          </motion.div>
                        );
                      }

                      // Standard agent bubble
                      return (
                        <AgentBubble
                          key={msg.id}
                          text={msg.text}
                          time={msg.timestamp}
                          actionOptions={msg.actionOptions}
                          onActionSelect={sendMessage}
                        />
                      );
                    })}
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
            isTyping={isTyping || !!activePhase}
            currentStep={caseState.currentStep}
            inputRef={inputRef}
          />
        </div>

        {/* Right column — Summary Panel */}
        <AnimatePresence>
          {showSummaryPanel && (
            <CaseSummaryPanel
              state={caseState}
              dispatch={caseDispatch}
              activePhaseId={activePhase?.phaseId ?? null}
              agentModeActive={agentModeActive}
              selectedChannel={selectedChannel}
            />
          )}
        </AnimatePresence>
      </div>
      </>
    );
  }
);
