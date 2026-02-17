import type React from "react";

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

export interface AgentEntry {
  match: (q: string) => boolean;
  thinking: string[];
  response: string;
  nextAction: { label: string; prompt: string };
  actionOptions?: ActionOption[];
  specialContent?: "ehr-consent" | "ehr-agent" | "upload-zone" | "capture-zone";
}

export function getNow() {
  const d = new Date();
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
