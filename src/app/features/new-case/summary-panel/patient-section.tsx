import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Check, User, ChevronDown } from "lucide-react";
import type {
  PatientData,
  PatientFieldConfidence,
  FieldConfidence,
  CaseBuilderAction,
} from "../state/case-builder-state";

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

// ── Confidence dot ───────────────────────────────────────────────────────────

function ConfidenceDot({ confidence }: { confidence?: FieldConfidence }) {
  if (!confidence) return null;

  if (confidence.verified && confidence.source === "ehr") {
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#099F69] shrink-0" title="Verified" />;
  }
  if (confidence.source === "ocr" || confidence.source === "ai") {
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" title="AI Extracted" />;
  }
  if (confidence.needsReview) {
    return <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F3903F] shrink-0" title="Needs Review" />;
  }
  return null;
}

// ── Field Row ────────────────────────────────────────────────────────────────

interface FieldRowProps {
  label: string;
  value: string;
  confidence?: FieldConfidence;
  isEditing: boolean;
  onChange: (value: string) => void;
  delay?: number;
}

function FieldRow({ label, value, confidence, isEditing, onChange, delay = 0 }: FieldRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      className="flex items-baseline justify-between gap-3 py-1"
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <ConfidenceDot confidence={confidence} />
        <span className="text-[11px] text-text-muted font-medium">{label}</span>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-2 py-0.5 text-[12px] text-text-primary text-right bg-background border border-border-default rounded-md focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
        />
      ) : (
        <span className="text-[12px] text-text-primary font-medium text-right truncate">
          {value || <span className="text-text-muted italic">—</span>}
        </span>
      )}
    </motion.div>
  );
}

// ── Patient Section ──────────────────────────────────────────────────────────

interface PatientSectionProps {
  patient: Partial<PatientData>;
  confidence: PatientFieldConfidence;
  dispatch: React.Dispatch<CaseBuilderAction>;
  sectionStatus: "active" | "completed" | "pending";
  isCollapsed: boolean;
  onToggle: () => void;
  activityLabel: string | null;
}

type PatientFieldKey = keyof PatientData;

const fields: { key: PatientFieldKey; label: string }[] = [
  { key: "name", label: "Patient" },
  { key: "dob", label: "DOB" },
  { key: "mrn", label: "MRN" },
  { key: "insurancePayer", label: "Insurance" },
  { key: "memberId", label: "Member ID" },
  { key: "planType", label: "Plan Type" },
  { key: "referringPhysician", label: "Physician" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
];

export function PatientSection({ patient, confidence, dispatch, sectionStatus, isCollapsed, onToggle, activityLabel }: PatientSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const hasData = Object.keys(patient).length > 0;

  const handleFieldChange = (field: PatientFieldKey, value: string) => {
    dispatch({ type: "SET_PATIENT_FIELD", payload: { field, value } });
  };

  const allVerified = Object.values(confidence).every((c) => c?.verified);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`px-5 py-2 ${sectionStatus === "pending" ? "opacity-50" : ""}`}
    >
      {/* Section header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <User size={13} className="text-text-muted" />
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Patient</span>
          {sectionStatus === "completed" && allVerified && (
            <span className="px-1.5 py-0 rounded text-[9px] font-semibold bg-[#dcfce7] text-[#099F69]">
              Verified
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
              <div className="flex flex-col">
                {fields.map((field, i) => (
                  <FieldRow
                    key={field.key}
                    label={field.label}
                    value={patient[field.key] || ""}
                    confidence={confidence[field.key]}
                    isEditing={isEditing}
                    onChange={(val) => handleFieldChange(field.key, val)}
                    delay={i * 0.03}
                  />
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
