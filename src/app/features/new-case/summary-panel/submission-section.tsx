import { motion, AnimatePresence } from "motion/react";
import { Send, Globe, Phone, Bot, Clock, Hash, ChevronDown } from "lucide-react";
import type { SubmissionDetails } from "../state/case-builder-state";

const channelConfig: Record<string, { label: string; icon: typeof Globe }> = {
  api: { label: "X12 278 API", icon: Globe },
  voice: { label: "Voice / IVR", icon: Phone },
  rpa: { label: "RPA Bot (Portal)", icon: Bot },
};

interface SubmissionSectionProps {
  details: SubmissionDetails;
  isCollapsed: boolean;
  onToggle: () => void;
  activityLabel: string | null;
}

function ActivityIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
      </span>
      <span className="text-[10px] text-brand font-medium">{label}</span>
    </div>
  );
}

export function SubmissionSection({ details, isCollapsed, onToggle, activityLabel }: SubmissionSectionProps) {
  const channel = channelConfig[details.channel] ?? channelConfig.api;
  const ChannelIcon = channel.icon;

  const formattedTime = new Date(details.submittedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="px-5 py-2"
    >
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Send size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Submission</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#dbeafe] text-[#2563eb]">
            Under Review
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activityLabel && <ActivityIndicator label={activityLabel} />}
          <motion.div
            animate={{ rotate: isCollapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {/* Tracking ID */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Hash size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted font-medium">Tracking ID</span>
                </div>
                <span className="text-[12px] text-text-primary font-semibold font-mono">{details.trackingId}</span>
              </div>

              {/* Channel */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <ChannelIcon size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted font-medium">Channel</span>
                </div>
                <span className="text-[12px] text-text-primary font-medium">{channel.label}</span>
              </div>

              {/* Submitted at */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted font-medium">Submitted</span>
                </div>
                <span className="text-[12px] text-text-primary font-medium">{formattedTime}</span>
              </div>

              {/* Expected response */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted font-medium">Expected</span>
                </div>
                <span className="text-[12px] text-text-primary font-medium">{details.expectedResponse}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-2 border-t border-border-default" />
    </motion.div>
  );
}
