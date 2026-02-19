import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Upload, CheckCircle, Camera, File } from "lucide-react";
import { uploadOcrSteps, captureOcrSteps } from "@/mock/new-case";

// ── Document Upload Zone ──────────────────────────────────────────────────────

export function DocumentUploadZone({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"idle" | "selected" | "processing" | "done">("idle");
  const [ocrStep, setOcrStep] = useState(0);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleUpload = () => {
    setPhase("selected");
    timerRef.current = setTimeout(() => {
      setPhase("processing");
    }, 1200);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase !== "processing") return;
    if (ocrStep >= uploadOcrSteps.length - 1) {
      const t = setTimeout(() => {
        setPhase("done");
        if (!completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 1000);
        }
      }, 800);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      setOcrStep(prev => prev + 1);
    }, 700 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [phase, ocrStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[85%] rounded-xl border border-border-default bg-card-bg overflow-hidden shadow-sm"
    >
      {phase === "idle" && (
        <div
          onClick={handleUpload}
          className="p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-surface-hover transition-colors border-2 border-dashed border-border-default m-3 rounded-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-bg flex items-center justify-center">
            <Upload size={22} className="text-[#3385f0]" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[13px] text-text-primary font-semibold">
              Click to upload or drag & drop
            </span>
            <span className="text-[11px] text-text-muted">
              PDF, JPG, PNG, TIFF -- Max 25MB
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            {["Referral Letter", "Lab Results", "Insurance Card"].map(label => (
              <span key={label} className="text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {phase === "selected" && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-surface-bg rounded-lg px-3 py-2.5 border border-border-default">
            <File size={18} className="text-[#3385f0] shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[12px] text-text-primary block truncate font-medium">
                Patient_Referral_Thompson_Margaret.pdf
              </span>
              <span className="text-[10px] text-text-muted">2.4 MB</span>
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="var(--color-border-default)" strokeWidth="2" />
                <path d="M8 2A6 6 0 0 1 14 8" stroke="#3385f0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>
          <span className="text-[11px] text-text-muted text-center">
            Preparing document for OCR analysis...
          </span>
        </div>
      )}

      {phase === "processing" && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <File size={14} className="text-[#3385f0] shrink-0" />
            <span className="text-[12px] text-text-primary font-medium">
              Patient_Referral_Thompson_Margaret.pdf
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {uploadOcrSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={i <= ocrStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {i < ocrStep ? (
                  <CheckCircle size={12} className="text-[#22c55e] shrink-0" />
                ) : i === ocrStep ? (
                  <motion.div className="shrink-0" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="var(--color-border-default)" strokeWidth="1.5" />
                      <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#3385f0" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="w-3 h-3 shrink-0" />
                )}
                <span
                  className={`text-[11px] ${i <= ocrStep ? "text-text-secondary" : "text-text-muted"}${i === ocrStep ? " font-medium" : ""}`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="p-5 flex flex-col items-center gap-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={28} className="text-[#22c55e]" />
          </motion.div>
          <span className="text-[13px] text-[#166534] font-semibold">
            Document processed successfully
          </span>
          <span className="text-[11px] text-[#4ade80]">
            8 fields extracted via OCR
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ── Document Capture Zone ─────────────────────────────────────────────────────

export function DocumentCaptureZone({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"viewfinder" | "captured" | "processing" | "done">("viewfinder");
  const [ocrStep, setOcrStep] = useState(0);
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCapture = () => {
    setPhase("captured");
    timerRef.current = setTimeout(() => setPhase("processing"), 1500);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (phase !== "processing") return;
    if (ocrStep >= captureOcrSteps.length - 1) {
      const t = setTimeout(() => {
        setPhase("done");
        if (!completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 1000);
        }
      }, 800);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => {
      setOcrStep(prev => prev + 1);
    }, 700 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [phase, ocrStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[85%] rounded-xl border border-border-default bg-card-bg overflow-hidden shadow-sm"
    >
      {phase === "viewfinder" && (
        <div className="flex flex-col">
          <div className="bg-[#0a0a0f] h-[200px] relative flex items-center justify-center">
            <div className="absolute inset-6">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/60 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/60 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60 rounded-br-md" />
            </div>
            <motion.div
              className="absolute left-6 right-6 h-0.5 bg-[#4ade80]/50"
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-[140px] h-[100px] bg-white/10 rounded border border-white/20 flex flex-col items-center justify-center gap-1.5 p-3">
              <div className="w-full h-1.5 bg-white/20 rounded" />
              <div className="w-[80%] h-1.5 bg-white/15 rounded" />
              <div className="w-[90%] h-1.5 bg-white/15 rounded" />
              <div className="w-[70%] h-1.5 bg-white/10 rounded" />
              <div className="w-[85%] h-1.5 bg-white/10 rounded" />
            </div>
            <span className="absolute bottom-3 text-[10px] text-white/60">
              Position document within the frame
            </span>
          </div>
          <button
            onClick={handleCapture}
            className="m-3 flex items-center justify-center gap-2 bg-brand text-white rounded-lg py-2.5 cursor-pointer hover:bg-[#2d5a7a] transition-colors"
          >
            <Camera size={16} />
            <span className="text-[13px] font-medium">
              Capture Document
            </span>
          </button>
        </div>
      )}

      {phase === "captured" && (
        <div className="p-5 flex flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-[180px] h-[120px] bg-surface-bg rounded-lg border border-border-default flex flex-col items-center justify-center gap-1.5 p-4"
          >
            <div className="w-full h-1.5 bg-[#1a365d]/20 rounded" />
            <div className="w-[80%] h-1.5 bg-[#1a365d]/15 rounded" />
            <div className="w-[90%] h-1.5 bg-[#1a365d]/15 rounded" />
            <div className="w-[70%] h-1.5 bg-[#1a365d]/10 rounded" />
            <div className="w-[85%] h-1.5 bg-[#1a365d]/10 rounded" />
          </motion.div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="var(--color-border-default)" strokeWidth="2" />
              <path d="M10 2A8 8 0 0 1 18 10" stroke="#096" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <span className="text-[12px] text-text-muted">
            Image captured. Preparing for OCR...
          </span>
        </div>
      )}

      {phase === "processing" && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={14} className="text-[#096] shrink-0" />
            <span className="text-[12px] text-text-primary font-medium">
              Captured document image
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {captureOcrSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={i <= ocrStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {i < ocrStep ? (
                  <CheckCircle size={12} className="text-[#22c55e] shrink-0" />
                ) : i === ocrStep ? (
                  <motion.div className="shrink-0" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="var(--color-border-default)" strokeWidth="1.5" />
                      <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#096" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="w-3 h-3 shrink-0" />
                )}
                <span
                  className={`text-[11px] ${i <= ocrStep ? "text-text-secondary" : "text-text-muted"}${i === ocrStep ? " font-medium" : ""}`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="p-5 flex flex-col items-center gap-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={28} className="text-[#22c55e]" />
          </motion.div>
          <span className="text-[13px] text-[#166534] font-semibold">
            Document scanned successfully
          </span>
          <span className="text-[11px] text-[#4ade80]">
            8 fields extracted via OCR
          </span>
        </div>
      )}
    </motion.div>
  );
}
