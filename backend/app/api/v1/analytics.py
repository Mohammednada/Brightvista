from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.schemas.analytics import (
    AllocationItem,
    AuthVolumeItem,
    CoordinatorAnalytics,
    DashboardAnalytics,
    KpiData,
)
from app.schemas.common import APIResponse

router = APIRouter()

# Pre-built analytics data matching the frontend mock data exactly

MANAGER_KPIS = [
    KpiData(value="1,053", label="Total Submissions", change="1.2%", change_label="vs last month", change_type="down"),
    KpiData(value="46", label="Open Inquiries", change="2.5%", change_label="vs last week", change_type="up"),
    KpiData(value="16", label="Cases Needs PA", change="3", change_label="new today", change_type="up", value_color="#00aeef", bar_chart=True),
    KpiData(value="87%", label="Approval Rate", change="4.6%", change_label="vs last month", change_type="up", value_color="#096"),
    KpiData(value="15", label="PA Denials", change="4.6%", change_label="vs last month", change_type="up", value_color="#ef4444"),
    KpiData(value="1,247", label="EHR Scanned Cases", change="86", change_label="Today", change_type="up"),
]

COORDINATOR_KPIS = [
    KpiData(value="24", label="My Active Cases", change="3.1%", change_label="vs last week", change_type="up"),
    KpiData(value="8", label="Pending Reviews", change="2.0%", change_label="vs last week", change_type="down"),
    KpiData(value="12", label="Completed Today", bar_chart=True),
    KpiData(value="2.4", label="Avg Turnaround (days)"),
    KpiData(value="3", label="Appeals In Progress"),
    KpiData(value="7", label="Documents Pending"),
]

ALLOCATION = [
    AllocationItem(name="Orthopedics", value=142, color="#a1c7f8"),
    AllocationItem(name="Cardiology", value=46, color="#d0e3fb"),
    AllocationItem(name="Neurology", value=38, color="#b8d4f0"),
    AllocationItem(name="Oncology", value=28, color="#e8f0fa"),
    AllocationItem(name="Radiology", value=22, color="#c5ddf5"),
]

AUTH_VOLUME = [
    AuthVolumeItem(period="Jan-Feb", on_time=17, delayed=11, at_risk=0),
    AuthVolumeItem(period="Mar-Apr", on_time=12, delayed=3, at_risk=5),
    AuthVolumeItem(period="May-Jun", on_time=18, delayed=7, at_risk=2),
    AuthVolumeItem(period="Jul-Aug", on_time=22, delayed=5, at_risk=1),
    AuthVolumeItem(period="Sep-Oct", on_time=15, delayed=8, at_risk=3),
    AuthVolumeItem(period="Nov-Dec", on_time=20, delayed=4, at_risk=2),
]

NOTIFICATIONS = [
    {
        "severity": "urgent",
        "severityLabel": "URGENT",
        "context": "Imaging Department",
        "title": "7 Imaging RFIs Older Than 48 Hours",
        "description": "Seven Request for Information items in the Imaging department have exceeded the 48-hour SLA threshold.",
        "recommendation": "Prioritize agent-led follow-up on these RFIs to prevent automatic denials.",
        "meta": "SLA Breach in 4 hours",
    },
    {
        "severity": "high",
        "severityLabel": "HIGH",
        "context": "Orthopedics",
        "title": "3 Cases Approaching Authorization Deadline",
        "description": "Three orthopedic cases are within 24 hours of their authorization deadline.",
        "recommendation": "Review and escalate these cases immediately.",
        "meta": "Deadline: Tomorrow",
    },
    {
        "severity": "medium",
        "severityLabel": "MEDIUM",
        "context": "System",
        "title": "Payer Portal Update: UnitedHealthcare",
        "description": "UnitedHealthcare has updated their PA submission portal. Forms may have changed.",
        "recommendation": "Re-crawl UHC portal to update submission templates.",
        "meta": "Detected 2 hours ago",
    },
    {
        "severity": "medium",
        "severityLabel": "MEDIUM",
        "context": "Analytics",
        "title": "Denial Rate Trending Up for Cigna HMO",
        "description": "Cigna HMO denial rate increased from 12% to 18% over the past 2 weeks.",
        "recommendation": "Review recent Cigna HMO denials for pattern changes.",
        "meta": "14-day trend",
    },
]

