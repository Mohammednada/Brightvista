import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, Minus, Upload, Database, Ban, FileText, ChevronDown } from "lucide-react";
import type { DocumentRequirement, CaseBuilderAction } from "../state/case-builder-state";

// ── Activity indicator ──────────────────────────────────────────────────────

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

function StatusIcon({ status }: { status: DocumentRequirement["status"] }) {
  switch (status) {
    case "found":
      return <CheckCircle size={13} className="text-[#099F69] shrink-0" />;
    case "missing":
      return <XCircle size={13} className="text-[#D02241] shrink-0" />;
    case "recommended":
      return <AlertCircle size={13} className="text-[#F3903F] shrink-0" />;
    case "na":
      return <Minus size={13} className="text-text-muted shrink-0" />;
  }
}

function DocumentRow({ doc, index, dispatch }: { doc: DocumentRequirement; index: number; dispatch: React.Dispatch<CaseBuilderAction> }) {
  const [hovered, setHovered] = useState(false);

  const updateStatus = (status: DocumentRequirement["status"]) => {
    dispatch({ type: "UPDATE_DOCUMENT_STATUS", payload: { id: doc.id, status } });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="flex items-center gap-2 py-1.5 rounded-md hover:bg-surface-hover transition-colors px-1 -mx-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StatusIcon status={doc.status} />
      <div className="flex-1 min-w-0">
        <span className="text-[12px] text-text-primary font-medium truncate block">{doc.name}</span>
        {doc.status === "found" && (doc.source || doc.date) && (
          <span className="text-[10px] text-text-muted">
            {doc.source}{doc.source && doc.date ? " · " : ""}{doc.date}
          </span>
        )}
      </div>
      {doc.required && (
        <span className="px-1 rounded text-[8px] font-bold bg-[#fef2f2] text-[#D02241] uppercase shrink-0">
          REQ
        </span>
      )}

      {/* Hover actions */}
      {hovered && doc.status !== "found" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 shrink-0"
        >
          <button
            onClick={() => updateStatus("found")}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#dbeafe] text-[#2563eb] hover:bg-[#bfdbfe] transition-colors cursor-pointer"
          >
            <Upload size={8} />
            Upload
          </button>
          <button
            onClick={() => updateStatus("found")}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#f3e8ff] text-[#8b5cf6] hover:bg-[#e9d5ff] transition-colors cursor-pointer"
          >
            <Database size={8} />
            EMR
          </button>
          <button
            onClick={() => updateStatus("na")}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-surface-hover text-text-muted hover:bg-icon-active-bg transition-colors cursor-pointer"
          >
            <Ban size={8} />
            N/A
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

interface DocumentsSectionProps {
  documents: DocumentRequirement[];
  dispatch: React.Dispatch<CaseBuilderAction>;
  sectionStatus: "active" | "completed" | "pending";
  isCollapsed: boolean;
  onToggle: () => void;
  activityLabel: string | null;
}

export function DocumentsSection({ documents, dispatch, sectionStatus, isCollapsed, onToggle, activityLabel }: DocumentsSectionProps) {
  const hasData = documents.length > 0;
  const required = documents.filter((d) => d.required);
  const found = required.filter((d) => d.status === "found");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`px-5 py-2 ${sectionStatus === "pending" ? "opacity-50" : ""}`}
    >
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Documents</span>
          {hasData && (
            <span className="text-[10px] font-semibold text-text-muted">{found.length}/{required.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activityLabel && <ActivityIndicator label={activityLabel} />}
          {hasData && (
            <motion.div
              animate={{ rotate: isCollapsed ? -90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
            </motion.div>
          )}
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
            {hasData ? (
              <div className="flex flex-col">
                {documents.map((doc, i) => (
                  <DocumentRow key={doc.id} doc={doc} index={i} dispatch={dispatch} />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-text-muted italic py-2">Waiting for agent...</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-2 border-t border-border-default" />
    </motion.div>
  );
}
