import React from "react";
import { motion } from "motion/react";

export const UserBubble = React.forwardRef<HTMLDivElement, { text: string; time: string }>(
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
          <div className="bg-brand rounded-2xl rounded-br-md px-4 py-2.5">
            <p
              className="text-[14px] leading-[22px] text-white"
            >
              {text}
            </p>
          </div>
          <span
            className="text-[10px] leading-[14px] text-text-muted pr-1"
          >
            {time}
          </span>
        </div>
      </motion.div>
    );
  }
);
