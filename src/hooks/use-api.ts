/**
 * React hooks for backend API integration.
 *
 * Each hook fetches from the backend and falls back to mock data
 * if the backend is unavailable — keeping the prototype functional
 * regardless of whether the server is running.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import api, { type DashboardAnalytics, type CoordinatorAnalytics, type CaseSummary } from "@/services/api";

// ── Generic fetch hook ────────────────────────────────────────────────────────

function useApiData<T>(fetcher: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (mounted.current) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          console.warn("API unavailable, using mock data:", err.message);
          setData(fallback);
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => { mounted.current = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback(() => {
    setLoading(true);
    fetcher()
      .then((result) => {
        if (mounted.current) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted.current) {
          setData(fallback);
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
  }, [fetcher, fallback]);

  return { data, loading, error, refetch };
}

// ── Dashboard Analytics ───────────────────────────────────────────────────────

import { managerKpis, managerNotifications, allocationData, authVolumeData } from "@/mock/dashboard";
import { morningBriefing } from "@/mock/shared";

const DASHBOARD_FALLBACK: DashboardAnalytics = {
  kpis: managerKpis.map((k) => ({
    value: k.value,
    label: k.label,
    change: k.change || null,
    change_label: k.changeLabel || null,
    change_type: k.changeType || null,
    value_color: k.valueColor || null,
    bar_chart: k.barChart || null,
  })),
  notifications: managerNotifications.map((n) => ({ ...n })),
  allocation: allocationData,
  auth_volume: authVolumeData.map((v) => ({
    period: v.period,
    on_time: v.onTime,
    delayed: v.delayed,
    at_risk: v.atRisk,
  })),
  morning_briefing: morningBriefing,
};

export function useDashboardAnalytics() {
  return useApiData(() => api.analytics.dashboard(), DASHBOARD_FALLBACK);
}

// ── Coordinator Analytics ─────────────────────────────────────────────────────

import { coordinatorKpis, coordinatorNotifications, caseQueueTasks } from "@/mock/coordinator";

const COORDINATOR_FALLBACK: CoordinatorAnalytics = {
  kpis: coordinatorKpis.map((k) => ({
    value: k.value,
    label: k.label,
    change: k.change || null,
    change_label: k.changeLabel || null,
    change_type: k.changeType || null,
    value_color: k.valueColor || null,
    bar_chart: k.barChart || null,
  })),
  notifications: coordinatorNotifications.map((n) => ({ ...n })),
  case_queue: caseQueueTasks.map((t) => ({ ...t })),
  activities: [],
};

export function useCoordinatorAnalytics() {
  return useApiData(() => api.analytics.coordinator(), COORDINATOR_FALLBACK);
}

// ── Case List ─────────────────────────────────────────────────────────────────

export function useCaseList(status?: string) {
  return useApiData<CaseSummary[]>(() => api.cases.list(status), []);
}

// ── Backend health check ──────────────────────────────────────────────────────

export function useBackendHealth() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    api.health
      .check()
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  return connected;
}
