import { RefreshCw } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function EmployeeSelector({ loadingEmps, employees, selectedId, onSelect }) {
  const employeeOptions = employees.map(e => ({
    value: String(e.id),
    label: `${e.first_name} ${e.last_name}${e.department_name ? ` — ${e.department_name}` : ''}`,
  }));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-sm">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">
        Select Employee
      </label>
      {loadingEmps ? (
        <div className="flex items-center gap-2 py-3">
          <RefreshCw size={14} className="animate-spin text-blue-500" />
          <span className="text-sm text-gray-400">Loading employees…</span>
        </div>
      ) : (
        <CustomSelect
          value={selectedId}
          onChange={onSelect}
          options={employeeOptions}
          placeholder="Select an employee…"
          searchable
        />
      )}
    </div>
  );
}