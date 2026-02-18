import { useState } from "react";
import { motion } from "motion/react";
import { FileCheck, CheckCircle, XCircle, AlertCircle, Minus, Upload, Database, Ban } from "lucide-react";
import type { DocumentRequirement, CaseBuilderAction } from "../state/case-builder-state";

// ── Status Icon ──────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: DocumentRequirement["status"] }) {
  switch (status) {
    case "found":
      return <CheckCircle size={15} className="text-[#099F69] shrink-0" />;
    case "missing":
      return <XCircle size={15} className="text-[#D02241] shrink-0" />;
    case "recommended":
      return <AlertCircle size={15} className="text-[#F3903F] shrink-0" />;
    case "na":
      return <Minus size={15} className="text-text-muted shrink-0" />;
  }
}

// ── Document Row ─────────────────────────────────────────────────────────────

interface DocumentRowProps {
  doc: DocumentRequirement;
  index: number;
  dispatch: React.Dispatch<CaseBuilderAction>;
}

function DocumentRow({ doc, index, dispatch }: DocumentRowProps) {
  const [hovered, setHovered] = useState(false);

  const updateStatus = (status: DocumentRequirement["status"]) => {
    dispatch({ type: "UPDATE_DOCUMENT_STATUS", payload: { id: doc.id, status } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-surface-bg transition-colors group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StatusIcon status={doc.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-text-primary font-medium truncate">{doc.name}</span>
          {doc.required && (
            <span className="px-1 py-0 rounded text-[8px] font-bold bg-[#fef2f2] text-[#D02241] uppercase shrink-0">
              REQ
            </span>
          )}
        </div>
        {doc.status === "found" && (doc.source || doc.date) && (
          <p className="text-[10px] text-text-muted truncate">
            {doc.source}{doc.source && doc.date ? " · " : ""}{doc.date}
          </p>
        )}
      </div>

      {/* Hover action buttons */}
      {hovered && doc.status !== "found" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 shrink-0"
        >
          <button
            onClick={() => updateStatus("found")}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-[#dbeafe] text-[#2563eb] hover:bg-[#bfdbfe] transition-colors cursor-pointer"
          >
            <Upload size={9} />
            Upload
          </button>
          <button
            onClick={() => updateStatus("found")}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-[#f3e8ff] text-[#8b5cf6] hover:bg-[#e9d5ff] transition-colors cursor-pointer"
          >
            <Database size={9} />
            EMR
          </button>
          <button
            onClick={() => updateStatus("na")}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-[#f0f2f4] text-text-muted hover:bg-[#e5e5e5] transition-colors cursor-pointer"
          >
            <Ban size={9} />
            N/A
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Compliance Checklist ─────────────────────────────────────────────────────

interface ComplianceChecklistProps {
  documents: DocumentRequirement[];
  dispatch: React.Dispatch<CaseBuilderAction>;
}

export function ComplianceChecklist({ documents, dispatch }: ComplianceChecklistProps) {
  const required = documents.filter((d) => d.required);
  const found = required.filter((d) => d.status === "found");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="bg-white rounded-2xl border border-border-default overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#099F69]/10 flex items-center justify-center">
            <FileCheck size={13} className="text-[#099F69]" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">Documentation Requirements</span>
        </div>
        <span className="text-[11px] font-semibold text-text-muted">
          {found.length}/{required.length}
        </span>
      </div>

      {/* Document rows */}
      <div className="py-1 px-1">
        {documents.map((doc, i) => (
          <DocumentRow key={doc.id} doc={doc} index={i} dispatch={dispatch} />
        ))}
      </div>
    </motion.div>
  );
}
