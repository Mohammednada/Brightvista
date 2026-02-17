import { motion } from "motion/react";
import { Lock, Users, ShieldCheck, Activity, FileText } from "lucide-react";

const consentPermissions = [
  { icon: Users, label: "Patient Demographics", desc: "Name, DOB, MRN, address, contact" },
  { icon: ShieldCheck, label: "Insurance Coverage", desc: "Payer, member ID, plan type, group" },
  { icon: Activity, label: "Clinical Records", desc: "Referring provider, care team, notes" },
  { icon: FileText, label: "PA Case History", desc: "Prior authorization records & status" },
];

export function EHRConsentCard({ onAuthorize, onCancel }: { onAuthorize: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[88%] rounded-xl overflow-hidden bg-white border border-[#e5e8ee]"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#f0f2f5]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
            <Lock size={15} className="text-[#1F425F]" />
          </div>
          <div>
            <span className="text-[#1b2124] block text-[14px]" style={{ fontWeight: 700 }}>
              Connect to Epic EHR
            </span>
            <span className="text-[11px] text-[#8896a6]">
              Read-only access for this session
            </span>
          </div>
        </div>
        <p className="text-[13px] text-[#6b7c93] leading-[1.6]">
          NorthStar AI Agent needs permission to access Epic Hyperspace on your behalf to search and extract patient data for this PA case.
        </p>
      </div>

      {/* Permissions */}
      <div className="px-5 py-3">
        <span className="text-[10px] text-[#94a3b8] tracking-wide block mb-2" style={{ fontWeight: 600 }}>
          DATA ACCESS
        </span>
        <div className="flex flex-col gap-1.5">
          {consentPermissions.map((perm, i) => {
            const Icon = perm.icon;
            return (
              <motion.div
                key={perm.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.2 }}
                className="flex items-center gap-2.5 py-1.5"
              >
                <Icon size={13} className="text-[#8896a6] shrink-0" />
                <span className="text-[11px] text-[#3d4f5f]" style={{ fontWeight: 500 }}>{perm.label}</span>
                <span className="text-[10px] text-[#b0bac5]">&middot;</span>
                <span className="text-[10px] text-[#94a3b8] truncate">{perm.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Security note */}
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 text-[10px] text-[#6b8f71]">
          <ShieldCheck size={11} className="text-[#6b8f71] shrink-0" />
          <span style={{ fontWeight: 500 }}>HIPAA compliant &middot; TLS encrypted &middot; Session-scoped</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 pt-1 flex items-center gap-2.5">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg border border-[#e5e8ee] text-[12px] text-[#6b7c93] bg-white hover:bg-[#f8f9fb] transition-colors cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          Deny
        </button>
        <button
          onClick={onAuthorize}
          className="flex-[1.5] py-2 rounded-lg bg-[#1F425F] text-[12px] text-white hover:bg-[#2a5474] transition-colors cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          Authorize
        </button>
      </div>
    </motion.div>
  );
}
