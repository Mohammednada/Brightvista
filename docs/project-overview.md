# NorthStar Health Center - Project Overview

## Vision

NorthStar Health Center is an AI-powered prior authorization (PA) management dashboard designed for healthcare operations teams. It provides a centralized command center where PA coordinators, operations managers, and clinical staff can monitor, manage, and optimize the prior authorization workflow across multiple medical departments and payers.

The platform combines real-time operational metrics, AI-driven insights, and proactive agent recommendations to reduce authorization delays, prevent denials, and ultimately improve patient care outcomes.

---

## Problem Statement

Prior authorization in healthcare is a complex, time-sensitive process involving coordination between providers, payers, and patients. Common pain points include:

- **SLA Breaches**: Authorization requests sitting unresolved past payer deadlines, risking delayed procedures.
- **Denial Spikes**: Sudden increases in denials for specific departments or procedure types due to missing documentation or changing payer requirements.
- **Fragmented Visibility**: Operations teams lack a unified view of submission volumes, approval rates, coordinator workloads, and risk areas.
- **Reactive Workflows**: Teams typically respond to problems after they occur rather than proactively identifying and mitigating risks.
- **Coordination Gaps**: Multiple coordinators across specialties work in silos, making it difficult to track performance and distribute workload effectively.

---

## Solution

NorthStar addresses these challenges through a three-layer approach:

### 1. Operational Intelligence Layer
A real-time dashboard providing at-a-glance KPIs and drill-down analytics:

| Metric | Description |
|--------|-------------|
| **Total Submissions** | Aggregate count of PA requests submitted (e.g., 1,053) with month-over-month trend |
| **Approval Rate** | Percentage of PAs approved (e.g., 87%), color-coded green with positive trend indicators |
| **Open Inquiries** | Active requests requiring follow-up (e.g., 46) |
| **PA Denials** | Current denial count (e.g., 15), highlighted in red for urgency |
| **Cases Needing PA** | Real-time count of active cases requiring prior authorization, with sparkline activity bars |
| **Agent Performance** | Total cases handled with daily throughput metrics |

### 2. AI-Powered Alerting & Insights
An intelligent notification system that surfaces issues before they become critical:

- **Severity Classification**: Alerts are categorized as Urgent, High, or Medium priority with visual color coding (red for urgent/high, orange for medium).
- **Contextual Framing**: Each alert includes context (e.g., "Risk of Delayed MRI"), a clear description of the issue, and an AI-generated recommendation for resolution.
- **Example Alerts**:
  - *Imaging RFIs Approaching SLA Breach* - 7 cases with less than 24 hours remaining
  - *Orthopedics MRI Denial Spike Detected* - 18% drop in approvals due to missing documentation
  - *Stalled Prior Authorizations* - 5 requests stuck in "In Review" for 7+ business days
  - *Partial Approval Risk Identified* - 2 joint replacement authorizations without confirmed implant coverage

### 3. Autonomous AI Agent
A conversational AI agent that goes beyond passive monitoring to take proactive actions:

- **Morning Briefings**: Automated daily summaries of system health, emerging risks, and priority items
- **Active Insights**: Real-time detection of issues like payer portal delays, documentation gaps, and compliance risks
- **Recommended Actions**: Actionable intervention suggestions with one-click approval (e.g., "Approve Escalation" for aging imaging RFIs)
- **Agent Activities Timeline**: Transparent log of autonomous actions taken by the AI, including:
  - Outbound payer follow-up calls initiated
  - RFI response packets submitted
  - Appeals prepared and filed
  - SLA risk escalations triggered
  - Proactive documentation rules applied
- **Chat Interface**: Natural language interaction for querying data, requesting reports, or directing the agent to take specific actions

---

## Dashboard Layout & Components

### Sidebar Navigation
A compact 52px icon-based sidebar with:
- Organization logo (NorthStar branding)
- Navigation icons: AI, Approvals, Security, Documents, Access, History, Reports
- Workspace selector with active indicator
- Footer actions: Logout, Settings

### Main Content Area

#### KPI Cards (3x2 Grid)
Six metric cards arranged in three columns, each showing:
- Large numeric value with contextual coloring
- Metric label
- Trend indicator (percentage change with up/down arrows, or sparkline bar charts)

#### Needs Attention Section
A grid of notification cards (2x2) on a light blue-gray background, each containing:
- Severity badge with icon
- Issue title and description
- AI agent recommendation with action button

#### Allocation Per Department
A half-donut (semi-circle) chart visualizing case distribution across six departments:
- Orthopedics (142 cases)
- Cardiology (46)
- Neurology (32)
- Imaging (46)
- Oncology (82)
- Dermatology (46)

Includes a center label showing the total (1,053) and a month selector dropdown.

#### Authorization Volume & Agent Activities (Side-by-Side)
- **Authorization Volume**: Stacked bar chart showing On Time (blue), Delayed (orange), and At Risk (red) submissions across bi-monthly periods (Jan-Feb through Nov-Dec). Y-axis scaled 0-50.
- **Agent Activities**: Timeline feed with iconographic entries showing recent AI agent actions with timestamps.

