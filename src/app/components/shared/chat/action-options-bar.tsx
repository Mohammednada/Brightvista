import { motion } from "motion/react";
import type { ActionOption } from "@/shared/types";

export function ActionOptionsBar({
  options,
  onSelect,
}: {
  options: ActionOption[];
  onSelect: (prompt: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2 mt-1"
    >
      {options.map((opt, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.15 + i * 0.08 }}
          onClick={() => onSelect(opt.prompt)}
          className="flex items-center gap-2 rounded-full px-3.5 py-2 cursor-pointer hover:shadow-sm transition-all border group"
          style={{ backgroundColor: opt.bgColor, borderColor: opt.borderColor }}
        >
          <span style={{ color: opt.color }}>{opt.icon}</span>
          <span
            className="text-[12px] font-medium"
            style={{ color: opt.color }}
          >
            {opt.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
