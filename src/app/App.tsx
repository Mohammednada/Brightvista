import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar } from "./components/sidebar";
import { DashboardHeader } from "./components/dashboard-header";
import { KpiCards } from "./components/kpi-cards";
import { NeedsAttention } from "./components/needs-attention";
import { AllocationChart } from "./components/allocation-chart";
import { AuthorizationVolume } from "./components/authorization-volume";
import { AgentActivities } from "./components/agent-activities";
import { ActiveCoordinators } from "./components/active-coordinators";
import { RightPanel, type RightPanelHandle } from "./components/right-panel";
import { CoordinatorMainContent } from "./components/coordinator-dashboard";
import { NewCasePage } from "./components/new-case-page";
import type { RoleId } from "./components/role-switcher";

function ManagerMainContent({ isPanelOpen, onTogglePanel, onAskAgent }: { isPanelOpen: boolean; onTogglePanel: () => void; onAskAgent: (text: string) => void }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative border-r border-[#e5e5e5]">
      <DashboardHeader isPanelOpen={isPanelOpen} onTogglePanel={onTogglePanel} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* KPI Cards */}
        <KpiCards onAskAgent={onAskAgent} />

        {/* Divider */}
        <div className="h-px w-full bg-[#e5e5e5]" />

        {/* Needs Attention */}
        <NeedsAttention onAskAgent={onAskAgent} />

        {/* Allocation Per Department */}
        <AllocationChart />

        {/* Authorization Volume + Agent Activities */}
        <div className="flex w-full border-b border-[#e5e5e5]" style={{ height: "526px" }}>
          <AuthorizationVolume />
          <AgentActivities />
        </div>

        {/* Active Coordinators */}
        <ActiveCoordinators />
      </div>
    </div>
  );
}

export default function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeRole, setActiveRole] = useState<RoleId>("pa-manager");
  const [currentView, setCurrentView] = useState("dashboard");
  const rightPanelRef = useRef<RightPanelHandle>(null);

  const handleAskAgent = useCallback((text: string) => {
    if (!isPanelOpen) {
      setIsPanelOpen(true);
      // Wait for panel to mount before sending
      setTimeout(() => {
        rightPanelRef.current?.sendMessage(text);
      }, 350);
    } else {
      rightPanelRef.current?.sendMessage(text);
    }
  }, [isPanelOpen]);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
  }, []);

  // Reset view to dashboard when switching roles
  const handleRoleChange = useCallback((role: RoleId) => {
    setActiveRole(role);
    setCurrentView("dashboard");
  }, []);

  // Determine if the right panel should show (not on new-case page)
  const showRightPanel = !(activeRole === "pa-coordinator" && currentView === "new-case");

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden font-['Ubuntu_Sans',sans-serif]">
      <Sidebar activeRole={activeRole} onRoleChange={handleRoleChange} currentView={currentView} onNavigate={handleNavigate} />
      {activeRole === "pa-manager" ? (
        <ManagerMainContent isPanelOpen={isPanelOpen} onTogglePanel={() => setIsPanelOpen(prev => !prev)} onAskAgent={handleAskAgent} />
      ) : currentView === "new-case" ? (
        <NewCasePage onBack={() => setCurrentView("dashboard")} />
      ) : (
        <CoordinatorMainContent isPanelOpen={isPanelOpen} onTogglePanel={() => setIsPanelOpen(prev => !prev)} onAskAgent={handleAskAgent} />
      )}
      <AnimatePresence>
        {isPanelOpen && showRightPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 476, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 h-full overflow-hidden"
          >
            <RightPanel ref={rightPanelRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}