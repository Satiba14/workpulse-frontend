import React from "react";
import Select from "react-select";

// ── react-select styles that exactly match your plain inputs ──────────────────
const makeSelectStyles = (isDark = false) => ({
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#38bdf8" : isDark ? "#334155" : "#e5e7eb",
    boxShadow: "none",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: isDark ? "transparent" : "transparent",
    color: isDark ? "#f1f5f9" : "#374151",
    cursor: "pointer",
    "&:hover": { borderColor: "#38bdf8" },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),
  singleValue: (base) => ({
    ...base,
    color: isDark ? "#f1f5f9" : "#374151",
    fontSize: "14px",
    fontWeight: 500,
  }),
  placeholder: (base) => ({
    ...base,
    color: isDark ? "#64748b" : "#9ca3af",
    fontSize: "14px",
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: isDark ? "#f1f5f9" : "#374151",
    fontSize: "14px",
    fontWeight: 500,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? isDark ? "#1e293b" : "#f3f4f6"
      : isDark ? "#0f172a" : "white",
    color: isDark ? "#e2e8f0" : "#374151",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 9999,
    backgroundColor: isDark ? "#0f172a" : "white",
    border: isDark ? "1px solid #334155" : "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  }),
  clearIndicator: (base) => ({
    ...base,
    color: isDark ? "#64748b" : "#9ca3af",
    "&:hover": { color: isDark ? "#e2e8f0" : "#374151" },
    padding: "0 4px",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: isDark ? "#64748b" : "#9ca3af",
    padding: "0 6px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
});

// detect dark mode from document class
const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const DeptModal = ({
  title,
  form,
  setForm,
  departments,
  employees,
  onClose,
  onSubmit,
  submitting,
  error,
}) => {
  const styles = makeSelectStyles(isDark());

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Department Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
              Department Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Cloud Infrastructure"
              className="w-full bg-transparent border border-gray-200 dark:border-slate-700 dark:text-gray-100 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Department Manager */}
          {employees && (
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
                Department Manager{" "}
                <span className="text-gray-300 dark:text-slate-500 font-normal">
                  (optional)
                </span>
              </label>
              <Select
                placeholder="Search manager..."
                styles={styles}
                options={employees.map((emp) => ({
                  value: emp.id,
                  label: `${emp.first_name} ${emp.last_name}`,
                }))}
                value={
                  employees
                    .map((emp) => ({
                      value: emp.id,
                      label: `${emp.first_name} ${emp.last_name}`,
                    }))
                    .find((opt) => opt.value === form.manager_emp) || null
                }
                onChange={(selected) =>
                  setForm((f) => ({
                    ...f,
                    manager_emp: selected?.value || "",
                  }))
                }
                isClearable
              />
            </div>
          )}

          {/* Reports To */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
              Reports To{" "}
              <span className="text-gray-300 dark:text-slate-500 font-normal">
                (optional)
              </span>
            </label>
            <Select
              placeholder="Search department..."
              styles={styles}
              options={departments.map((d) => ({
                value: d.id,
                label: d.name,
              }))}
              value={
                departments
                  .map((d) => ({ value: d.id, label: d.name }))
                  .find((opt) => opt.value === form.parent_department) || null
              }
              onChange={(selected) =>
                setForm((f) => ({
                  ...f,
                  parent_department: selected?.value || "",
                }))
              }
              isClearable
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeptModal;