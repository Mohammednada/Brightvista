import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { Sidebar } from "./features/sidebar/sidebar";
import { DashboardHeader } from "./features/dashboard/header";
import { KpiCards } from "./features/dashboard/kpi-cards";
import { NeedsAttention } from "./features/dashboard/needs-attention";
import { AllocationChart } from "./features/dashboard/allocation-chart";
import { AuthorizationVolume } from "./features/dashboard/authorization-volume";
import { AgentActivities } from "./features/dashboard/agent-activities";
import { ActiveCoordinators } from "./features/dashboard/active-coordinators";
import { RightPanel, type RightPanelHandle } from "./features/agent-panel/right-panel";
import { CoordinatorMainContent } from "./features/coordinator/coordinator-dashboard";
import { NewCasePage } from "./features/new-case/new-case-page";
import type { RoleId } from "./features/sidebar/role-switcher";

function ManagerMainContent({ isPanelOpen, onTogglePanel, onAskAgent }: { isPanelOpen: boolean; onTogglePanel: () => void; onAskAgent: (text: string) => void }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative border-r border-border-default">
      <DashboardHeader isPanelOpen={isPanelOpen} onTogglePanel={onTogglePanel} />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* KPI Cards */}
        <KpiCards onAskAgent={onAskAgent} />

        {/* Divider */}
        <div className="h-px w-full bg-border-default" />

        {/* Needs Attention */}
        <NeedsAttention onAskAgent={onAskAgent} />

        {/* Allocation Per Department */}
        <AllocationChart />

        {/* Authorization Volume + Agent Activities */}
        <div className="flex w-full border-b border-border-default" style={{ height: "526px" }}>
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
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      <ErrorBoundary>
        <Sidebar activeRole={activeRole} onRoleChange={handleRoleChange} currentView={currentView} onNavigate={handleNavigate} />
      </ErrorBoundary>
      <ErrorBoundary>
        {activeRole === "pa-manager" ? (
          <ManagerMainContent isPanelOpen={isPanelOpen} onTogglePanel={() => setIsPanelOpen(prev => !prev)} onAskAgent={handleAskAgent} />
        ) : currentView === "new-case" ? (
          <NewCasePage onBack={() => setCurrentView("dashboard")} />
        ) : (
          <CoordinatorMainContent isPanelOpen={isPanelOpen} onTogglePanel={() => setIsPanelOpen(prev => !prev)} onAskAgent={handleAskAgent} />
        )}
      </ErrorBoundary>
      <AnimatePresence>
        {isPanelOpen && showRightPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 476, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 h-full overflow-hidden"
          >
            <ErrorBoundary>
              <RightPanel ref={rightPanelRef} />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}