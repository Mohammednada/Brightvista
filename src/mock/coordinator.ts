import type { KpiData, NotificationCardProps, TaskItem } from "@/shared/types";

// ── Coordinator KPI Cards ────────────────────────────────────────────────────

export const coordinatorKpis: KpiData[] = [
  {
    value: "24",
    label: "My Active Cases",
    change: "3.1%",
    changeLabel: "Since last Week",
    changeType: "up",
    valueColor: "#00aeef",
    askAgentQuery:
      "Show me a breakdown of my 24 active cases — which ones are highest priority and what's the status of each?",
  },
  {
    value: "8",
    label: "Pending Reviews",
    change: "2.0%",
    changeLabel: "Since last Week",
    changeType: "down",
    valueColor: "#f2883f",
    askAgentQuery:
      "What's the status of my 8 pending reviews? Which ones are closest to their deadline?",
  },
  {
    value: "12",
    label: "Completed Today",
    change: "",
    changeLabel: "Processed today",
    changeType: "up",
    valueColor: "#096",
    barChart: true,
    askAgentQuery:
      "Give me details on the 12 cases I completed today — any that need follow-up or documentation?",
  },
  {
    value: "2.4",
    label: "Avg Turnaround (days)",
    change: "8.2%",
    changeLabel: "Since last Month",
    changeType: "up",
    valueColor: "#096",
    askAgentQuery:
      "How does my 2.4 day average turnaround compare to the team? What can I do to improve it?",
  },
  {
    value: "3",
    label: "Appeals In Progress",
    change: "1",
    changeLabel: "Filed this week",
    changeType: "up",
    valueColor: "#ef4444",
    askAgentQuery:
      "Tell me about the 3 appeals I have in progress — what are the expected outcomes and timelines?",
  },
  {
    value: "7",
    label: "Documents Pending",
    change: "5",
    changeLabel: "Urgent",
    changeType: "down",
    valueColor: "#f2883f",
    askAgentQuery:
      "Which of my 7 pending documents are most urgent? What's needed for each?",
  },
];

// ── Coordinator Notifications ────────────────────────────────────────────────

export const coordinatorNotifications: NotificationCardProps[] = [
  {
    severity: "urgent",
    severityLabel: "URGENT",
    context: "SLA at risk",
    title: "MRI Authorization Expiring in 4 Hours",
    description:
      "Patient Margaret Thompson's MRI lumbar spine authorization requires additional conservative therapy documentation before the payer deadline.",
    recommendation:
      "Upload the missing PT notes from Dr. Patel and resubmit before 2:00 PM today.",
    meta: "Due Today",
  },
  {
    severity: "high",
    severityLabel: "HIGH",
    context: "Missing documentation",
    title: "Cardiac Cath Pre-Auth Stalled",
    description:
      "Lisa Rodriguez's cardiac catheterization request has been in pending status for 3 days due to missing cardiac stress test results.",
    recommendation:
      "Contact Cardiology dept to obtain stress test results and attach to case PA-2024-1839.",
    meta: "3 Days Pending",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Appeal window closing",
    title: "PT Sessions Denial Appeal Deadline",
    description:
      "James Wilson's physical therapy 12-session request was denied by Cigna. You have 5 days remaining to file an appeal with peer-to-peer review.",
    recommendation:
      "Prepare appeal with updated clinical notes and request peer-to-peer with Cigna medical director.",
    meta: "5 Days Left",
  },
  {
    severity: "medium",
    severityLabel: "MEDIUM",
    context: "Verification needed",
    title: "Insurance Eligibility Discrepancy",
    description:
      "David Kim's dermatology biopsy authorization shows a coverage discrepancy \u2014 the procedure code may not be covered under his current plan tier.",
    recommendation:
      "Verify benefits with Kaiser Permanente and confirm CPT code 11102 coverage before scheduling.",
    meta: "Action Required",
  },
];

// ── Case Queue ───────────────────────────────────────────────────────────────

