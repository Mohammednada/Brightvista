/**
 * Brightvista API Client
 *
 * Communicates with the FastAPI backend.
 * All methods return typed responses and handle errors gracefully.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface APIResponse<T = unknown> {
  data: T;
  meta?: Record<string, unknown> | null;
  errors?: Array<{ error: string; message: string }> | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail?.message || `API error: ${res.status}`);
  }

  const json: APIResponse<T> = await res.json();
  return json.data;
}

// ── Cases ─────────────────────────────────────────────────────────────────────

export interface CaseSummary {
  id: string;
  case_number: string;
  status: string;
  priority: string;
  patient_name: string | null;
  procedure_type: string | null;
  payer_name: string | null;
  department: string | null;
  deadline: string | null;
  approval_likelihood: number;
  created_at: string;
  updated_at: string;
}

export interface CaseDetail {
  id: string;
  case_number: string;
  status: string;
  current_step: string;
  priority: string;
  approval_likelihood: number;
  approval_factors: Array<{ label: string; weight: number; met: boolean }>;
  steps: Array<{ id: string; label: string; sublabel?: string; status: string }>;
  patient: PatientData | null;
  procedure: ProcedureData | null;
  documents: DocumentRequirement[];
  payer_name: string | null;
  department: string | null;
  deadline: string | null;
  auth_number: string | null;
  denial_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface PatientData {
  id: string;
  name: string | null;
  dob: string | null;
  mrn: string | null;
  phone: string | null;
  address: string | null;
  insurance_payer: string | null;
  member_id: string | null;
  plan_type: string | null;
  referring_physician: string | null;
  field_confidence: Record<string, unknown> | null;
}

export interface ProcedureData {
  id: string;
  case_id: string;
  cpt_code: string | null;
  cpt_description: string | null;
  icd10_code: string | null;
  icd10_description: string | null;
  ordering_physician: string | null;
  cpt_valid: boolean | null;
  icd10_valid: boolean | null;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  status: string;
  source?: string | null;
  date?: string | null;
  required: boolean;
}

export const cases = {
  list: (status?: string) =>
    request<CaseSummary[]>(`/api/v1/cases${status ? `?status=${status}` : ""}`),

  get: (id: string) => request<CaseDetail>(`/api/v1/cases/${id}`),

  create: (data: { priority?: string; department?: string; deadline?: string }) =>
    request<{ case_id: string; case_number: string; status: string }>("/api/v1/cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    request<CaseDetail>(`/api/v1/cases/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  setPatient: (id: string, data: Record<string, unknown>) =>
    request<CaseDetail>(`/api/v1/cases/${id}/patient`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  setProcedure: (id: string, data: Record<string, unknown>) =>
    request<CaseDetail>(`/api/v1/cases/${id}/procedure`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  setDocuments: (id: string, documents: DocumentRequirement[]) =>
    request<CaseDetail>(`/api/v1/cases/${id}/documents`, {
      method: "POST",
      body: JSON.stringify({ documents }),
    }),

  getApprovalLikelihood: (id: string) =>
    request<{ approval_likelihood: number; factors: Array<{ label: string; weight: number; met: boolean }> }>(
      `/api/v1/cases/${id}/approval-likelihood`
    ),

  submit: (id: string) =>
    request<{ case: CaseDetail; submission: { id: string; channel: string; status: string; tracking_number: string } }>(
      `/api/v1/cases/${id}/submit`,
      { method: "POST" }
    ),
};

// ── Payers ────────────────────────────────────────────────────────────────────

export interface Payer {
  id: string;
  name: string;
  short_name: string | null;
  portal_url: string | null;
  phone_number: string | null;
  supported_channels: string[] | null;
  preferred_channel: string | null;
  avg_turnaround_days: number | null;
  approval_rate: number | null;
}

export interface PayerRule {
  id: string;
  payer_id: string;
  cpt_code: string;
  cpt_description: string | null;
  pa_required: boolean;
  plan_types: string[] | null;
  required_documents: string[] | null;
  clinical_criteria: string[] | null;
  historical_approval_rate: number | null;
  avg_decision_days: number | null;
  common_denial_reasons: string[] | null;
}

export const payers = {
  list: () => request<Payer[]>("/api/v1/payers"),
  get: (id: string) => request<Payer>(`/api/v1/payers/${id}`),
  getRules: (id: string, cptCode?: string) =>
    request<PayerRule[]>(`/api/v1/payers/${id}/rules${cptCode ? `?cpt_code=${cptCode}` : ""}`),
  lookupRule: (payerName?: string, cptCode?: string) => {
    const params = new URLSearchParams();
    if (payerName) params.set("payer_name", payerName);
    if (cptCode) params.set("cpt_code", cptCode);
    return request<PayerRule[]>(`/api/v1/payer-rules/lookup?${params}`);
  },
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface KpiData {
  value: string;
  label: string;
  change: string | null;
  change_label: string | null;
  change_type: string | null;
  value_color: string | null;
  bar_chart: boolean | null;
}

export interface DashboardAnalytics {
  kpis: KpiData[];
  notifications: Array<Record<string, unknown>>;
  allocation: Array<{ name: string; value: number; color: string }>;
  auth_volume: Array<{ period: string; on_time: number; delayed: number; at_risk: number }>;
  morning_briefing: { heading: string; description: string };
}

export interface CoordinatorAnalytics {
  kpis: KpiData[];
  notifications: Array<Record<string, unknown>>;
  case_queue: Array<Record<string, unknown>>;
  activities: Array<Record<string, unknown>>;
}

export const analytics = {
  dashboard: () => request<DashboardAnalytics>("/api/v1/analytics/dashboard"),
  coordinator: () => request<CoordinatorAnalytics>("/api/v1/analytics/coordinator"),
};

// ── AI ────────────────────────────────────────────────────────────────────────

export const ai = {
  validateCpt: (code: string) =>
    request<{ valid: boolean; code: string; description: string | null; requires_pa: boolean }>(
      "/api/v1/ai/validate-cpt",
      { method: "POST", body: JSON.stringify({ code }) }
    ),

  validateIcd10: (code: string) =>
    request<{ valid: boolean; code: string; description: string | null }>(
      "/api/v1/ai/validate-icd10",
      { method: "POST", body: JSON.stringify({ code }) }
    ),

  generateNarrative: (data: {
    patient_name: string;
    cpt_code: string;
    cpt_description: string;
    icd10_code: string;
    icd10_description: string;
    payer_name: string;
  }) =>
    request<{ narrative: string }>("/api/v1/ai/generate-narrative", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  chat: (message: string, caseId?: string) =>
    request<{ response: string; thinking: string[]; next_action?: { label: string; prompt: string } }>(
      "/api/v1/ai/chat",
      { method: "POST", body: JSON.stringify({ message, case_id: caseId }) }
    ),
};

// ── Submissions ───────────────────────────────────────────────────────────────

export const submissions = {
  list: (caseId: string) =>
    request<Array<{ id: string; channel: string; status: string; tracking_number: string | null }>>(
      `/api/v1/cases/${caseId}/submissions`
    ),
};

// ── Monitoring ────────────────────────────────────────────────────────────────

export const monitoring = {
  overview: () => request<Record<string, unknown>>("/api/v1/monitoring/overview"),
  checkStatus: (caseId: string) =>
    request<{ status: string; outcome: string | null; message: string; progress?: number }>(
      `/api/v1/monitoring/cases/${caseId}/status`
    ),
};

// ── Appeals ───────────────────────────────────────────────────────────────────

export const appeals = {
  create: (caseId: string) =>
    request<{ id: string; appeal_level: number; status: string; strategy: string; letter: string }>(
      `/api/v1/cases/${caseId}/appeals`,
      { method: "POST" }
    ),
  list: (caseId: string) =>
    request<Array<Record<string, unknown>>>(`/api/v1/cases/${caseId}/appeals`),
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  demoLogin: () =>
    request<{ access_token: string; user: { id: string; name: string; role: string } }>(
      "/api/v1/auth/demo-login",
      { method: "POST" }
    ),
};

// ── Health ────────────────────────────────────────────────────────────────────

export const health = {
  check: () => request<{ status: string }>("/"),
};

// ── Default export ────────────────────────────────────────────────────────────

const api = { cases, payers, analytics, ai, submissions, monitoring, appeals, auth, health };
export default api;
