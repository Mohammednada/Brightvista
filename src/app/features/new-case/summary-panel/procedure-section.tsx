import { useState } from "react";
import { motion } from "motion/react";
import { Pencil, Check, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { ProcedureData, CaseBuilderAction } from "../state/case-builder-state";

function ValidationBadge({ valid }: { valid: boolean | null | undefined }) {
  if (valid === null || valid === undefined) {
    return <Loader2 size={12} className="text-text-muted animate-spin shrink-0" />;
  }
  if (valid) {
    return <CheckCircle size={12} className="text-[#099F69] shrink-0" />;
  }
  return <XCircle size={12} className="text-[#D02241] shrink-0" />;
}

interface ProcedureSectionProps {
  procedure: Partial<ProcedureData>;
  dispatch: React.Dispatch<CaseBuilderAction>;
}

export function ProcedureSection({ procedure, dispatch }: ProcedureSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const update = (fields: Partial<ProcedureData>) => {
    dispatch({ type: "SET_PROCEDURE", payload: fields });
  };

  const bothValid = procedure.cptValid === true && procedure.icd10Valid === true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="px-5 py-4"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Procedure</span>
          {bothValid && (
            <span className="px-1.5 py-0 rounded text-[9px] font-semibold bg-[#dcfce7] text-[#099F69]">
              Validated
            </span>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-bg cursor-pointer transition-colors"
        >
          {isEditing ? (
            <Check size={13} className="text-[#099F69]" />
          ) : (
            <Pencil size={12} className="text-text-muted" />
          )}
        </button>
      </div>

      {/* CPT */}
      <div className="flex items-baseline justify-between gap-3 py-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {procedure.cptCode && <ValidationBadge valid={procedure.cptValid ?? null} />}
          <span className="text-[11px] text-text-muted font-medium">CPT</span>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={procedure.cptCode || ""}
            onChange={(e) => update({ cptCode: e.target.value })}
            placeholder="e.g. 72141"
            className="flex-1 min-w-0 px-2 py-0.5 text-[12px] text-text-primary text-right bg-white border border-border-default rounded-md focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
          />
        ) : (
          <span className="text-[12px] text-text-primary font-medium text-right truncate">
            {procedure.cptCode || "—"}
            {procedure.cptDescription && (
              <span className="text-text-secondary font-normal"> — {procedure.cptDescription}</span>
            )}
          </span>
        )}
      </div>

      {/* ICD-10 */}
      <div className="flex items-baseline justify-between gap-3 py-1">
        <div className="flex items-center gap-1.5 shrink-0">
          {procedure.icd10Code && <ValidationBadge valid={procedure.icd10Valid ?? null} />}
          <span className="text-[11px] text-text-muted font-medium">ICD-10</span>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={procedure.icd10Code || ""}
            onChange={(e) => update({ icd10Code: e.target.value })}
            placeholder="e.g. M54.12"
            className="flex-1 min-w-0 px-2 py-0.5 text-[12px] text-text-primary text-right bg-white border border-border-default rounded-md focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
          />
        ) : (
          <span className="text-[12px] text-text-primary font-medium text-right truncate">
            {procedure.icd10Code || "—"}
            {procedure.icd10Description && (
              <span className="text-text-secondary font-normal"> — {procedure.icd10Description}</span>
            )}
          </span>
        )}
      </div>

      {/* Ordering Physician */}
      <div className="flex items-baseline justify-between gap-3 py-1">
        <span className="text-[11px] text-text-muted font-medium shrink-0">Physician</span>
        {isEditing ? (
          <input
            type="text"
            value={procedure.orderingPhysician || ""}
            onChange={(e) => update({ orderingPhysician: e.target.value })}
            placeholder="e.g. Dr. Sarah Patel"
            className="flex-1 min-w-0 px-2 py-0.5 text-[12px] text-text-primary text-right bg-white border border-border-default rounded-md focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
          />
        ) : (
          <span className="text-[12px] text-text-primary font-medium text-right truncate">
            {procedure.orderingPhysician || "—"}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="mt-4 border-t border-[#f0f2f4]" />
    </motion.div>
  );
}
