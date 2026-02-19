import { useState } from "react";
import { motion } from "motion/react";
import { User, Pencil, Check } from "lucide-react";
import type {
  PatientData,
  PatientFieldConfidence,
  FieldConfidence,
  CaseBuilderAction,
} from "../state/case-builder-state";

// ── Confidence Badge ─────────────────────────────────────────────────────────

function ConfidenceBadge({ confidence }: { confidence?: FieldConfidence }) {
  if (!confidence) return null;

  if (confidence.verified && confidence.source === "ehr") {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#dcfce7] text-[#099F69]">
        Verified
      </span>
    );
  }
  if (confidence.source === "ocr" || confidence.source === "ai") {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#dbeafe] text-[#2563eb]">
        AI Extracted
      </span>
    );
  }
  if (confidence.needsReview) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#fef3cd] text-[#F3903F]">
        Needs Review
      </span>
    );
  }
  return null;
}

// ── Editable Field ───────────────────────────────────────────────────────────

interface EditableFieldProps {
  label: string;
  value: string;
  confidence?: FieldConfidence;
  isEditing: boolean;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  delay?: number;
}

function EditableField({ label, value, confidence, isEditing, onChange, fullWidth, delay = 0 }: EditableFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={fullWidth ? "col-span-2" : ""}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{label}</span>
        <ConfidenceBadge confidence={confidence} />
      </div>
      {isEditing ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-[13px] text-text-primary bg-card-bg border border-border-default rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all"
        />
      ) : (
        <p className="text-[13px] text-text-primary font-medium leading-snug truncate">
          {value || <span className="text-text-muted italic">Not provided</span>}
        </p>
      )}
    </motion.div>
  );
}

// ── Patient Card ─────────────────────────────────────────────────────────────

interface PatientCardProps {
  patient: Partial<PatientData>;
  confidence: PatientFieldConfidence;
  dispatch: React.Dispatch<CaseBuilderAction>;
}

type PatientFieldKey = keyof PatientData;

const fieldConfig: { key: PatientFieldKey; label: string; fullWidth?: boolean }[] = [
  { key: "name", label: "Full Name", fullWidth: true },
  { key: "dob", label: "Date of Birth" },
  { key: "mrn", label: "MRN" },
  { key: "insurancePayer", label: "Insurance Payer" },
  { key: "memberId", label: "Member ID" },
  { key: "planType", label: "Plan Type" },
  { key: "referringPhysician", label: "Referring Physician", fullWidth: true },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
];

export function PatientCard({ patient, confidence, dispatch }: PatientCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleFieldChange = (field: PatientFieldKey, value: string) => {
    dispatch({ type: "SET_PATIENT_FIELD", payload: { field, value } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card-bg rounded-2xl border border-border-default overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand/10 flex items-center justify-center">
            <User size={13} className="text-brand" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">Patient Information</span>
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
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
        {fieldConfig.map((field, i) => (
          <EditableField
            key={field.key}
            label={field.label}
            value={patient[field.key] || ""}
            confidence={confidence[field.key]}
            isEditing={isEditing}
            onChange={(val) => handleFieldChange(field.key, val)}
            fullWidth={field.fullWidth}
            delay={i * 0.04}
          />
        ))}
      </div>
    </motion.div>
  );
}