COORDINATOR_NOTIFICATIONS = [
    {
        "severity": "urgent",
        "severityLabel": "URGENT",
        "context": "SLA at risk",
        "title": "Margaret Thompson \u2014 Documents Expiring",
        "description": "Conservative therapy records for PA-2024-1847 expire in 48 hours.",
        "recommendation": "Request updated records from referring physician.",
        "meta": "Expires Feb 18, 2026",
    },
    {
        "severity": "high",
        "severityLabel": "HIGH",
        "context": "Scheduling",
        "title": "Peer-to-Peer Review Scheduled",
        "description": "Dr. Patel's peer-to-peer for Robert Chen (PA-2024-1792) is scheduled for tomorrow at 2 PM.",
        "recommendation": "Prepare clinical summary and supporting documentation.",
        "meta": "Tomorrow 2:00 PM",
    },
]

CASE_QUEUE = [
    {
        "id": "PA-2024-1847",
        "patient": "Margaret Thompson",
        "type": "MRI - Lumbar Spine",
        "priority": "urgent",
        "status": "awaiting-docs",
        "payer": "BlueCross BlueShield",
        "deadline": "Feb 16, 2026",
        "department": "Orthopedics",
    },
    {
        "id": "PA-2024-1852",
        "patient": "Robert Chen",
        "type": "Total Knee Replacement",
        "priority": "high",
        "status": "in-review",
        "payer": "UnitedHealthcare",
        "deadline": "Feb 20, 2026",
        "department": "Orthopedics",
    },
    {
        "id": "PA-2024-1831",
        "patient": "Sarah Williams",
        "type": "CT Angiography",
        "priority": "medium",
        "status": "pending",
        "payer": "Aetna",
        "deadline": "Feb 22, 2026",
        "department": "Cardiology",
    },
    {
        "id": "PA-2024-1819",
        "patient": "James O'Brien",
        "type": "Brain MRI",
        "priority": "medium",
        "status": "in-review",
        "payer": "Cigna",
        "deadline": "Feb 25, 2026",
        "department": "Neurology",
    },
    {
        "id": "PA-2024-1805",
        "patient": "Lisa Martinez",
        "type": "Spinal Fusion",
        "priority": "high",
        "status": "denied",
        "payer": "Humana",
        "deadline": "Feb 18, 2026",
        "department": "Orthopedics",
    },
    {
        "id": "PA-2024-1798",
        "patient": "David Kim",
        "type": "PET Scan",
        "priority": "low",
        "status": "approved",
        "payer": "BlueCross BlueShield",
        "deadline": "Mar 1, 2026",
        "department": "Oncology",
    },
]

MORNING_BRIEFING = {
    "heading": "Everything is Stable, But Imaging Risk is Emerging.",
    "description": "Overall authorization flow is healthy. Approval rates are up 4.6% this month. However, the Imaging department has 7 RFIs exceeding the 48-hour threshold — these need immediate attention to prevent automatic denials. Orthopedics volume remains high with 3 cases approaching deadline.",
}


@router.get("/analytics/dashboard", response_model=APIResponse)
async def get_dashboard_analytics(user=Depends(get_current_user)):
    return APIResponse(data=DashboardAnalytics(
        kpis=MANAGER_KPIS,
        notifications=NOTIFICATIONS,
        allocation=ALLOCATION,
        auth_volume=AUTH_VOLUME,
        morning_briefing=MORNING_BRIEFING,
    ))


@router.get("/analytics/coordinator", response_model=APIResponse)
async def get_coordinator_analytics(user=Depends(get_current_user)):
    return APIResponse(data=CoordinatorAnalytics(
        kpis=COORDINATOR_KPIS,
        notifications=COORDINATOR_NOTIFICATIONS,
        case_queue=CASE_QUEUE,
        activities=[],
    ))
