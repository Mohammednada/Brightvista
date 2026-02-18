import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  Lock,
  Globe,
  Search,
  Bell,
  Settings,
  Calendar,
  BarChart3,
  Users,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Activity,
  User,
  ChevronRight,
} from "lucide-react";
import { TypeWriter } from "./chat-components";
import {
  ehrSteps,
  ehrLoadingSteps,
  patientRecordFields,
  ehrDashboardMetrics,
  ehrRecentActivity,
} from "@/mock/new-case";

// ── Agent cursor ──────────────────────────────────────────────────────────────

function AgentCursor({ x, y, visible = true }: { x: string; y: string; visible?: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, left: x, top: y }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M1 1L1 15.5L5.5 11.5L9 19L12 17.5L8.5 10L14 9.5L1 1Z" fill="var(--color-primary-brand)" stroke="white" strokeWidth="1.2" />
      </svg>
      <motion.div
        className="absolute left-4 top-4 bg-brand rounded-full px-1.5 py-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
      >
        <span className="text-white text-[6px] font-semibold">Agent</span>
      </motion.div>
    </motion.div>
  );
}

// ── EHR Shared Layout ─────────────────────────────────────────────────────────

const sidebarNav = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Calendar, label: "Schedule" },
  { icon: Users, label: "Patients" },
  { icon: ClipboardList, label: "Orders" },
  { icon: BarChart3, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

function EHRLayout({
  children,
  activeNav = 0,
  breadcrumbs,
  highlightNav,
}: {
  children: React.ReactNode;
  activeNav?: number;
  breadcrumbs?: string[];
  highlightNav?: number;
}) {
  return (
    <div className="flex flex-col h-[340px]">
      {/* Top nav bar */}
      <div className="h-[36px] bg-[#0f2440] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-[18px] h-[18px] bg-gradient-to-br from-[#4da8da] to-[#2563eb] rounded flex items-center justify-center">
              <span className="text-white text-[7px]" style={{ fontWeight: 800, letterSpacing: "0.5px" }}>E</span>
            </div>
            <span className="text-white/90 text-[10px] font-semibold">Hyperspace</span>
          </div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1 ml-2">
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={8} className="text-white/30" />}
                  <span className={`text-[9px] ${i === breadcrumbs.length - 1 ? "text-white/80 font-medium" : "text-white/40"}`}>
                    {bc}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/10 rounded px-2 py-0.5">
            <Search size={9} className="text-white/40" />
            <span className="text-[8px] text-white/30">Search</span>
          </div>
          <Bell size={11} className="text-white/40" />
          <div className="w-[18px] h-[18px] rounded-full bg-[#4da8da] flex items-center justify-center">
            <span className="text-white text-[7px] font-semibold">NS</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Icon sidebar */}
        <div className="w-[52px] bg-[#152d4a] flex flex-col items-center py-2 gap-0.5 shrink-0">
          {sidebarNav.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === activeNav;
            const isHighlight = i === highlightNav;
            return (
              <motion.div
                key={item.label}
                className={`w-[42px] flex flex-col items-center gap-0.5 rounded-md py-1.5 cursor-pointer transition-colors ${
                  isActive ? "bg-white/15" : isHighlight ? "bg-white/10" : "hover:bg-white/5"
                }`}
                animate={isHighlight ? { backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)"] } : {}}
                transition={isHighlight ? { duration: 1.2, repeat: Infinity } : {}}
              >
                <Icon size={14} className={isActive || isHighlight ? "text-white" : "text-white/40"} />
                <span className={`text-[7px] ${isActive || isHighlight ? "text-white/90" : "text-white/35"}${isActive ? " font-semibold" : ""}`}>
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-[#f3f5f8] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── EHR Screens ───────────────────────────────────────────────────────────────

function EHRScreenLoading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = ehrLoadingSteps.map((_, i) =>
      setTimeout(() => setStep(i), 400 + i * 450)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[340px] bg-[#0f2440] gap-5">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4da8da] to-[#1a5fb4] flex items-center justify-center shadow-lg shadow-[#4da8da]/20"
          animate={{ boxShadow: ["0 0 20px rgba(77,168,218,0.2)", "0 0 40px rgba(77,168,218,0.4)", "0 0 20px rgba(77,168,218,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white text-[16px]" style={{ fontWeight: 800, letterSpacing: "1px" }}>Epic</span>
        </motion.div>
        <span className="text-white/90 text-[13px] font-semibold">Hyperspace</span>
        <span className="text-white/40 text-[10px]">Electronic Health Record System</span>
      </div>
      <div className="flex flex-col gap-1.5 w-[200px]">
        {ehrLoadingSteps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={i <= step ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {i < step ? (
              <CheckCircle size={10} className="text-[#4ade80] shrink-0" />
            ) : i === step ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#334e68" strokeWidth="1.5" />
                  <path d="M5 1A4 4 0 0 1 9 5" stroke="#4da8da" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.div>
            ) : (
              <div className="w-[10px] h-[10px] shrink-0" />
            )}
            <span className={`text-[9px] ${i <= step ? "text-white/70" : "text-white/20"}`}>{s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EHRScreenLogin() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1300);
    const t3 = setTimeout(() => setPhase(3), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="flex h-[340px]">
      <div className="w-[180px] bg-gradient-to-b from-[#0f2440] to-[#1a3a5c] flex flex-col items-center justify-center p-5 gap-4 shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4da8da] to-[#1a5fb4] flex items-center justify-center">
          <span className="text-white text-[14px]" style={{ fontWeight: 800, letterSpacing: "0.5px" }}>Epic</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/90 text-[12px] font-semibold">Hyperspace</span>
          <span className="text-white/30 text-[8px] text-center">NorthStar Health Center</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <ShieldCheck size={10} className="text-[#4ade80]" />
          <span className="text-[#4ade80] text-[8px]">HIPAA Compliant</span>
        </div>
      </div>
      <div className="flex-1 bg-white flex flex-col items-center justify-center px-6 relative">
        <AgentCursor
          x={phase >= 1 ? (phase >= 3 ? "52%" : "50%") : "60%"}
          y={phase >= 1 ? (phase >= 2 ? (phase >= 3 ? "64%" : "56%") : "44%") : "30%"}
        />
        <div className="w-full max-w-[220px]">
          <span className="text-[#1a365d] text-[14px] block mb-4 font-semibold">Sign in to continue</span>
          <div className="flex flex-col gap-2.5">
            <div>
              <label className="text-[9px] text-[#6b7c93] mb-0.5 block font-medium">Username</label>
              <div className={`border rounded-md px-2.5 py-[7px] text-[11px] min-h-[30px] flex items-center transition-colors ${phase >= 1 ? "border-[#4da8da] bg-[#f8fbff]" : "border-[#dfe4ea] bg-[#f8f9fb]"}`}>
                {phase >= 1 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#1a365d]">svc_northstar_agent</motion.span>
                ) : (
                  <span className="text-[#b0b9c4]">Enter username</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-[9px] text-[#6b7c93] mb-0.5 block font-medium">Password</label>
              <div className={`border rounded-md px-2.5 py-[7px] text-[11px] min-h-[30px] flex items-center transition-colors ${phase >= 2 ? "border-[#4da8da] bg-[#f8fbff]" : "border-[#dfe4ea] bg-[#f8f9fb]"}`}>
                {phase >= 2 ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#1a365d] tracking-[2px]">************</motion.span>
                ) : phase >= 1 ? (
                  <span className="animate-pulse text-[#b0b9c4]">|</span>
                ) : (
                  <span className="text-[#b0b9c4]">Enter password</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <div className="w-3.5 h-3.5 border border-[#cdd5de] rounded-[3px] bg-white" />
                <span className="text-[8px] text-[#6b7c93]">Remember me</span>
              </label>
              <span className="text-[8px] text-[#4da8da]">Forgot password?</span>
            </div>
            <motion.button
              className={`w-full rounded-lg py-2 text-[11px] text-white transition-all font-semibold ${phase >= 3 ? "bg-[#2563eb] shadow-md shadow-[#2563eb]/20" : "bg-[#a0b4cc]"}`}
              animate={phase >= 3 ? { scale: [1, 0.97, 1] } : {}}
              transition={{ duration: 0.25 }}
            >
              {phase >= 3 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" /><path d="M5 1A4 4 0 0 1 9 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </motion.div>
                  Signing in...
                </span>
              ) : "Sign In"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

const dashboardMetricStyles: Record<string, { icon: typeof Users; color: string; bg: string }> = {
  "Active Patients": { icon: Users, color: "#2563eb", bg: "#eff6ff" },
  "Today's Appointments": { icon: Calendar, color: "#059669", bg: "#f0fdf4" },
  "Pending Orders": { icon: ClipboardList, color: "#d97706", bg: "#fffbeb" },
  "Alerts": { icon: Activity, color: "#dc2626", bg: "#fef2f2" },
};

function EHRScreenDashboard() {
  return (
    <EHRLayout activeNav={0} breadcrumbs={["Home", "Dashboard"]}>
      <div className="p-3 h-full overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[13px] text-[#1a365d] block font-semibold">Good morning, NorthStar Agent</span>
            <span className="text-[9px] text-[#6b7c93]">Feb 15, 2026 &middot; NorthStar Health Center</span>
          </div>
          <motion.div className="flex items-center gap-1 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-2 py-0.5" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[8px] text-[#166534] font-medium">Online</span>
          </motion.div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {ehrDashboardMetrics.map(({ label, value }) => {
            const style = dashboardMetricStyles[label];
            const Icon = style.icon;
            return (
              <div key={label} className="bg-white rounded-lg border border-[#eaedf2] p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[7px] text-[#6b7c93] font-medium">{label}</span>
                  <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: style.bg }}>
                    <Icon size={8} style={{ color: style.color }} />
                  </div>
                </div>
                <span className="text-[14px] text-[#1a365d] font-bold">{value}</span>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-lg border border-[#eaedf2] p-2">
          <span className="text-[9px] text-[#1a365d] block mb-1.5 font-semibold">Recent Activity</span>
          {ehrRecentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#f5f6f8] last:border-0">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[8px] text-[#4a5568]">{item.text}</span>
              </div>
              <span className="text-[7px] text-[#a0aec0]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </EHRLayout>
  );
}

function EHRScreenNavigating() {
  return (
    <EHRLayout activeNav={0} breadcrumbs={["Home", "Dashboard"]} highlightNav={2}>
      <div className="flex flex-col items-center justify-center h-full gap-3 relative">
        <AgentCursor x="7%" y="40%" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Users size={22} className="text-[#1a365d]" />
        </motion.div>
        <span className="text-[12px] text-[#1a365d] font-medium">
          Opening Patient Search module...
        </span>
        <div className="w-[120px] h-1 bg-[#e2e8f0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#2563eb] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </EHRLayout>
  );
}

function EHRScreenSearch() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <EHRLayout activeNav={2} breadcrumbs={["Home", "Patients", "Search"]}>
      <div className="p-3 h-full overflow-hidden relative">
        <AgentCursor x={phase >= 2 ? "30%" : "45%"} y={phase >= 2 ? "52%" : "18%"} />
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] text-[#1a365d] font-semibold">Patient Search</span>
          <span className="text-[8px] text-[#6b7c93] bg-[#f5f7fa] px-2 py-0.5 rounded">Advanced Search</span>
        </div>
        <div className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 mb-3 transition-colors ${phase >= 1 ? "border-[#4da8da] shadow-sm shadow-[#4da8da]/10" : "border-[#dfe4ea]"}`}>
          <Search size={13} className="text-[#6b7c93] shrink-0" />
          <span className="text-[11px] text-[#1a365d] flex-1">
            {phase >= 1 ? (
              <TypeWriter text="Margaret Thompson" speed={55} />
            ) : (
              <span className="text-[#a0aec0]">Search by name, MRN, or DOB...</span>
            )}
          </span>
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#2563eb] rounded px-1.5 py-0.5">
              <span className="text-white text-[7px] font-semibold">Search</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1.5 mb-2.5">
          {["All Patients", "Active", "Inactive", "Recent"].map((f, i) => (
            <span key={f} className={`text-[7px] px-2 py-0.5 rounded-full border font-medium ${i === 0 ? "bg-[#2563eb] text-white border-[#2563eb]" : "text-[#6b7c93] border-[#e2e8f0]"}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
          <div className="grid grid-cols-[1.4fr_0.8fr_1fr_1fr_0.6fr] gap-1 px-3 py-1.5 bg-[#f8f9fb] border-b border-[#eef0f4]">
            {["Patient Name", "DOB", "MRN", "Insurance", "Status"].map(h => (
              <span key={h} className="text-[8px] text-[#6b7c93] font-semibold">{h}</span>
            ))}
          </div>
          {phase >= 2 ? (
            <>
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="grid grid-cols-[1.4fr_0.8fr_1fr_1fr_0.6fr] gap-1 px-3 py-2 bg-[#eff6ff] border-l-[3px] border-[#2563eb]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#dbeafe] flex items-center justify-center"><User size={8} className="text-[#2563eb]" /></div>
                  <span className="text-[10px] text-[#1a365d] font-semibold">Margaret Thompson</span>
                </div>
                <span className="text-[10px] text-[#4a5568]">03/15/1958</span>
                <span className="text-[10px] text-[#4a5568]">NHC-2024-88421</span>
                <span className="text-[10px] text-[#4a5568]">BCBS PPO Gold</span>
                <span className="text-[7px] bg-[#f0fdf4] text-[#166534] px-1.5 py-0.5 rounded-full w-fit font-medium">Active</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.15 }} className="grid grid-cols-[1.4fr_0.8fr_1fr_1fr_0.6fr] gap-1 px-3 py-2 border-t border-[#f5f6f8]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#f5f6f8] flex items-center justify-center"><User size={8} className="text-[#a0aec0]" /></div>
                  <span className="text-[10px] text-[#6b7c93]">Margaret Thomas</span>
                </div>
                <span className="text-[10px] text-[#a0aec0]">11/22/1974</span>
                <span className="text-[10px] text-[#a0aec0]">NHC-2023-55109</span>
                <span className="text-[10px] text-[#a0aec0]">Aetna HMO</span>
                <span className="text-[7px] bg-[#f5f6f8] text-[#a0aec0] px-1.5 py-0.5 rounded-full w-fit font-medium">Active</span>
              </motion.div>
            </>
          ) : (
            <div className="px-3 py-6 flex items-center justify-center">
              {phase >= 1 ? (
                <div className="flex items-center gap-2 text-[10px] text-[#6b7c93]">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#dfe4ea" strokeWidth="1.5" /><path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </motion.div>
                  Searching patient records...
                </div>
              ) : (
                <span className="text-[10px] text-[#a0aec0]">Enter a search term to find patients</span>
              )}
            </div>
          )}
        </div>
      </div>
    </EHRLayout>
  );
}

function EHRScreenPatientRecord() {
  const [highlightedFields, setHighlightedFields] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timers = patientRecordFields.map((_, i) =>
      setTimeout(() => setHighlightedFields(prev => [...prev, i]), 250 + i * 260)
    );
    timers.push(setTimeout(() => setActiveTab(1), 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <EHRLayout activeNav={2} breadcrumbs={["Home", "Patients", "Margaret Thompson"]}>
      <div className="h-full overflow-hidden flex flex-col">
        <div className="bg-white border-b border-[#eaedf2] px-3 py-2 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4da8da] to-[#2563eb] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-bold">MT</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#1a365d] font-semibold">Margaret Thompson</span>
              <span className="text-[7px] bg-[#f0fdf4] text-[#166534] px-1.5 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <div className="flex items-center gap-3 text-[8px] text-[#6b7c93]">
              <span>DOB: 03/15/1958</span>
              <span>MRN: NHC-2024-88421</span>
              <span>BCBS PPO Gold</span>
            </div>
          </div>
          <motion.div className="flex items-center gap-1 bg-[#eef0ff] rounded-full px-2 py-0.5" animate={{ opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Activity size={8} className="text-[#818cf8]" />
            <span className="text-[7px] text-[#6366f1] font-medium">Extracting</span>
          </motion.div>
        </div>
        <div className="bg-white border-b border-[#eaedf2] px-3 flex items-center gap-0 shrink-0">
          {["Demographics", "Insurance", "History", "Documents"].map((tab, i) => (
            <motion.div
              key={tab}
              className={`px-3 py-1.5 text-[9px] border-b-2 cursor-pointer transition-colors ${
                (activeTab >= 1 && i === 1) ? "border-[#2563eb] text-[#2563eb]" : i === 0 && activeTab === 0 ? "border-[#2563eb] text-[#2563eb]" : "border-transparent text-[#6b7c93]"
              }${(i === 0 && activeTab === 0) || (i === 1 && activeTab >= 1) ? " font-semibold" : ""}`}
            >
              {tab}
            </motion.div>
          ))}
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {patientRecordFields.map((field, i) => {
              const isHighlighted = highlightedFields.includes(i);
              return (
                <motion.div
                  key={i}
                  className={`rounded-lg px-2.5 py-[7px] border transition-all relative overflow-hidden ${
                    isHighlighted ? "bg-[#f0fdf4] border-[#86efac]" : "bg-white border-[#eaedf2]"
                  }`}
                  animate={isHighlighted ? { scale: [1, 1.01, 1] } : {}}
                  transition={{ duration: 0.25 }}
                >
                  {!isHighlighted && i === highlightedFields.length && (
                    <motion.div
                      className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-transparent via-[#818cf8]/10 to-transparent"
                      animate={{ y: ["-100%", "100%"] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  <div className="flex items-center gap-1 mb-0.5">
                    {isHighlighted && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                        <CheckCircle size={9} className="text-[#22c55e] shrink-0" />
                      </motion.div>
                    )}
                    <span className="text-[7px] text-[#6b7c93] font-medium">{field.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${isHighlighted ? "text-[#166534]" : "text-[#1a365d]"}`}>
                    {field.value}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </EHRLayout>
  );
}

function EHRScreenComplete() {
  return (
    <EHRLayout activeNav={2} breadcrumbs={["Home", "Patients", "Margaret Thompson"]}>
      <div className="flex flex-col items-center justify-center h-full gap-3 bg-gradient-to-b from-[#f0fdf4] to-[#f3f5f8]">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-12 h-12 rounded-full bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e]/20"
        >
          <CheckCircle size={24} className="text-white" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[13px] text-[#166534] font-semibold">Data Extraction Complete</span>
          <span className="text-[10px] text-[#22c55e]">8 fields extracted from patient record</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 mt-1"
        >
          {[
            { label: "Demographics", count: "4" },
            { label: "Insurance", count: "3" },
            { label: "Provider", count: "1" },
          ].map(({ label, count }) => (
            <div key={label} className="flex items-center gap-1">
              <CheckCircle size={8} className="text-[#22c55e]" />
              <span className="text-[8px] text-[#4a5568]">{label}</span>
              <span className="text-[8px] text-[#22c55e] bg-[#f0fdf4] px-1 rounded font-semibold">{count}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </EHRLayout>
  );
}

// ── EHR Agent Panel (main export) ─────────────────────────────────────────────

export function EHRAgentPanel({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [screenKey, setScreenKey] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (currentStep >= ehrSteps.length - 1) {
      if (!completedRef.current) {
        completedRef.current = true;
        const t = setTimeout(onComplete, 1500);
        return () => clearTimeout(t);
      }
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setScreenKey((prev) => prev + 1);
    }, ehrSteps[currentStep].duration);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  const progress = ((currentStep + 1) / ehrSteps.length) * 100;
  const step = ehrSteps[currentStep];
  const isDone = currentStep >= ehrSteps.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[85%] rounded-xl overflow-hidden shadow-lg border border-[#2a2a3a]"
    >
      {/* Browser chrome */}
      <div className="bg-[#1e1e2e] px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-[#2a2a3e] rounded-lg px-3 py-1.5 mx-2">
          <Lock size={10} className="text-[#4ade80] shrink-0" />
          <span className="text-[11px] text-[#a0a0c0] truncate">
            {step.url}
          </span>
        </div>
        <Globe size={12} className="text-[#666680] shrink-0" />
      </div>

      {/* Screen content */}
      <div className="bg-[#2a2a3e] p-2.5">
        <div className="bg-[#f8f9fc] min-h-[340px] relative overflow-hidden rounded-lg border border-[#3a3a50] shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={screenKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {currentStep === 0 && <EHRScreenLoading />}
              {currentStep === 1 && <EHRScreenLogin />}
              {currentStep === 2 && <EHRScreenDashboard />}
              {currentStep === 3 && <EHRScreenNavigating />}
              {currentStep === 4 && <EHRScreenSearch />}
              {currentStep === 5 && <EHRScreenPatientRecord />}
              {currentStep === 6 && <EHRScreenComplete />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress footer */}
      <div className="bg-[#1e1e2e] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {isDone ? (
                <CheckCircle size={12} className="text-[#4ade80] shrink-0" />
              ) : (
                <motion.div
                  className="w-3 h-3 shrink-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#444460" strokeWidth="1.5" />
                    <path d="M6 1.5A4.5 4.5 0 0 1 10.5 6" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              )}
              <span
                className="text-[11px] text-[#c0c0d8] font-medium"
              >
                {step.label}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2a2a3e] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: isDone ? "#4ade80" : "#818cf8" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className="text-[10px] text-[#666680] shrink-0">
            {currentStep + 1}/{ehrSteps.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
