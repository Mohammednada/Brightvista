import type { AgentSystemType } from "../types";

export const SYSTEM_THEMES: Record<AgentSystemType, {
  navBg: string; sidebarBg: string; accent: string; logo: string;
  logoGradient: [string, string]; name: string; contentBg: string;
}> = {
  "epic-ehr": {
    navBg: "#0f2440", sidebarBg: "#152d4a", accent: "#4da8da",
    logo: "E", logoGradient: ["#4da8da", "#2563eb"],
    name: "Hyperspace", contentBg: "#f3f5f8",
  },
  "pa-engine": {
    navBg: "#0f3020", sidebarBg: "#153d28", accent: "#22c55e",
    logo: "PA", logoGradient: ["#22c55e", "#16a34a"],
    name: "BrightVista Crystal", contentBg: "#f3f8f5",
  },
  "bcbs-availity": {
    navBg: "#002855", sidebarBg: "#0a3666", accent: "#3b82f6",
    logo: "BCBS", logoGradient: ["#3b82f6", "#1d4ed8"],
    name: "Availity", contentBg: "#f5f7fa",
  },
  "northstar-pa": {
    navBg: "#1F425F", sidebarBg: "#294f6e", accent: "#4da8da",
    logo: "NS", logoGradient: ["#4da8da", "#1F425F"],
    name: "PA Workspace", contentBg: "#f7fafc",
  },
  "api-terminal": {
    navBg: "#0d1117", sidebarBg: "#161b22", accent: "#58a6ff",
    logo: ">_", logoGradient: ["#58a6ff", "#388bfd"],
    name: "API Terminal", contentBg: "#0d1117",
  },
  "uhc-voice": {
    navBg: "#002677", sidebarBg: "#003399", accent: "#FF612B",
    logo: "UHC", logoGradient: ["#FF612B", "#e0551f"],
    name: "UHC Voice IVR", contentBg: "#f5f6fa",
  },
  "uhc-fax": {
    navBg: "#1e293b", sidebarBg: "#334155", accent: "#FF612B",
    logo: "FAX", logoGradient: ["#FF612B", "#e0551f"],
    name: "UHC Secure Fax", contentBg: "#f8f9fa",
  },
  "aetna-portal": {
    navBg: "#56166A", sidebarBg: "#6b1d82", accent: "#7C3AED",
    logo: "AET", logoGradient: ["#7C3AED", "#56166A"],
    name: "Aetna Portal", contentBg: "#f8f5fa",
  },
};
