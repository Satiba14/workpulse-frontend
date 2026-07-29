import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { DEPT_COLORS, ROLE_COLORS, EXP_COLORS, LineTooltip, AttritionCustomTooltip, PieTooltip, HBarTooltip, PieLabel, Empty } from "./AttritionShared";

export function MonthlyTrendChart({ data }) {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Overall Attrition Trend</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip content={<LineTooltip />} />
          <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/70 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              {["Month", "Joiners", "Leavers", "Start HC", "End HC", "Rate %"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{row.month}</td>
                <td className="px-4 py-3 font-semibold text-emerald-600">+{row.joiners}</td>
                <td className="px-4 py-3 font-semibold text-red-500">-{row.leavers}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.start_hc}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.end_hc}</td>
                <td className="px-4 py-3 font-bold"><span className={row.rate > 0 ? "text-amber-600" : "text-gray-400"}>{row.rate}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ByDepartmentChart({ data }) {
  if (data.length === 0) return <Empty msg="No attrition records found for this period. Try a longer time range." />;
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-5">Attrition by Department</h2>
      <ResponsiveContainer width="100%" height={Math.max(260, data.length * 56)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="department" width={180} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip content={<AttritionCustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
          <Bar dataKey="exits" radius={[0, 6, 6, 0]} maxBarSize={36}>
            <LabelList dataKey="rate" position="right" formatter={(value) => `${value}%`} />
            {data.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ByRoleChart({ data }) {
  if (data.length === 0) return <Empty msg="No designation data yet. Add designations to employees and attrition records to see this chart." />;
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-5">Attrition by Designation / Role</h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="designation" tick={{ fill: "#64748b", fontSize: 11 }} angle={-15} textAnchor="end" interval={0} />
          <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip content={<AttritionCustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Bar dataKey="exits" radius={[6, 6, 0, 0]} maxBarSize={50}>
            {data.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ByExperienceChart({ data }) {
  if (data.length === 0) return <Empty msg="No experience data for this period. Try a longer time range." />;
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-5">Attrition by Experience Level</h2>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={data} dataKey="exits" nameKey="bucket" cx="50%" cy="50%" outerRadius={110} labelLine={true} label={<PieLabel />}>
              {data.map((_, i) => <Cell key={i} fill={EXP_COLORS[i % EXP_COLORS.length]} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend formatter={(v) => <span style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>{v}</span>} wrapperStyle={{ paddingTop: 16 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopReasonsChart({ data }) {
  if (data.length === 0) return (
    <div className="py-10 flex flex-col items-center gap-3 text-center">
      <p className="text-sm font-semibold text-gray-500">No exit reasons logged yet</p>
      <p className="text-xs text-gray-400 max-w-sm">Exit reasons are captured when employees submit exit interview responses.</p>
    </div>
  );
  
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
        <YAxis type="category" dataKey="reason_text" width={165} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => v.length > 24 ? v.slice(0, 22) + "…" : v} />
        <Tooltip
  formatter={(value) => [value, 'Exits']}
  cursor={{ fill: "rgba(0,0,0,0.04)" }}
  contentStyle={{
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontSize: '12px'
  }}
/> 
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28} fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}