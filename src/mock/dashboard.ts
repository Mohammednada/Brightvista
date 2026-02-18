import type { KpiData, NotificationCardProps, Coordinator } from "@/shared/types";

// ── Manager KPI Cards ────────────────────────────────────────────────────────

export const managerKpis: KpiData[] = [
  {
    value: "1,053",
    label: "Total Submissions",
    change: "1.2%",
    changeLabel: "Since last Month",
    changeType: "down",
    askAgentQuery:
      "Give me a breakdown of our 1,053 total submissions this month — how do they compare to last month and which departments are driving the change?",
  },
  {
    value: "46",
    label: "Open Inquiries",
    change: "2.5%",
    changeLabel: "Since last Month",
    changeType: "up",
    askAgentQuery:
      "What's the status of our 46 open inquiries? Are any at risk of SLA breach or need immediate attention?",
  },
  {
    value: "16",
    label: "Cases Needs PA",
    change: "",
    changeLabel: "Now Active Cases",
    changeType: "up",
    valueColor: "#00aeef",
    barChart: true,
    askAgentQuery:
      "Tell me about the 16 active cases that currently need prior authorization — which are most urgent and what's blocking them?",
  },
  {
    value: "87%",
    label: "Approval Rate",
    change: "4.6%",
    changeLabel: "Since last Month",
    changeType: "up",
    valueColor: "#096",
    askAgentQuery:
      "Break down our 87% approval rate — which departments are driving it up or down, and what can we do to improve it further?",
  },
  {
    value: "15",
    label: "PA Denials",
    change: "4.6%",
    changeLabel: "Since last Month",
    changeType: "up",
    valueColor: "#ef4444",
    askAgentQuery:
      "Give me a detailed breakdown of the 15 PA denials this month — what's causing them and which departments are most affected?",
  },
  {
    value: "1,247",
    label: "EHR Scanned Cases",
    change: "86",
    changeLabel: "Today",
    changeType: "up",
    valueColor: "#f2883f",
    askAgentQuery:
      "Summarize the overall PA volume — we have 1,247 total EHR scanned cases with 86 today. What's the trend and are there any bottlenecks?",
  },
];

// ── Manager Notifications ────────────────────────────────────────────────────

export const managerNotifications: NotificationCardProps[] = [
  {
    severity: "urgent",
    severityLabel: "URGENT",
    context: "Risk of Delayed MRI",
    title: "Imaging RFIs Approaching SLA Breach",
    description:
      "7 Imaging prior authorization cases have open RFIs with less than 24 hours remaining before payer deadlines.",
    recommendation:
      "Escalate all Imaging RFIs older than 48 hours and prioritize agent-led follow-up.",
    meta: "Payer SLA",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Increased appeals workload",
    title: "Orthopedics MRI Denial Spike Detected",
    description:
      "Orthopedics MRI approvals dropped by 18% this week, primarily due to missing conservative therapy documentation.",
    recommendation:
      "Enable stricter pre-submit documentation checks for Orthopedics MRI cases.",
    meta: "Payer SLA",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Potential patient care delays",
    title: "Stalled Prior Authorizations",
    description:
      '5 prior authorization requests across multiple payers have remained in "In Review" status for more than 7 business days.',
    recommendation:
      "Authorize escalation calls to payer representatives for all stalled cases.",
    meta: "Payer SLA",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Potential uncovered device costs",
    title: "Partial Approval Risk Identified",
    description:
      "2 upcoming joint replacement authorizations were approved without explicit confirmation of implant coverage.",
    recommendation:
      "Initiate clarification requests with payers before procedures are scheduled.",
    meta: "Payer SLA",
  },
];

// ── Allocation Chart ─────────────────────────────────────────────────────────

export const allocationData = [
  { name: "Orthopedics", value: 142, color: "#a1c7f8" },
  { name: "Cardiology", value: 46, color: "#d0e3fb" },
  { name: "Neurology", value: 32, color: "#90d6ec" },
  { name: "Imaging", value: 46, color: "#fad4b0" },
  { name: "Oncology", value: 82, color: "#8ed3ba" },
  { name: "Dermatology", value: 46, color: "#f3ccd4" },
];

export const allocationMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ── Authorization Volume ─────────────────────────────────────────────────────

export const authVolumeData = [
  { period: "Jan-Feb", onTime: 17, delayed: 11, atRisk: 0 },
  { period: "Mar-Apr", onTime: 12, delayed: 3, atRisk: 5 },
  { period: "May-Jun", onTime: 8, delayed: 3, atRisk: 3 },
  { period: "Jul-Aug", onTime: 15, delayed: 0, atRisk: 3 },
  { period: "Sep-Oct", onTime: 12, delayed: 3, atRisk: 0 },
  { period: "Nov-Dec", onTime: 6, delayed: 3, atRisk: 3 },
];

