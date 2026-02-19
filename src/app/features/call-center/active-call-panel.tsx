import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Phone, Clock, CheckCircle, FileAudio, History,
  PhoneOff, Play, ChevronDown, Shield, Volume2, XCircle, PhoneIncoming,
} from "lucide-react";
import type { CallQueueItem, PastCall } from "@/mock/call-center";
import {
  CallAvatarBadge, LiveTranscript, AudioWaveformPlayer,
  ActivityIndicator, LiveAudioIndicator, SpeakingWaves,
} from "./call-ui";

// ── Panel Router ─────────────────────────────────────────────────────────────

interface ActiveCallPanelProps {
  call: CallQueueItem | null;
}

export function ActiveCallPanel({ call }: ActiveCallPanelProps) {
  if (!call) return <EmptyState />;

  switch (call.status) {
    case "active":
      return <ActiveCallView call={call} />;
    case "queued":
      return <QueuedCallView call={call} />;
    case "completed":
      return <CompletedCallView call={call} />;
    case "failed":
      return <FailedCallView call={call} />;
    default:
      return <EmptyState />;
  }
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-surface-bg flex items-center justify-center">
        <Phone size={22} className="text-text-muted" />
      </div>
      <p className="text-[14px] font-medium text-text-muted">Select a call from the queue</p>
      <p className="text-[12px] text-text-muted">Click on any call to view details</p>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

type CenterTab = "transcript" | "history";

function TabBar({
  activeTab,
  onTabChange,
  historyCount,
}: {
  activeTab: CenterTab;
  onTabChange: (tab: CenterTab) => void;
  historyCount: number;
}) {
  return (
    <div className="flex border-b border-border-default shrink-0">
      <button
        onClick={() => onTabChange("transcript")}
        className={`flex-1 py-2.5 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
          activeTab === "transcript"
            ? "border-brand text-brand"
            : "border-transparent text-text-muted hover:text-text-secondary"
        }`}
      >
        Transcript & Audio
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`flex-1 py-2.5 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
          activeTab === "history"
            ? "border-brand text-brand"
            : "border-transparent text-text-muted hover:text-text-secondary"
        }`}
      >
        Call History
        {historyCount > 0 && (
          <span className="ml-1 text-[10px] opacity-60">{historyCount}</span>
        )}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Active Call View
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveCallView({ call }: { call: CallQueueItem }) {
  const [activeTab, setActiveTab] = useState<CenterTab>("transcript");
  const [currentSpeaker, setCurrentSpeaker] = useState<"agent" | "ivr" | null>(null);

  const handleSpeakerChange = useCallback((speaker: "agent" | "ivr" | null) => {
    setCurrentSpeaker(speaker);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Call header */}
      <CallHeaderBar call={call} status="active" currentSpeaker={currentSpeaker} />

      {/* Tabs */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} historyCount={call.callHistory.length} />

      {/* Tab content */}
      {activeTab === "transcript" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Live transcript */}
          <div className="flex-1 overflow-hidden bg-surface-bg">
            <LiveTranscript
              transcriptLines={call.transcript}
              payerLabel={call.payer}
              animate
              onSpeakerChange={handleSpeakerChange}
            />
          </div>

          {/* Live audio monitor bar */}
          <div className="px-5 py-3 border-t border-border-default">
            <LiveAudioIndicator />
          </div>
        </div>
      ) : (
        <CallHistoryList history={call.callHistory} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Completed Call View
// ═══════════════════════════════════════════════════════════════════════════════

function CompletedCallView({ call }: { call: CallQueueItem }) {
  const [activeTab, setActiveTab] = useState<CenterTab>("transcript");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Call header */}
      <CallHeaderBar call={call} status="completed" />

      {/* Tabs */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} historyCount={call.callHistory.length} />

      {/* Tab content */}
      {activeTab === "transcript" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Full transcript */}
          <div className="flex-1 overflow-hidden bg-surface-bg">
            <LiveTranscript transcriptLines={call.transcript} payerLabel={call.payer} animate={false} />
          </div>

          {/* Audio recording player */}
          <div className="px-5 py-3 border-t border-border-default">
            <AudioWaveformPlayer
              totalDuration={parseDuration(call.duration)}
              label="Call Recording"
            />
          </div>
        </div>
      ) : (
        <CallHistoryList history={call.callHistory} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Queued Call View
// ═══════════════════════════════════════════════════════════════════════════════

function QueuedCallView({ call }: { call: CallQueueItem }) {
  const [activeTab, setActiveTab] = useState<CenterTab>(
    call.callHistory.length > 0 ? "transcript" : "transcript",
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Call header */}
      <CallHeaderBar call={call} status="queued" />

      {/* Tabs (only show history if there is any) */}
      {call.callHistory.length > 0 && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} historyCount={call.callHistory.length} />
      )}

      {/* Content */}
      {activeTab === "transcript" || call.callHistory.length === 0 ? (
        <div className="flex-1 overflow-y-auto scrollbar-none">
          {/* Waiting banner */}
          <div className="px-5 py-4 border-b border-border-default bg-[#fffbeb]">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#F3903F]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div>
                <p className="text-[12px] font-semibold text-[#92400e]">Waiting in queue</p>
                <p className="text-[10px] text-[#a16207]">
                  Will call {call.payerFull} at {call.payerPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Pre-call details */}
          <div className="px-5 py-4 space-y-5">
            {/* Patient & procedure */}
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Patient & Procedure</p>
              <div className="space-y-1.5">
                <FieldRow label="Patient" value={call.patient.name} />
                <FieldRow label="DOB" value={`${call.patient.dob} (Age ${call.patient.age})`} />
                <FieldRow label="Procedure" value={call.procedure.name} />
                <FieldRow label="CPT" value={call.procedure.cptCode} />
                <FieldRow label="Physician" value={call.physician} />
              </div>
            </div>

            {/* Insurance */}
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Insurance</p>
              <div className="space-y-1.5">
                <FieldRow label="Payer" value={call.payerFull} />
                <FieldRow label="Member ID" value={call.insurance.memberId} />
                <FieldRow label="Plan" value={call.insurance.planType} />
              </div>
            </div>

            {/* Call plan */}
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Call Plan</p>
              <div className="space-y-1.5">
                <FieldRow label="Type" value={call.callType === "submission" ? "New Submission" : "Status Check"} />
                <FieldRow label="Channel" value="Voice / IVR" />
                <FieldRow label="Documents" value={`${call.documents.length} ready`} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CallHistoryList history={call.callHistory} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Failed Call View
// ═══════════════════════════════════════════════════════════════════════════════

function FailedCallView({ call }: { call: CallQueueItem }) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Call header */}
      <CallHeaderBar call={call} status="queued" />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
        <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center">
          <XCircle size={22} className="text-[#D02241]" />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-semibold text-[#D02241]">Call Failed</p>
          <p className="text-[11px] text-text-muted mt-1">Could not connect to {call.payerFull}</p>
        </div>

        {/* Context details */}
        <div className="w-full max-w-[280px] rounded-xl bg-surface-bg p-4 space-y-2">
          <FieldRow label="Patient" value={call.patient.name} />
          <FieldRow label="Procedure" value={call.procedure.name} />
          <FieldRow label="Payer" value={`${call.payerFull} · ${call.payerPhone}`} />
          <FieldRow label="Type" value={call.callType === "submission" ? "New Submission" : "Status Check"} />
        </div>

        <p className="text-[10px] text-text-muted">This call will be automatically retried</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Call Header Bar (shared between Active / Completed / Queued)
// ═══════════════════════════════════════════════════════════════════════════════

function CallHeaderBar({
  call,
  status,
  currentSpeaker,
}: {
  call: CallQueueItem;
  status: "active" | "completed" | "queued";
  currentSpeaker?: "agent" | "ivr" | null;
}) {
  const agentSpeaking = status === "active" && currentSpeaker === "agent";
  const payerSpeaking = status === "active" && currentSpeaker === "ivr";

  return (
    <div className="px-5 py-3 border-b border-border-default shrink-0">
      <div className="flex items-center gap-3">
        {/* Agent */}
        <CallAvatarBadge label="NS" color="#6b7280" speaking={agentSpeaking} size="md" />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-text-primary">NorthStar Agent</p>
          {agentSpeaking ? (
            <div className="flex items-center gap-1.5">
              <SpeakingWaves color="#6b7280" />
              <span className="text-[10px] text-brand font-medium">Speaking</span>
            </div>
          ) : (
            <p className="text-[10px] text-text-muted">AI Voice Assistant</p>
          )}
        </div>

        {/* Center status */}
        <div className="flex items-center gap-2 mx-auto">
          {status === "active" ? (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#099F69]"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
              <ActivityIndicator label="Connected" />
              <span className="text-[10px] text-text-muted tabular-nums">{call.duration}</span>
            </>
          ) : status === "completed" ? (
            <>
              <PhoneOff size={12} className="text-text-muted" />
              <span className="text-[10px] text-text-muted">Ended · {call.duration}</span>
              {call.trackingId && (
                <span className="px-1.5 py-px rounded-full text-[9px] font-semibold bg-[#dcfce7] text-[#099F69]">
                  {call.callType === "status-check" ? "Approved" : "Submitted"}
                </span>
              )}
            </>
          ) : (
            <>
              <PhoneIncoming size={12} className="text-[#F3903F]" />
              <span className="text-[10px] text-[#a16207] font-medium">Queued</span>
            </>
          )}
        </div>

        {/* Payer */}
        <div className="text-right min-w-0">
          <p className="text-[12px] font-semibold text-text-primary">{call.payerFull}</p>
          {payerSpeaking ? (
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-[#FF612B] font-medium">Speaking</span>
              <SpeakingWaves color="#FF612B" />
            </div>
          ) : (
            <p className="text-[10px] text-text-muted">{call.payerPhone}</p>
          )}
        </div>
        <CallAvatarBadge label={call.payer} color="#FF612B" speaking={payerSpeaking} size="md" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Call History List
// ═══════════════════════════════════════════════════════════════════════════════

function CallHistoryList({ history }: { history: PastCall[] }) {
  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <History size={22} className="text-text-muted opacity-40" />
        <p className="text-[13px] text-text-muted">No previous calls for this case</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-none">
      <div className="p-5 space-y-3">
        {history.map((past) => (
          <CallHistoryCard key={past.id} call={past} />
        ))}
      </div>
    </div>
  );
}

// ── Call History Card ────────────────────────────────────────────────────────

const outcomeConfig: Record<string, { label: string; bg: string; text: string; icon: typeof CheckCircle }> = {
  submitted: { label: "Submitted", bg: "bg-[#dbeafe]", text: "text-[#2563eb]", icon: CheckCircle },
  approved: { label: "Approved", bg: "bg-[#dcfce7]", text: "text-[#099F69]", icon: CheckCircle },
  pending: { label: "Pending", bg: "bg-[#fef3cd]", text: "text-[#a16207]", icon: Clock },
  "no-answer": { label: "No Answer", bg: "bg-[#f0f2f4]", text: "text-text-muted", icon: XCircle },
  "rfi-received": { label: "RFI Received", bg: "bg-[#fff7ed]", text: "text-[#c2410c]", icon: FileAudio },
};

function CallHistoryCard({ call }: { call: PastCall }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = outcomeConfig[call.outcome] ?? outcomeConfig.pending;
  const OutcomeIcon = cfg.icon;

  return (
    <div className={`rounded-2xl border border-border-default overflow-hidden ${expanded ? "bg-card-bg" : "bg-surface-bg"}`}>
      {/* Header — clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 hover:bg-surface-hover transition-colors cursor-pointer"
      >
        {/* Top row: payer, type badge, outcome, chevron */}
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-text-primary">{call.payer}</span>
          <div className="ml-auto flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 px-2 py-px rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.text}`}>
              <OutcomeIcon size={10} />
              {cfg.label}
            </span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-text-muted" />
            </motion.div>
          </div>
        </div>
        {/* Bottom row: date, time, duration, file size */}
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-muted">
          <span>{call.date} · {call.time}</span>
          <span className="w-px h-3 bg-border-default" />
          <span>Duration: {call.duration}</span>
          <div className="ml-auto flex items-center gap-1">
            <Volume2 size={10} className="text-text-muted" />
            <span>{call.recording.fileSize}</span>
          </div>
        </div>
      </button>

      {/* Expanded: transcript + audio player */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border-default"
        >
          {/* Compact transcript */}
          <div className="max-h-[240px] overflow-y-auto scrollbar-none">
            <div className="px-5 py-2">
              {call.transcript.map((line, i) => {
                const isAgent = line.speaker === "agent";
                return (
                  <div key={i} className="flex items-baseline py-1.5 border-b border-border-default last:border-b-0">
                    <span className="w-[42px] shrink-0 text-[10px] text-text-muted tabular-nums">
                      {line.timestamp}
                    </span>
                    <span className={`w-[56px] shrink-0 text-[10px] font-semibold ${
                      isAgent ? "text-brand" : "text-[#FF612B]"
                    }`}>
                      {isAgent ? "Agent" : call.payer}
                    </span>
                    <span className="flex-1 text-[11px] text-text-primary">{line.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio player */}
          <div className="px-5 py-5 border-t border-border-default bg-surface-bg">
            <AudioWaveformPlayer totalDuration={call.recording.durationSecs} />
          </div>

          {/* Recording meta */}
          <div className="flex items-center justify-between px-5 py-2 bg-surface-bg border-t border-[#f0f2f4]">
            <div className="flex items-center gap-3 text-[9px] text-text-muted">
              <span>{call.recording.quality} Quality</span>
              <span>{call.recording.fileSize}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-text-muted">
              <Shield size={9} />
              <span>HIPAA Encrypted</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Shared Helpers ───────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] text-text-muted font-medium">{label}</span>
      <span className="text-[12px] text-text-primary font-medium text-right">{value}</span>
    </div>
  );
}

function parseDuration(dur: string | null): number {
  if (!dur) return 180;
  const [m, s] = dur.split(":").map(Number);
  return m * 60 + s;
}
