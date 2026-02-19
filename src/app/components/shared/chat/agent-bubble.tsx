import React from "react";
import { motion } from "motion/react";
import { FormattedAgentText } from "./formatted-agent-text";
import { ActionOptionsBar } from "./action-options-bar";
import type { ActionOption } from "@/shared/types";

export const AgentBubble = React.forwardRef<
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
        className="flex flex-col gap-1.5"
      >
        {text && <FormattedAgentText text={text} />}
        {actionOptions && actionOptions.length > 0 && onActionSelect && (
          <ActionOptionsBar options={actionOptions} onSelect={onActionSelect} />
        )}
        <span
          className="text-[10px] leading-[14px] text-text-muted"
        >
          {time}
        </span>
      </motion.div>
    );
  }
);
