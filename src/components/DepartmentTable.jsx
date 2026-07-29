import React from "react";
import { Building2, Users, Pencil, Trash2 } from "lucide-react";
import { BufferBadge } from '../common/Badge';

const headcountHeaders = [
  "Department",
  "Total",
  "Billable",
  "Non-Billable",
  "Buffer",
  "Inactive",
  "Attrition",
  "Buffer %",
  "Manager",
  "Status",
  "",
];

const DepartmentTable = ({ departments, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full">
        {/* Fixed: Replaced malformed attributes with proper Tailwind class names */}
        <thead className="sticky top-0 z-10">
          {/* Changed background from /50 to solid so scrolling rows don't show through */}
          <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 shadow-sm">
            {headcountHeaders.map((h, i) => (
              <th
                key={i}
                className={`text-left px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${h === "" ? "w-16" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
          {departments.map((dept) => {
            const r = {
              total: dept.employee_count ?? 0,
              billable: dept.billable_count ?? 0,
              nonBill: dept.non_billable_count ?? 0,
              buffer: dept.buffer_count ?? 0,
              inactive: dept.inactive_count ?? 0,
              attrition: dept.attrition_count ?? 0,
              attrPct: dept.attrition_pct ?? "0.0",
              bufPct: dept.buffer_pct ?? "0.0",
              hireNeeded: dept.hire_needed ?? 0,
            };
            const bufOk = parseFloat(r.bufPct) >= 10;
            const attrHigh = parseFloat(r.attrPct) > 10;

            return (
              <tr
                key={dept.id}
                className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-sky-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Building2 size={13} className="text-sky-500 dark:text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                        {dept.name}
                      </p>
                      {dept.parent_department_name && (
                        <p className="text-xs text-gray-400 truncate">
                          under {dept.parent_department_name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <Users size={11} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                      {r.total}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-green-600 dark:text-green-500">
                    {r.billable || "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {r.nonBill || "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-500">
                    {r.buffer || "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-bold ${r.inactive > 0 ? "text-orange-500" : "text-gray-400 dark:text-gray-500"}`}>
                    {r.inactive || "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {r.attrition > 0 ? (
                    <span className={`text-sm font-bold ${attrHigh ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}>
                      {r.attrition} <span className="text-xs font-normal">({r.attrPct}%)</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${bufOk ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    {r.bufPct}%
                  </span>
                </td>
                <td className="px-4 py-4">
                  {dept.manager_name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 text-xs font-bold">
                          {dept.manager_name[0]}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {dept.manager_name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <BufferBadge bufPct={r.bufPct} hireNeeded={r.hireNeeded} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(dept)}
                      title="Edit"
                      className="w-7 h-7 flex items-center justify-center bg-sky-50 dark:bg-slate-800 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(dept)}
                      title="Delete"
                      className="w-7 h-7 flex items-center justify-center bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;