export const caseQueueTasks: TaskItem[] = [
  {
    id: "PA-2024-1847",
    patient: "Margaret Thompson",
    type: "MRI - Lumbar Spine",
    priority: "urgent",
    status: "awaiting-docs",
    payer: "BlueCross BlueShield",
    deadline: "Feb 16, 2026",
    department: "Orthopedics",
  },
  {
    id: "PA-2024-1852",
    patient: "Robert Chen",
    type: "CT Scan - Chest",
    priority: "high",
    status: "in-review",
    payer: "Aetna",
    deadline: "Feb 17, 2026",
    department: "Oncology",
  },
  {
    id: "PA-2024-1839",
    patient: "Lisa Rodriguez",
    type: "Cardiac Catheterization",
    priority: "high",
    status: "pending",
    payer: "United Healthcare",
    deadline: "Feb 18, 2026",
    department: "Cardiology",
  },
  {
    id: "PA-2024-1861",
    patient: "James Wilson",
    type: "Physical Therapy - 12 Sessions",
    priority: "medium",
    status: "in-review",
    payer: "Cigna",
    deadline: "Feb 19, 2026",
    department: "Orthopedics",
  },
  {
    id: "PA-2024-1855",
    patient: "Patricia Davis",
    type: "Nerve Block Injection",
    priority: "medium",
    status: "pending",
    payer: "Humana",
    deadline: "Feb 20, 2026",
    department: "Neurology",
  },
  {
    id: "PA-2024-1868",
    patient: "David Kim",
    type: "Dermatology Biopsy",
    priority: "low",
    status: "approved",
    payer: "Kaiser Permanente",
    deadline: "Feb 22, 2026",
    department: "Dermatology",
  },
];

// ── Coordinator Recent Activity ──────────────────────────────────────────────

export const coordActivities = [
  {
    iconName: "Upload",
    title: "Documentation Uploaded",
    description: "Uploaded PT notes for Margaret Thompson's MRI auth...",
    time: "Today \u00b7 10:45 AM",
  },
  {
    iconName: "Phone",
    title: "Payer Call Completed",
    description: "Called Aetna regarding Robert Chen's CT scan review...",
    time: "Today \u00b7 9:30 AM",
  },
  {
    iconName: "Send",
    title: "RFI Response Submitted",
    description: "Submitted clinical notes for PA-2024-1839 to United...",
    time: "Today \u00b7 8:15 AM",
  },
  {
    iconName: "CheckCircle",
    title: "Case Approved",
    description: "David Kim's dermatology biopsy approved by Kaiser...",
    time: "Yesterday \u00b7 4:50 PM",
  },
  {
    iconName: "FileText",
    title: "Appeal Letter Drafted",
    description: "Prepared appeal for James Wilson's PT session denial...",
    time: "Yesterday \u00b7 3:20 PM",
  },
];

// ── Case Status Distribution ─────────────────────────────────────────────────

export const caseStatusData = [
  { name: "In Review", value: 8, color: "#a1c7f8" },
  { name: "Pending", value: 6, color: "#fad4b0" },
  { name: "Awaiting Docs", value: 4, color: "#f3ccd4" },
  { name: "Approved", value: 4, color: "#8ed3ba" },
  { name: "Denied", value: 2, color: "#e17286" },
];

// ── Agent Performance ────────────────────────────────────────────────────────

export const agentActions = [
  {
    iconName: "Send",
    channel: "Through Payer Portal",
    label: "Portal submissions",
    count: 18,
    color: "#3385f0",
    bgColor: "#eaf3fd",
  },
  {
    iconName: "Phone",
    channel: "Through Voice Calls",
    label: "IVR & live calls to payers",
    count: 7,
    color: "#096",
    bgColor: "#ecfdf5",
  },
  {
    iconName: "ArrowRight",
    channel: "Through API's",
    label: "Direct API submissions",
    count: 12,
    color: "#00aeef",
    bgColor: "#e8f8fd",
  },
  {
    iconName: "FileText",
    channel: "Provider Messages",
    label: "Doc update requests sent",
    count: 9,
    color: "#f2883f",
    bgColor: "#fff7ed",
  },
  {
    iconName: "Upload",
    channel: "Auto-Attach",
    label: "Clinical docs auto-attached",
    count: 14,
    color: "#8b5cf6",
    bgColor: "#f5f3ff",
  },
  {
    iconName: "ScanSearch",
    channel: "Auth Scanning",
    label: "Scanned for authorization",
    count: 22,
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
  {
    iconName: "MessageSquare",
    channel: "Follow-Ups",
    label: "Automated follow-up messages",
    count: 11,
    color: "#d946ef",
    bgColor: "#fdf4ff",
  },
  {
    iconName: "RefreshCw",
    channel: "Status Checks",
    label: "Payer status verifications",
    count: 16,
    color: "#059669",
    bgColor: "#ecfdf5",
  },
];
