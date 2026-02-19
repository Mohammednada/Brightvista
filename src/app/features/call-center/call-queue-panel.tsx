import { Phone } from "lucide-react";
import type { CallQueueItem } from "@/mock/call-center";

// ── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "queued" | "completed";

// ── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "queued", label: "Queued" },
  { id: "completed", label: "Done" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function filterCalls(calls: CallQueueItem[], tab: FilterTab): CallQueueItem[] {
  if (tab === "all") return calls;
  return calls.filter((c) => c.status === tab);
}

// Payer → accent color mapping
const payerColors: Record<string, string> = {
  UHC: "#2563eb",
  Aetna: "#7c3aed",
  Cigna: "#ea580c",
  BCBS: "#0891b2",
};

function getPayerColor(payer: string): string {
  return payerColors[payer] ?? "#6b7280";
}

// ── Call Row ─────────────────────────────────────────────────────────────────

function CallRow({
  call,
  isSelected,
  onSelect,
  isLast,
  queuePosition,
}: {
  call: CallQueueItem;
  isSelected: boolean;
  onSelect: () => void;
  isLast: boolean;
  queuePosition?: number;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
        isSelected ? "bg-surface-bg" : "hover:bg-surface-hover"
      } ${!isLast ? "border-b border-border-default" : ""}`}
    >
      {/* Row 1: payer dot + patient name + status badge */}
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: getPayerColor(call.payer) }}
        />
        <span className="text-[13px] font-semibold text-text-primary truncate flex-1">
          {call.patient.name}
        </span>
        {call.status === "active" && (
          <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[9px] font-semibold bg-[#ecfdf5] text-[#065f46] border border-[#6ee7b7] shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#065f46] animate-pulse" />
            Active
          </span>
        )}
        {call.status === "queued" && queuePosition != null && (
          <span className="text-[10px] text-[#a16207] font-medium shrink-0">
            #{queuePosition} in queue
          </span>
        )}
        <span className="text-[11px] text-text-muted tabular-nums shrink-0">
          {call.duration ?? "—"}
        </span>
      </div>

      {/* Row 2: procedure */}
      <p className="text-[11px] text-text-secondary truncate mt-1">
        {call.procedure.name}
      </p>

      {/* Row 3: payer + call type */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[11px] font-medium text-text-muted">{call.payer}</span>
        <span className="text-[10px] text-text-muted">·</span>
        <span className={`text-[10px] font-medium ${
          call.callType === "submission" ? "text-[#2563eb]" : "text-[#7c3aed]"
        }`}>
          {call.callType === "submission" ? "Submission" : "Status Check"}
        </span>
      </div>
    </button>
  );
}

// ── Queue Panel ──────────────────────────────────────────────────────────────

interface CallQueuePanelProps {
  calls: CallQueueItem[];
  selectedCallId: string | null;
  onSelectCall: (id: string) => void;
  filterTab: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

export function CallQueuePanel({
  calls,
  selectedCallId,
  onSelectCall,
  filterTab,
  onFilterChange,
}: CallQueuePanelProps) {
  const filtered = filterCalls(calls, filterTab);

  return (
    <div className="w-[300px] shrink-0 border-r border-border-default flex flex-col h-full bg-background">
      {/* Filter tabs — underline style matching dashboard patterns */}
      <div className="flex border-b border-border-default shrink-0">
        {TABS.map((tab) => {
          const count = tab.id === "all"
            ? calls.length
            : calls.filter((c) => c.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex-1 py-2.5 text-[11px] font-medium transition-colors cursor-pointer border-b-2 ${
                filterTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
              <span className={`ml-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full text-[9px] font-bold ${
                filterTab === tab.id
                  ? "bg-brand/10 text-brand"
                  : "bg-surface-bg text-text-muted"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Call list */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <Phone size={18} className="text-text-muted opacity-40" />
            <span className="text-[12px] text-text-muted">No calls</span>
          </div>
        ) : (
          filtered.map((call, i) => {
            // Compute queue position for queued calls
            const queuePosition = call.status === "queued"
              ? calls.filter((c) => c.status === "queued").indexOf(call) + 1
              : undefined;
            return (
              <CallRow
                key={call.id}
                call={call}
                isSelected={call.id === selectedCallId}
                onSelect={() => onSelectCall(call.id)}
                isLast={i === filtered.length - 1}
                queuePosition={queuePosition}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
