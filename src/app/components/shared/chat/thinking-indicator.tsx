import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function ThinkingIndicator({ steps }: { steps: string[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 600 + Math.random() * 400);
    return () => clearTimeout(timer);
  }, [currentStep, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-1.5"
    >
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={i <= currentStep ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          {i < currentStep ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <circle cx="7" cy="7" r="7" fill="var(--color-primary-brand)" />
              <path d="M4 7.2L6 9.2L10 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : i === currentStep ? (
            <motion.div
              className="w-[14px] h-[14px] shrink-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#e0e5e9" strokeWidth="1.5" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="var(--color-primary-brand)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          ) : (
            <div className="w-[14px] h-[14px] shrink-0 rounded-full border border-[#e0e5e9]" />
          )}
          <span
            className={`text-[12px] leading-[18px] ${
              i <= currentStep ? "text-text-secondary" : "text-[#c0c8ce]"
            }${i === currentStep ? " font-medium" : ""}`}
          >
            {step}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
