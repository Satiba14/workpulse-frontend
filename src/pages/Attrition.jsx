import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { TrendingDown, RefreshCw } from "lucide-react";
import axios from "../api/axios";

import { TIME_OPTS, TABS, TabBtn } from "../components/AttritionShared";
import {
  MonthlyTrendChart,
  ByDepartmentChart,
  ByRoleChart,
  ByExperienceChart,
  TopReasonsChart,
} from "../components/AttritionCharts";

export default function Attrition() {
  // ── State — seed from sessionStorage cache if available ──────────────────
  const [data, setData] = useState(() => {
    try {
      const cached = sessionStorage.getItem("attrition_12");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [months, setMonths]   = useState(12);
  const [tab, setTab]         = useState("Monthly Trend");

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/attrition/analytics/", { params: { months } });

      // Cache in sessionStorage so revisiting the page is instant
      try {
        sessionStorage.setItem(`attrition_${months}`, JSON.stringify(res.data));
      } catch {
        // sessionStorage full or unavailable — ignore
      }

      setData(res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load attrition data.");
    } finally {
      setLoading(false);
    }
  }, [months]);

  // When months changes, check cache first before hitting the API
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(`attrition_${months}`);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return; // skip API call — use cache
      }
    } catch {
      // ignore
    }
    fetchData();
  }, [fetchData, months]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const monthly    = data?.monthly_trend    ?? [];
  const byDept     = data?.by_department    ?? [];
  const byRole     = data?.by_designation   ?? [];
  const byExp      = (data?.by_experience   ?? []).filter((d) => d.exits > 0);
  const topReasons = data?.top_exit_reasons ?? [];

  return (
    <Layout bgClass="bg-white dark:bg-slate-900 overflow-y-auto">
      <div className="space-y-6 max-w-7xl mx-auto px-4 py-2 pb-24">

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 dark:bg-slate-800 rounded-xl p-2.5">
              <TrendingDown size={20} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Attrition Analytics
              </h1>
              <p className="text-xs text-gray-400">workforce turnover insights and trends</p>
            </div>
          </div>
          <button
            onClick={() => {
              // Force refresh — bust cache for current months
              try { sessionStorage.removeItem(`attrition_${months}`); } catch {}
              fetchData();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Control Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
            {TABS.map((t) => (
              <TabBtn key={t} active={tab === t} onClick={() => setTab(t)}>
                {t}
              </TabBtn>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-100 dark:border-slate-800">
            {TIME_OPTS.map((o) => (
              <button
                key={o.value}
                onClick={() => setMonths(o.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  months === o.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2">
            {error}
            <button onClick={fetchData} className="ml-auto text-xs underline">
              Retry
            </button>
          </div>
        )}

        {/* ── Main Chart Panel ── */}
        <div className="w-full overflow-x-auto">
          {loading && !data ? (
            // Only show spinner on FIRST load — if cached data exists, show it
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              {tab === "Monthly Trend"  && <MonthlyTrendChart  data={monthly} />}
              {tab === "By Department"  && <ByDepartmentChart  data={byDept}  />}
              {tab === "By Role"        && <ByRoleChart        data={byRole}  />}
              {tab === "By Experience"  && <ByExperienceChart  data={byExp}   />}
            </>
          )}
        </div>

        {/* ── Top Exit Reasons ── */}
        <div className="pt-10 mt-8 border-t border-gray-100 dark:border-slate-800">
          <div className="pb-4">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              Top Exit Reasons (All Time)
            </h2>
          </div>
          <TopReasonsChart data={topReasons} />
        </div>
      </div>
    </Layout>
  );
}