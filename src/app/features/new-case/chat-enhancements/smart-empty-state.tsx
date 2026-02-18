import { motion } from "motion/react";
import { Sparkles, Clock, AlertTriangle, Zap } from "lucide-react";
import { suggestedPrompts } from "../agent-entries";
import { quickStartCards } from "@/mock/new-case";

// ── Quick Start Card Icons ───────────────────────────────────────────────────

const cardIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  draft: {
    icon: <Clock size={18} />,
    color: "text-[#F3903F]",
    bg: "bg-[#fef3cd]",
  },
  urgent: {
    icon: <AlertTriangle size={18} />,
    color: "text-[#D02241]",
    bg: "bg-[#fef2f2]",
  },
  template: {
    icon: <Zap size={18} />,
    color: "text-[#2563eb]",
    bg: "bg-[#dbeafe]",
  },
};

// ── Smart Empty State ────────────────────────────────────────────────────────

interface SmartEmptyStateProps {
  onSendMessage: (text: string) => void;
}

export function SmartEmptyState({ onSendMessage }: SmartEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-8 py-12"
    >
      {/* Brand header */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles size={24} className="text-white" />
        </div>
        <p className="text-[22px] leading-[30px] text-text-primary font-bold">
          Create a New Case
        </p>
        <p className="text-[14px] leading-[22px] text-text-secondary text-center max-w-[420px]">
          I'll guide you through the prior authorization submission process — from patient lookup to payer submission.
        </p>
      </div>

      {/* Quick Start section */}
      <div className="w-full">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">
          Quick Start
        </p>
        <div className="flex flex-col gap-2">
          {quickStartCards.map((card, i) => {
            const iconConfig = cardIcons[card.type];
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
                onClick={() => onSendMessage(`I need to create a new prior authorization case.`)}
                className="flex items-center gap-3 bg-white border border-border-default rounded-xl px-4 py-3 text-left cursor-pointer hover:border-[#1F425F]/30 hover:shadow-sm transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconConfig.bg}`}>
                  <span className={iconConfig.color}>{iconConfig.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-text-primary font-medium truncate">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {card.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Or choose an action */}
      <div className="w-full">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">
          Or Choose an Action
        </p>
        <div className="grid grid-cols-2 gap-3">
          {suggestedPrompts.map((sp, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.25 + i * 0.06 }}
              onClick={() => onSendMessage(sp.prompt)}
              className="flex items-center gap-3 bg-white border border-border-default rounded-xl px-4 py-3.5 text-left cursor-pointer hover:border-[#1F425F]/30 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 bg-surface-bg rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#eef4f8] transition-colors">
                {sp.icon}
              </div>
              <span className="text-[13px] leading-[18px] text-text-primary font-medium">
                {sp.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
