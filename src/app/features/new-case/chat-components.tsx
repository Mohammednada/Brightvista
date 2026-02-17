// Re-export all shared chat components for new-case consumers
export {
  ThinkingIndicator,
  UserBubble,
  AgentBubble,
  FormattedAgentText,
  NextBestActionCard,
  ActionOptionsBar,
} from "@/app/components/shared/chat";

// ── Typewriter (new-case specific) ───────────────────────────────────────────

import { useState, useEffect, useRef } from "react";

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
