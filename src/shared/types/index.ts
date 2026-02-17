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

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getNow() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
