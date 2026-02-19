import { motion } from "motion/react";
import { Zap } from "lucide-react";

export function NextBestActionCard({ label, onAction }: { label: string; onAction: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      onClick={onAction}
      className="group w-full cursor-pointer"
    >
      <div className="inline-flex items-center gap-1.5 bg-surface-bg rounded-full border border-border-default px-3 py-1.5 transition-all group-hover:border-brand/30 group-hover:shadow-sm">
        <Zap size={12} className="text-brand shrink-0" />
        <span
          className="text-[13px] leading-[18px] text-brand font-medium"
        >
          {label}
        </span>
      </div>
    </motion.button>
  );
}
