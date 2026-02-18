import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import type { AgentStepsPhase } from "../types";
import { DesktopChrome } from "./chrome";
import { AgentThinkingBar } from "./shared";
import { PhaseScreenRenderer } from "./screens";

// ═══════════════════════════════════════════════════════════════════════════════
// ELAPSED TIME HOOK
// ═══════════════════════════════════════════════════════════════════════════════

function useElapsedTime() {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsed(Date.now() - startRef.current), 1000);
    return () => clearInterval(timer);
  }, []);
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPACT FOOTER — single 30px row with thin progress line
// ═══════════════════════════════════════════════════════════════════════════════

function CompactFooter({
  progress,
  isDone,
  phaseTitle,
  currentPhaseIndex,
  totalPhases,
  elapsedTime,
}: {
  progress: number;
  isDone: boolean;
  phaseTitle: string;
  currentPhaseIndex: number;
  totalPhases: number;
  elapsedTime: string;
}) {
  return (
    <div className="bg-[#1a1a2e]">
      {/* Thin progress line */}
      <div className="h-[2px] bg-[#232334]">
        <motion.div
          className="h-full bg-[#818cf8]"
          animate={{ width: `${isDone ? 100 : progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Single info row */}
      <div className="px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDone ? (
            <CheckCircle size={10} className="text-[#4da8da]" />
          ) : (
            <motion.div
              className="shrink-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="#444460" strokeWidth="1.5" />
                <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
          <span className="text-[10px] text-[#808098] truncate">
            {isDone ? "All phases complete" : phaseTitle}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-[#555570] font-mono">
          <span>{currentPhaseIndex + 1}/{totalPhases}</span>
          <span>{elapsedTime}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════

interface AgentDesktopPanelProps {
  phases: AgentStepsPhase[];
  onPhaseComplete: (phase: AgentStepsPhase) => void;
  onAllComplete: () => void;
}

export function AgentDesktopPanel({ phases, onPhaseComplete, onAllComplete }: AgentDesktopPanelProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [screenKey, setScreenKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const completedRef = useRef(false);
  const phaseCompleteRef = useRef<Set<number>>(new Set());
  const elapsedTime = useElapsedTime();

  const currentPhase = phases[currentPhaseIndex];
  const totalScreensAllPhases = phases.reduce((sum, p) => sum + p.screens.length, 0);
  const completedScreensAllPhases = phases.slice(0, currentPhaseIndex).reduce((sum, p) => sum + p.screens.length, 0) + currentScreenIndex;

  // Auto-advance through screens and phases
  useEffect(() => {
    if (!currentPhase || completedRef.current) return;

    const screens = currentPhase.screens;
    if (currentScreenIndex >= screens.length) return;

    const duration = screens[currentScreenIndex].duration;

    const timer = setTimeout(() => {
      if (currentScreenIndex < screens.length - 1) {
        setCurrentScreenIndex(prev => prev + 1);
        setScreenKey(prev => prev + 1);
      } else {
        if (!phaseCompleteRef.current.has(currentPhaseIndex)) {
          phaseCompleteRef.current.add(currentPhaseIndex);
          onPhaseComplete(currentPhase);
        }

        if (currentPhaseIndex < phases.length - 1) {
          setCurrentPhaseIndex(prev => prev + 1);
          setCurrentScreenIndex(0);
          setScreenKey(prev => prev + 1);
        } else {
          if (!completedRef.current) {
            completedRef.current = true;
            // Collapse the panel, then notify parent
            setTimeout(() => {
              setCollapsed(true);
              setTimeout(onAllComplete, 300);
            }, 600);
          }
        }
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentPhaseIndex, currentScreenIndex, currentPhase, phases, onPhaseComplete, onAllComplete]);

  // Once collapsed, render nothing — parent shows the result
  if (collapsed || !currentPhase) return null;

  const overallProgress = totalScreensAllPhases > 0
    ? Math.round(((completedScreensAllPhases + 1) / totalScreensAllPhases) * 100)
    : 0;
  const isDone = completedRef.current;
  const thinkingText = currentPhase.screens[currentScreenIndex]?.thinkingText ?? "";

  const footer = (
    <CompactFooter
      progress={overallProgress}
      isDone={isDone}
      phaseTitle={currentPhase.title}
      currentPhaseIndex={currentPhaseIndex}
      totalPhases={phases.length}
      elapsedTime={elapsedTime}
    />
  );

  return (
    <div className="flex flex-col items-start w-full">
      <AnimatePresence mode="wait">
        {!isDone && thinkingText && (
          <AgentThinkingBar key={screenKey} text={thinkingText} phaseIcon={currentPhase.icon} />
        )}
      </AnimatePresence>
      <DesktopChrome url={currentPhase.systemUrl} footer={footer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screenKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <PhaseScreenRenderer phaseId={currentPhase.phaseId} screenIndex={currentScreenIndex} />
          </motion.div>
        </AnimatePresence>
      </DesktopChrome>
    </div>
  );
}
