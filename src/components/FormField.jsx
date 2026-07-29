import React from "react";
import Select from "react-select";
import { getSelectStyles } from "../utils/selectStyles";
import { STATUS_OPTIONS, GENDER_OPTIONS, BLOOD_OPTIONS, MARITAL_OPTIONS } from "../utils/employeeUtils";

const baseClass = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-colors";
const errorClass = "w-full border border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-red-400 transition-colors";

export const FormField = ({ field, value, error, onChange, departments = [], employees = [] }) => {
  const val = value ?? "";
  const cls = error ? errorClass : baseClass;
  const selectStyles = getSelectStyles();

  if (field.type === "textarea") return <textarea rows={2} value={val} onChange={(e) => onChange(e.target.value)} className={cls} />;
  
  if (field.type === "select") return (
    <select value={val} onChange={(e) => onChange(e.target.value)} className={cls}>
      <option value="">Select Department</option>
      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
    </select>
  );

  if (field.type === "status_select") return (
    <select value={val} onChange={(e) => onChange(e.target.value)} className={cls}>
      {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  // ... (Add gender_select, blood_select, marital_select mapping similarly)

  if (field.type === "reporting_select") return (
    <Select
      styles={selectStyles}
      placeholder="Search Reporting Manager..."
      options={employees.map((emp) => ({ value: emp.id, label: `${emp.first_name} ${emp.last_name}` }))}
      value={employees.map((emp) => ({ value: emp.id, label: `${emp.first_name} ${emp.last_name}` })).find((opt) => opt.value === val) || null}
      onChange={(selected) => onChange(selected?.value || "")}
      isClearable
    />
  );

  if (field.type === "tel") return (
    <input type="tel" inputMode="numeric" maxLength={10} value={val} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10 digit number" className={cls} />
  );

  return <input type={field.type} required={field.required} value={val} onChange={(e) => onChange(e.target.value)} className={cls} />;
};