export const authVolumeLegend = [
  { color: "#00aeef", label: "On Time" },
  { color: "#f3903f", label: "Delayed" },
  { color: "#ff6467", label: "At Risk" },
];

// ── Agent Activities ─────────────────────────────────────────────────────────

export const recentActivities = [
  {
    iconName: "Phone",
    title: "Outbound Payer Follow-Up Initiated",
    description: "The agent initiated an outbound call to the payer to...",
    time: "Today · 9:12 AM",
  },
  {
    iconName: "Store",
    title: "RFI Response Packet Submitted",
    description: "The agent compiled and submitted additional clini...",
    time: "Today · 10:04 AM",
  },
  {
    iconName: "HelpCircle",
    title: "Appeal Prepared and Filed",
    description: "The agent prepared an appeal packet for a deni...",
    time: "Yesterday · 4:38 PM",
  },
  {
    iconName: "Tag",
    title: "Escalation Triggered for SLA Risk",
    description: "The agent escalated 3 Imaging prior authorizati...",
    time: "Yesterday · 2:15 PM",
  },
  {
    iconName: "Tag",
    title: "Proactive Documentation Rule Applied",
    description: "Based on recent denial patterns, the agent en...",
    time: "Yesterday · 11:42 AM",
  },
];

export const timeRangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

// ── Active Coordinators ──────────────────────────────────────────────────────

export const coordinators: Coordinator[] = [
  {
    id: "160102",
    name: "Rubeus Hagrid",
    joinDate: "Joined at 2 Jan",
    specialty: "Orthopedic",
    cases: 12,
    casesColor: "#f68d2a",
    caseBar: [
      { color: "#a1c7f8", width: 26 },
      { color: "#8ed3ba", width: 32 },
      { color: "#e17286", width: 8 },
      { color: "#fbcb9d", width: 13 },
      { color: "#fbcb9d", width: 18 },
    ],
    systemAccess: "Active",
    activityBars: [1, 13, 10, 13, 10, 24, 20, 12, 19, 22, 14, 19],
    activityPercent: "88%",
  },
  {
    id: "140119",
    name: "Sirius Black",
    joinDate: "Joined at 2 Jan",
    specialty: "Cardiology",
    cases: 15,
    casesColor: "#099f69",
    caseBar: [
      { color: "#e17286", width: 8 },
      { color: "#a1c7f8", width: 20 },
      { color: "#e17286", width: 8 },
      { color: "#fbcb9d", width: 18 },
      { color: "#e17286", width: 5 },
    ],
    systemAccess: "Active",
    activityBars: [16, 12, 10, 9, 10, 3, 10, 17, 13, 19, 11, 11, 6],
    activityPercent: "90%",
  },
  {
    id: "744101",
    name: "Neville Longbottom",
    joinDate: "Joined at 2 Jan",
    specialty: "Neurology",
    cases: 18,
    casesColor: "#099f69",
    caseBar: [
      { color: "#a1c7f8", width: 30 },
      { color: "#8ed3ba", width: 20 },
      { color: "#e17286", width: 10 },
      { color: "#fbcb9d", width: 15 },
      { color: "#fbcb9d", width: 22 },
    ],
    systemAccess: "Active",
    activityBars: [1, 13, 10, 13, 10, 24, 20, 12, 19, 22, 14, 19],
    activityPercent: "97%",
  },
  {
    id: "790001",
    name: "Fred Weasley",
    joinDate: "Joined at 2 Jan",
    specialty: "Oncology",
    cases: 18,
    casesColor: "#099f69",
    caseBar: [
      { color: "#a1c7f8", width: 26 },
      { color: "#8ed3ba", width: 32 },
      { color: "#e17286", width: 8 },
      { color: "#fbcb9d", width: 13 },
      { color: "#fbcb9d", width: 18 },
    ],
    systemAccess: "Active",
    activityBars: [1, 13, 10, 13, 10, 24, 20, 12, 19, 22, 14, 19],
    activityPercent: "90%",
  },
  {
    id: "781001",
    name: "Arthur Weasley",
    joinDate: "Joined at 2 Jan",
    specialty: "Dermatology",
    cases: 2,
    casesColor: "#d02241",
    caseBar: [
      { color: "#e17286", width: 9 },
      { color: "#a1c7f8", width: 24 },
      { color: "#e17286", width: 7 },
      { color: "#fbcb9d", width: 13 },
      { color: "#fbcb9d", width: 18 },
    ],
    systemAccess: "Active",
    activityBars: [24, 7, 8, 4, 1, 23, 7, 17, 1, 6, 19, 20],
    activityPercent: "50%",
  },
];

export const coordinatorColorLabels: Record<string, string> = {
  "#a1c7f8": "Pending",
  "#8ed3ba": "Approved",
  "#e17286": "Denied",
  "#fbcb9d": "In Review",
};
