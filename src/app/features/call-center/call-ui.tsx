import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Play, Pause, Volume2, Shield } from "lucide-react";
import type { CallStatus, TranscriptLine } from "@/mock/call-center";

// ── Speaking Waves ───────────────────────────────────────────────────────────
// Animated voice waveform — horizontal bars that oscillate like a voice signal.

export function SpeakingWaves({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-[2px] h-[14px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-[2.5px] rounded-full"
          style={{ background: color }}
          animate={{ height: [2, 14, 2] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

// ── Call Avatar Badge ────────────────────────────────────────────────────────

export function CallAvatarBadge({
  label,
  color,
  pulse = false,
  speaking = false,
  size = "md",
}: {
  label: string;
  color: string;
  pulse?: boolean;
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = size === "lg" ? "w-10 h-10" : size === "md" ? "w-7 h-7" : "w-5 h-5";
  const textSize = size === "lg" ? "text-[13px]" : size === "md" ? "text-[10px]" : "text-[7px]";

  return (
    <div className="relative flex items-center justify-center">
      {/* Speaking: gentle glow ring */}
      {speaking && (
        <motion.div
          className="absolute inset-[-3px] rounded-full"
          style={{ border: `2px solid ${color}`, boxShadow: `0 0 6px ${color}30` }}
          animate={{ opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Simple single pulse (non-speaking) */}
      {pulse && !speaking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${color}` }}
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <div className={`${dims} rounded-full flex items-center justify-center shrink-0`} style={{ background: color }}>
        <span className={`${textSize} text-white font-semibold leading-none`}>{label}</span>
      </div>
    </div>
  );
}

// ── Call Status Badge ────────────────────────────────────────────────────────

const statusConfig: Record<CallStatus, { label: string; bg: string; text: string; pulse?: boolean }> = {
  active: { label: "Active", bg: "bg-[#dcfce7]", text: "text-[#099F69]", pulse: true },
  queued: { label: "Queued", bg: "bg-[#fef3cd]", text: "text-[#a16207]" },
  "on-hold": { label: "On Hold", bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  completed: { label: "Completed", bg: "bg-[#f0f2f4]", text: "text-text-muted" },
  failed: { label: "Failed", bg: "bg-[#fef2f2]", text: "text-[#D02241]" },
};

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${cfg.bg} ${cfg.text}`}>
      {cfg.pulse && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-[#099F69]"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {cfg.label}
    </span>
  );
}

// ── Live Transcript (Timeline Style) ─────────────────────────────────────────
// Professional call-center transcript: timestamp | speaker label | message.

export function LiveTranscript({
  transcriptLines,
  payerLabel,
  animate = true,
  onSpeakerChange,
}: {
  transcriptLines: TranscriptLine[];
  payerLabel: string;
  animate?: boolean;
  onSpeakerChange?: (speaker: "agent" | "ivr" | null) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(animate ? 0 : transcriptLines.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || visibleCount >= transcriptLines.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 600 : 1600);
    return () => clearTimeout(timer);
  }, [visibleCount, transcriptLines.length, animate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleCount]);

  // Notify parent of current speaker
  useEffect(() => {
    if (!onSpeakerChange || !animate) return;
    if (visibleCount === 0) { onSpeakerChange(null); return; }
    const lastLine = transcriptLines[visibleCount - 1];
    onSpeakerChange(lastLine?.speaker ?? null);
  }, [visibleCount, animate, onSpeakerChange, transcriptLines]);

  const lines = animate ? transcriptLines.slice(0, visibleCount) : transcriptLines;

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-none">
      {/* Lines */}
      <div className="px-5 py-1">
        {lines.map((line, i) => {
          const isAgent = line.speaker === "agent";
          const isLatest = animate && i === visibleCount - 1;
          return (
            <motion.div
              key={i}
              initial={animate ? { opacity: 0, y: 4 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-baseline py-2.5 border-b border-border-default last:border-b-0 ${
                isLatest ? "bg-brand/8 -mx-5 px-5 border-l-2 border-l-brand" : i % 2 === 1 ? "bg-surface-bg" : ""
              }`}
            >
              {/* Timestamp */}
              <span className="w-[48px] shrink-0 text-[11px] text-text-muted tabular-nums">
                {line.timestamp}
              </span>

              {/* Speaker — plain text, no chip */}
              <span className={`w-[64px] shrink-0 text-[11px] font-semibold ${
                isAgent ? "text-brand" : "text-[#FF612B]"
              }`}>
                {isAgent ? "Agent" : payerLabel}
              </span>

              {/* Message */}
              <span className="flex-1 text-[12px] text-text-primary">
                {line.text}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Typing indicator when animating */}
      {animate && visibleCount < transcriptLines.length && visibleCount > 0 && (
        <div className="px-5 py-3 flex items-center gap-2">
          <span className="w-[52px]" />
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-text-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Live Audio Indicator ─────────────────────────────────────────────────────
// Animated bars showing the call is being recorded / can be listened to live.

export function LiveAudioIndicator() {
  return (
    <div className="flex items-center gap-3">
      <Volume2 size={14} className="text-[#099F69] shrink-0" />
      <span className="text-[10px] text-[#099F69] font-semibold shrink-0">Live</span>
      {/* Waveform bars — centered in the available space */}
      <div className="flex-1 flex items-end justify-center gap-[1.5px] h-[20px]">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-[#099F69]"
            animate={{ height: [3, 6 + Math.random() * 14, 3] }}
            transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, repeatType: "mirror", delay: i * 0.03 }}
          />
        ))}
      </div>
      <div className="shrink-0 flex items-center gap-1">
        <Shield size={9} className="text-text-muted" />
        <span className="text-[9px] text-text-muted">Encrypted</span>
      </div>
    </div>
  );
}

// ── Audio Waveform Player ────────────────────────────────────────────────────

export function AudioWaveformPlayer({
  totalDuration = 222,
  label,
}: {
  totalDuration?: number;
  label?: string;
}) {
  const BAR_COUNT = 80;
  const barHeights = useRef(Array.from({ length: BAR_COUNT }, () => 10 + Math.random() * 18)).current;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = useCallback(() => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
    } else {
      setProgress(0);
      setPlaying(true);
      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 10000;
        if (elapsed >= 1) {
          setProgress(1);
          setPlaying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else {
          setProgress(elapsed);
        }
      }, 50);
    }
  }, [playing]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const elapsed = Math.floor(progress * totalDuration);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  const totalMins = Math.floor(totalDuration / 60);
  const totalSecs = totalDuration % 60;
  const totalStr = `${totalMins}:${totalSecs.toString().padStart(2, "0")}`;

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Volume2 size={12} className="text-text-muted" />
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield size={9} className="text-text-muted" />
            <span className="text-[9px] text-text-muted">HIPAA Encrypted</span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0 hover:bg-[#2d5a7a] transition-colors cursor-pointer">
          {playing ? <Pause size={12} className="text-white" /> : <Play size={12} className="text-white ml-[1px]" />}
        </button>
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="flex items-end justify-center gap-[1.5px] h-[24px]">
            {barHeights.map((h, i) => {
              const barProgress = i / BAR_COUNT;
              const isActive = barProgress <= progress;
              return (
                <motion.div
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{ background: isActive ? "var(--color-primary-brand)" : "var(--color-border-default)" }}
                  animate={playing ? { height: [h * 0.5, h, h * 0.7, h * 0.9, h * 0.5] } : { height: h }}
                  transition={playing ? { duration: 0.6, repeat: Infinity, repeatType: "mirror", delay: i * 0.025 } : { duration: 0.3 }}
                />
              );
            })}
          </div>
          <div className="w-full h-[2px] bg-border-default rounded-full overflow-hidden">
            <motion.div className="h-full bg-brand rounded-full" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <span className="text-[11px] text-text-muted tabular-nums shrink-0">{timeStr} / {totalStr}</span>
      </div>
    </div>
  );
}

// ── Activity Indicator ───────────────────────────────────────────────────────

export function ActivityIndicator({ label }: { label: string }) {
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
