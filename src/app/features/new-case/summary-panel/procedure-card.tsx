import { useState } from "react";
import { motion } from "motion/react";
import { Stethoscope, Pencil, Check, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { ProcedureData, CaseBuilderAction } from "../state/case-builder-state";

// ── Validation Indicator ─────────────────────────────────────────────────────

function ValidationIndicator({ valid }: { valid: boolean | null | undefined }) {
  if (valid === null || valid === undefined) {
    return <Loader2 size={14} className="text-text-muted animate-spin" />;
  }
  if (valid) {
    return <CheckCircle size={14} className="text-[#099F69]" />;
  }
  return <XCircle size={14} className="text-[#D02241]" />;
}

// ── Procedure Card ───────────────────────────────────────────────────────────

interface ProcedureCardProps {
  procedure: Partial<ProcedureData>;
  dispatch: React.Dispatch<CaseBuilderAction>;
}

export function ProcedureCard({ procedure, dispatch }: ProcedureCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const update = (fields: Partial<ProcedureData>) => {
    dispatch({ type: "SET_PROCEDURE", payload: fields });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="bg-card-bg rounded-2xl border border-border-default overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#8b5cf6]/10 flex items-center justify-center">
            <Stethoscope size={13} className="text-[#8b5cf6]" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">Procedure Details</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-bg cursor-pointer transition-colors"
        >
          {isEditing ? (
            <Check size={14} className="text-[#099F69]" />
          ) : (
            <Pencil size={13} className="text-text-muted" />
          )}
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3 p-4">
        {/* CPT Code */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">CPT Code</span>
            {procedure.cptCode && <ValidationIndicator valid={procedure.cptValid ?? null} />}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={procedure.cptCode || ""}
              onChange={(e) => update({ cptCode: e.target.value })}
              className="w-full px-2 py-1 text-[13px] text-text-primary bg-card-bg border border-border-default rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
              placeholder="e.g. 72141"
            />
          ) : (
            <p className="text-[13px] text-text-primary font-medium">
              {procedure.cptCode || <span className="text-text-muted italic">Not set</span>}
              {procedure.cptDescription && (
                <span className="text-text-secondary font-normal"> — {procedure.cptDescription}</span>
              )}
            </p>
          )}
        </motion.div>

        {/* ICD-10 Code */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">ICD-10 Code</span>
            {procedure.icd10Code && <ValidationIndicator valid={procedure.icd10Valid ?? null} />}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={procedure.icd10Code || ""}
              onChange={(e) => update({ icd10Code: e.target.value })}
              className="w-full px-2 py-1 text-[13px] text-text-primary bg-card-bg border border-border-default rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
              placeholder="e.g. M54.12"
            />
          ) : (
            <p className="text-[13px] text-text-primary font-medium">
              {procedure.icd10Code || <span className="text-text-muted italic">Not set</span>}
              {procedure.icd10Description && (
                <span className="text-text-secondary font-normal"> — {procedure.icd10Description}</span>
              )}
            </p>
          )}
        </motion.div>

        {/* Ordering Physician */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider block mb-0.5">
            Ordering Physician
          </span>
          {isEditing ? (
            <input
              type="text"
              value={procedure.orderingPhysician || ""}
              onChange={(e) => update({ orderingPhysician: e.target.value })}
              className="w-full px-2 py-1 text-[13px] text-text-primary bg-card-bg border border-border-default rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
              placeholder="e.g. Dr. Sarah Patel"
            />
          ) : (
            <p className="text-[13px] text-text-primary font-medium">
              {procedure.orderingPhysician || <span className="text-text-muted italic">Not set</span>}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
