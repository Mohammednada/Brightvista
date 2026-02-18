import type React from "react";

// ── Role ──────────────────────────────────────────────────────────────────────

export type RoleId = "pa-manager" | "pa-coordinator";

// ── Chat ──────────────────────────────────────────────────────────────────────

export interface ActionOption {
  label: string;
  icon: React.ReactNode;
  prompt: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ChatMsg {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
  nextAction?: { label: string; prompt: string };
  actionOptions?: ActionOption[];
  specialContent?: "ehr-consent" | "ehr-agent" | "upload-zone" | "capture-zone";
}

// ── Agent entries ─────────────────────────────────────────────────────────────

export interface AgentEntry {
  match: (q: string) => boolean;
  thinking: string[];
  response: string;
  nextAction: { label: string; prompt: string };
  actionOptions?: ActionOption[];
  specialContent?: "ehr-consent" | "ehr-agent" | "upload-zone" | "capture-zone";
  stateUpdates?: import("@/app/features/new-case/state/case-builder-state").CaseBuilderAction[];
}

// ── KPI ───────────────────────────────────────────────────────────────────────

export interface KpiItemProps {
  value: string;
  label: string;
  change: string;
  changeLabel: string;
  changeType: "up" | "down";
  valueColor?: string;
  barChart?: boolean;
  onAskAgent?: () => void;
}

// ── Notification ──────────────────────────────────────────────────────────────

export interface NotificationCardProps {
  severity: "urgent" | "high" | "medium";
  severityLabel: string;
  context?: string;
  title: string;
  description: string;
  recommendation: string;
  meta: string;
  onAskAgent?: (text: string) => void;
}

// ── Mock data types ──────────────────────────────────────────────────────────

export interface KpiData {
  value: string;
  label: string;
  change: string;
  changeLabel: string;
  changeType: "up" | "down";
  valueColor?: string;
  barChart?: boolean;
  askAgentQuery?: string;
}

export interface Coordinator {
  id: string;
  name: string;
  joinDate: string;
  specialty: string;
  cases: number;
  casesColor: string;
  caseBar: { color: string; width: number }[];
  systemAccess: "Active" | "Inactive";
  activityBars: number[];
  activityPercent: string;
}

export interface TaskItem {
  id: string;
  patient: string;
  type: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: string;
  payer: string;
  deadline: string;
  department: string;
}

// ── Mock data types ──────────────────────────────────────────────────────────

export interface KpiData {
  value: string;
  label: string;
  change: string;
  changeLabel: string;
  changeType: "up" | "down";
  valueColor?: string;
  barChart?: boolean;
  askAgentQuery?: string;
}

export interface Coordinator {
  id: string;
  name: string;
  joinDate: string;
  specialty: string;
  cases: number;
  casesColor: string;
  caseBar: { color: string; width: number }[];
  systemAccess: "Active" | "Inactive";
  activityBars: number[];
  activityPercent: string;
}

export interface TaskItem {
  id: string;
  patient: string;
  type: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: string;
  payer: string;
  deadline: string;
  department: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getNow() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
