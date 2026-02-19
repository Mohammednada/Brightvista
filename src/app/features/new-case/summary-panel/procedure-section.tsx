import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Check, CheckCircle, XCircle, Loader2, Stethoscope, ChevronDown } from "lucide-react";
import type { ProcedureData, CaseBuilderAction } from "../state/case-builder-state";

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
  sectionStatus: "active" | "completed" | "pending";
  isCollapsed: boolean;
  onToggle: () => void;
  activityLabel: string | null;
}

export function ProcedureSection({ procedure, dispatch, sectionStatus, isCollapsed, onToggle, activityLabel }: ProcedureSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const hasData = !!procedure.cptCode || !!procedure.icd10Code;

  const update = (fields: Partial<ProcedureData>) => {
    dispatch({ type: "SET_PROCEDURE", payload: fields });
  };

  const bothValid = procedure.cptValid === true && procedure.icd10Valid === true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className={`px-5 py-2 ${sectionStatus === "pending" ? "opacity-50" : ""}`}
    >
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <Stethoscope size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Procedure</span>
          {sectionStatus === "completed" && bothValid && (
            <span className="px-1.5 py-0 rounded text-[9px] font-semibold bg-[#dcfce7] text-[#099F69]">
              Validated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activityLabel && <ActivityIndicator label={activityLabel} />}
          {hasData && (
            <>
              {!isCollapsed && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-bg cursor-pointer transition-colors"
                >
                  {isEditing ? (
                    <Check size={13} className="text-[#099F69]" />
                  ) : (
                    <Pencil size={12} className="text-text-muted" />
                  )}
                </button>
              )}
              <motion.div
                animate={{ rotate: isCollapsed ? -90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
              </motion.div>
            </>
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
              <>
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
              </>
            ) : (
              <p className="text-[11px] text-text-muted italic py-2">Waiting for agent...</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mt-2 border-t border-[#f0f2f4]" />
    </motion.div>
  );
}
