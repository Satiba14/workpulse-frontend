import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import { getDashboardStats } from "../api/dashboard";
import { getAttritionStats } from "../api/attrition";
import {
  Users, UserCheck, TrendingDown, Building2, Activity,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const CACHE_KEY_STATS    = "dashboard_stats";
const CACHE_KEY_ATTR     = "dashboard_attrition";
const CACHE_TTL          = 300_000; // 5 minutes

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
};

// ── Metric Card ──────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
  <div className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-500/50 cursor-pointer">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {value ?? 0}
        </p>
        {sub && <p className="text-sm font-medium mt-1 text-gray-500 dark:text-gray-400">{sub}</p>}
      </div>
      <div className={`${iconBg} rounded-xl p-3 transition-all duration-300 group-hover:scale-110`}>
        <Icon size={24} className={iconColor} />
      </div>
    </div>
  </div>
);

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [stats,     setStats]     = useState(() => readCache(CACHE_KEY_STATS));
  const [attrition, setAttrition] = useState(() => readCache(CACHE_KEY_ATTR));
  const [loading,   setLoading]   = useState(!readCache(CACHE_KEY_STATS));

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([getDashboardStats(), getAttritionStats()]);
      setStats(s.data);
      setAttrition(a.data);
      writeCache(CACHE_KEY_STATS, s.data);
      writeCache(CACHE_KEY_ATTR,  a.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (readCache(CACHE_KEY_STATS) && readCache(CACHE_KEY_ATTR)) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, [fetchAll]);

  const statusData = stats ? [
    { name: "Billable",     value: stats.billable     || 0, fill: "#22c55e" },
    { name: "Non-Billable", value: stats.non_billable || 0, fill: "#84cc16" },
    { name: "Buffer",       value: stats.buffer       || 0, fill: "#eab308" },
    { name: "Inactive",     value: stats.inactive     || 0, fill: "#ef4444" },
  ] : [];

  const deptAttritionData = attrition?.by_department?.map((d) => ({
    name:  d.department.length > 14 ? d.department.substring(0, 14) + "…" : d.department,
    rate:  d.attrition_rate,
    exits: d.inactive,
    total: d.total,
  })) || [];

  if (loading && !stats)
    return (
      <Layout bgClass="bg-sky-50/20 dark:bg-slate-950">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </Layout>
    );

  return (
    <Layout bgClass="bg-sky-50/20 dark:bg-slate-950">
      <div className="space-y-4 max-w-7xl pb-24 h-full overflow-y-auto lg:overflow-hidden lg:h-auto">

        {/* ── Row 1 — KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCard
            label="Total Employees" value={stats?.total_employees}
            sub={`${stats?.active || 0} active`}
            icon={Users} iconBg="bg-blue-50 dark:bg-blue-500/10" iconColor="text-blue-600"
          />
          <MetricCard
            label="Active Employees" value={stats?.active || 0}
            sub="Billable + Non-Billable + Buffer"
            icon={Activity} iconBg="bg-green-50 dark:bg-blue-500/10" iconColor="text-green-600"
          />
          <MetricCard
            label="Overall Attrition Rate" value={`${stats?.attrition_rate ?? 0}%`}
            sub={`${stats?.inactive || 0} total exits`}
            icon={TrendingDown} iconBg="bg-red-50 dark:bg-blue-500/10" iconColor="text-red-500"
          />
        </div>

        {/* ── Row 2 — Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Status Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <UserCheck size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Employee Status Distribution</h3>
            </div>
            <div
  className="chart-container"
  onMouseDown={(e) => e.preventDefault()}
></div>
<div
  className="chart-container"
  onMouseDown={(e) => e.preventDefault()}
>
            <ResponsiveContainer width="100%" height={200} tabIndex={-1} style={{ outline: 'none' }}>
              <BarChart data={statusData} barSize={40} style={{ outline: 'none' }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [value, "Employees"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: 600 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" label={{ position: "top", fontSize: 12, fontWeight: 700 }}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
        
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-50">
              {[
                { label: "Billable",     color: "bg-green-500",  count: stats?.billable     || 0 },
                { label: "Non-Billable", color: "bg-lime-500",   count: stats?.non_billable || 0 },
                { label: "Buffer",       color: "bg-yellow-400", count: stats?.buffer       || 0 },
                { label: "Inactive",     color: "bg-red-500",    count: stats?.inactive     || 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dept Attrition */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building2 size={18} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">Department-wise Attrition</h3>
            </div>
            {deptAttritionData.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <p className="text-gray-400 text-sm font-medium">No attrition data yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div
  className="chart-container"
  onMouseDown={(e) => e.preventDefault()}
>
                  <ResponsiveContainer width="100%" height={300} tabIndex={-1} style={{ outline: 'none' }}>
                    <BarChart data={deptAttritionData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }} barSize={16} style={{ outline: 'none' }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={140} />
                      <Tooltip
                        formatter={(value) => [value, "Exits"]}
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px", fontWeight: 600 }}
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar dataKey="exits" radius={[0, 6, 6, 0]}>
                        {deptAttritionData.map((entry, i) => (
                          <Cell key={i} fill={entry.exits > 0 ? "#4f46e5" : "#e2e8f0"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;