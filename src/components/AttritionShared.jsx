import { AlertCircle } from "lucide-react";

// ── Constants ────────────────────────────────────────────────
export const DEPT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#f97316", "#06b6d4", "#84cc16", "#ef4444", "#6366f1"];
export const EXP_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
export const ROLE_COLORS = [...DEPT_COLORS];

export const TIME_OPTS = [
  { label: "3 Months", value: 3 },
  { label: "6 Months", value: 6 },
  { label: "12 Months", value: 12 },
  { label: "24 Months", value: 24 },
];
export const TABS = ["Monthly Trend", "By Department", "By Role", "By Experience"];

// ── Tooltips ────────────────────────────────────────────────
export function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-xs min-w-36">
      <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      <p className="text-blue-600 dark:text-blue-400">
        Rate: <span className="font-bold">{payload[0]?.value ?? 0}%</span>
      </p>
    </div>
  );
}

// Unified Tooltip for Department & Role
export function AttritionCustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
        <p className="text-sm text-blue-500">
          Exits: <span className="font-semibold">{payload[0].value || payload[0].payload.exits}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-bold text-gray-700 dark:text-gray-200">
        {d.name} : {d.value}
      </p>
    </div>
  );
}

export function HBarTooltip({ active, payload, labelKey }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-bold text-gray-700 dark:text-gray-200">{d[labelKey]}</p>
      <p className="text-blue-600 dark:text-blue-400 mt-1">
        Exits: <span className="font-bold">{d.exits}</span>
      </p>
    </div>
  );
}

// ── UI Helpers ────────────────────────────────────────────────
export function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
        active
          ? "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-100 shadow-sm"
          : "bg-transparent border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export function Empty({ msg }) {
  return (
    <div className="py-14 flex flex-col items-center gap-3 text-center px-6">
      <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
        <AlertCircle size={22} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No data available</p>
      <p className="text-xs text-gray-400 max-w-sm">{msg}</p>
    </div>
  );
}

export function PieLabel({ cx, cy, midAngle, outerRadius, value }) {
  if (!value) return null;
  const rad = Math.PI / 180;
  const x = cx + (outerRadius + 20) * Math.cos(-midAngle * rad);
  const y = cy + (outerRadius + 20) * Math.sin(-midAngle * rad);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={12} fill="#64748b" fontWeight={600}>
      {value}
    </text>
  );
}