#### Active Coordinators Table
A paginated data table displaying:
- Coordinator ID and name (linked)
- Join date
- Medical specialty
- Case count with color-coded segmented bar (Pending, Approved, Denied, In Review) featuring interactive hover tooltips
- System access status (Active/Inactive badge)
- Activity tracking sparkline with utilization percentage

### Right Panel (AI Briefing)
A collapsible 476px panel with smooth slide animation (300ms ease-out), containing:
- Morning briefing summary
- Active insights cards
- Recommended action card with dark blue background and CTA buttons
- Persistent chat input bar with attachment options

---

## Department Coverage

The dashboard tracks prior authorizations across six medical departments:

1. **Orthopedics** - Joint replacements, MRIs, surgical procedures
2. **Cardiology** - Cardiac imaging, interventional procedures, referrals
3. **Neurology** - Neurological assessments, specialized imaging
4. **Imaging** - Diagnostic imaging (MRI, CT, X-ray) across specialties
5. **Oncology** - Cancer treatment authorizations, chemotherapy
6. **Dermatology** - Dermatological procedures and specialty treatments

---

## Design Language

### Typography
- **Primary Font**: Ubuntu Sans (variable weight, 100-800)
- **Secondary Font**: Ubuntu (for select UI elements)
- Used consistently across all components with explicit weight control

### Color Palette

| Category | Colors | Usage |
|----------|--------|-------|
| **Primary Blues** | #1F425F, #3385F0, #00AEEF | Navigation active states, links, info indicators, On Time status |
| **Success Greens** | #099F69, #8ED3BA | Approval rate, active status badges, approved cases |
| **Alert Reds** | #D02241, #EF4444, #FF6467, #E17286 | Urgent/high alerts, denial counts, at risk status, denied cases |
| **Warning Oranges** | #F3903F, #FBCB9D, #FAD4B0 | Medium alerts, delayed status, in review cases |
| **Neutrals** | #1B2124, #4D595E, #9CAEB8, #97A6B4, #E5E5E5, #F7FAFC | Text hierarchy, borders, backgrounds |

### Visual Style
- Clean, clinical aesthetic appropriate for healthcare
- Light backgrounds (#F7FAFC) for secondary content areas
- Unified #E5E5E5 dividers throughout
- Rounded corners (8-16px) for cards and containers
- Subtle shadows for elevated elements
- Custom thin scrollbars styled to match the palette

---

## Technical Architecture

### Frontend Stack
- **React** (18.x) - Component-based UI
- **Tailwind CSS v4** - Utility-first styling with custom theme tokens
- **Recharts** - Data visualization (PieChart, BarChart with ResponsiveContainer)
- **Motion** (formerly Framer Motion) - Animations (panel slide, transitions)
- **Lucide React** - Icon system
- **Vite** - Build tooling

### Component Architecture
The application is fully componentized with 10 dedicated components:

```
/src/app/
  App.tsx                          # Root layout with sidebar, main content, right panel
  components/
    sidebar.tsx                    # Navigation sidebar with icon nav and workspace selector
    dashboard-header.tsx           # Top header bar with actions and panel toggle
    kpi-cards.tsx                  # 6 KPI metric cards in 3x2 grid
    needs-attention.tsx            # Alert notification cards
    allocation-chart.tsx           # Half-donut department allocation chart
    authorization-volume.tsx       # Stacked bar chart for submission tracking
    agent-activities.tsx           # Timeline of AI agent actions
    active-coordinators.tsx        # Paginated coordinator table
    right-panel.tsx                # AI briefing panel with chat input
```

### Key Implementation Patterns
- **State Management**: React useState for local component state (dropdowns, pagination, panel toggle)
- **Animation**: AnimatePresence + motion.div for right panel slide (width: 0 to 476px, 300ms ease-out)
- **Chart Sizing**: PieChart uses explicit width/height props; BarChart uses ResponsiveContainer with flex-1/min-h-0 parent
- **Responsive Layout**: Flexbox-based layout with overflow management and min-width constraints

---

## Target Users

| Role | Primary Use Case |
|------|-----------------|
| **PA Coordinators** | Monitor personal case load, respond to RFIs, track approval status |
| **Operations Managers** | Oversee department-wide metrics, identify bottlenecks, manage coordinator assignments |
| **Clinical Staff** | View authorization status for scheduled procedures, understand delay risks |
| **Compliance Officers** | Track SLA adherence, review denial patterns, ensure regulatory compliance |

---

## Future Considerations

- **Real-time Data Integration**: Connect to EHR/EMR systems and payer portals for live data feeds
- **User Authentication**: Role-based access control for different user types
- **Historical Analytics**: Extended time-range analysis and trend forecasting
- **Mobile Responsiveness**: Optimized views for tablet and mobile devices
- **Notification System**: Push notifications for critical alerts and SLA deadlines
- **Audit Trail**: Comprehensive logging of all agent actions and user decisions
- **Multi-facility Support**: Dashboard views across multiple clinic locations
- **Payer-specific Dashboards**: Detailed analytics broken down by insurance provider
