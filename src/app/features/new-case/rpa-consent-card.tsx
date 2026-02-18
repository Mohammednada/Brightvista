import { motion } from "motion/react";
import { Lock, Globe, FileText, Upload, ShieldCheck } from "lucide-react";

const rpaPermissions = [
  { icon: Globe, label: "Portal Login", desc: "Authenticate to Aetna provider portal" },
  { icon: FileText, label: "Form Submission", desc: "Auto-fill and submit PA request form" },
  { icon: Upload, label: "Document Upload", desc: "Attach clinical documents to submission" },
];

export function RpaConsentCard({ onAuthorize, onDeny }: { onAuthorize: () => void; onDeny: () => void }) {
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
          <div className="w-10 h-10 rounded-lg bg-[#f3eff8] flex items-center justify-center">
            <Lock size={15} className="text-[#7C3AED]" />
          </div>
          <div>
            <span className="text-text-primary block text-[14px] font-bold">
              Portal Credential Authorization
            </span>
            <span className="text-[11px] text-[#8896a6]">
              Aetna provider portal access
            </span>
          </div>
        </div>
        <p className="text-[13px] text-[#6b7c93] leading-[1.6]">
          The RPA bot needs your provider credentials to log into the Aetna portal and submit the PA request for <strong>James Rodriguez</strong> (CT Abdomen &amp; Pelvis).
        </p>
      </div>

      {/* Permissions */}
      <div className="px-5 py-3">
        <span className="text-[10px] text-[#94a3b8] tracking-wide block mb-2 font-semibold">
          PORTAL ACTIONS
        </span>
        <div className="flex flex-col gap-1.5">
          {rpaPermissions.map((perm, i) => {
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
                <span className="text-[11px] text-[#3d4f5f] font-medium">{perm.label}</span>
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
          <span className="font-medium">Credentials used in-session only &middot; Encrypted &middot; Never stored</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 pt-1 flex items-center gap-2.5">
        <button
          onClick={onDeny}
          className="flex-1 py-2 rounded-lg border border-[#e5e8ee] text-[12px] text-[#6b7c93] bg-white hover:bg-[#f8f9fb] transition-colors cursor-pointer font-medium"
        >
          Deny
        </button>
        <button
          onClick={onAuthorize}
          className="flex-[1.5] py-2 rounded-lg bg-[#7C3AED] text-[12px] text-white hover:bg-[#6d28d9] transition-colors cursor-pointer font-semibold"
        >
          Authorize Portal Access
        </button>
      </div>
    </motion.div>
  );
}
