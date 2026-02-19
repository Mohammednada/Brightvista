from pydantic import BaseModel


class KpiData(BaseModel):
    value: str
    label: str
    change: str | None = None
    change_label: str | None = None
    change_type: str | None = None  # up, down
    value_color: str | None = None
    bar_chart: bool | None = None


class AllocationItem(BaseModel):
    name: str
    value: int
    color: str


class AuthVolumeItem(BaseModel):
    period: str
    on_time: int
    delayed: int
    at_risk: int


class DashboardAnalytics(BaseModel):
    kpis: list[KpiData]
    notifications: list[dict]
    allocation: list[AllocationItem]
    auth_volume: list[AuthVolumeItem]
    morning_briefing: dict


class CoordinatorAnalytics(BaseModel):
    kpis: list[KpiData]
    notifications: list[dict]
    case_queue: list[dict]
    activities: list[dict]
