import React from "react";
import Select from "react-select";

export const STATUS_OPTIONS = [
  { value: "billable", label: "Billable" },
  { value: "non_billable", label: "Non-Billable" },
  { value: "buffer", label: "Buffer" },
  { value: "inactive", label: "Inactive" },
];
export const GENDER_OPTIONS = [
  { value: "", label: "Select" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];
export const BLOOD_OPTIONS = [
  { value: "", label: "Select" },
  ...["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((v) => ({
    value: v,
    label: v,
  })),
];
export const MARITAL_OPTIONS = [
  { value: "", label: "Select" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

const base =
  "w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-sky-400 dark:focus:border-sky-500 focus:ring-1 focus:ring-sky-100 dark:focus:ring-sky-900/30 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500";
const errB =
  "w-full bg-white dark:bg-gray-900 border border-red-300 dark:border-red-500/60 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:border-red-400 transition-colors";

const FormInput = ({ field, value, error, onChange, departments, employees, selectStyles }) => {
  const val = value ?? "";
  const cls = error ? errB : base;

  if (field.type === "textarea") {
    return <textarea rows={2} value={val} onChange={(e) => onChange(field.name, e.target.value)} className={cls} />;
  }
  
  if (field.type === "select") {
    return (
      <select value={val} onChange={(e) => onChange(field.name, e.target.value)} className={cls}>
        <option value="">Select Department</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
    );
  }

  if (["status_select", "gender_select", "blood_select", "marital_select"].includes(field.type)) {
    const optionsMap = {
      status_select: STATUS_OPTIONS,
      gender_select: GENDER_OPTIONS,
      blood_select: BLOOD_OPTIONS,
      marital_select: MARITAL_OPTIONS,
    };
    
    return (
      <select value={val} onChange={(e) => onChange(field.name, e.target.value)} className={cls}>
        {optionsMap[field.type].map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === "reporting_select") {
    return (
      <Select
        styles={selectStyles}
        placeholder="Search Reporting Manager..."
        options={employees.map((emp) => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`,
        }))}
        value={
          employees
            .map((emp) => ({ value: emp.id, label: `${emp.first_name} ${emp.last_name}` }))
            .find((opt) => opt.value === val) || null
        }
        onChange={(selected) => onChange(field.name, selected?.value || "")}
        isClearable
      />
    );
  }

  if (field.type === "tel") {
    return (
      <input
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={val}
        onChange={(e) => onChange(field.name, e.target.value.replace(/\D/g, "").slice(0, 10))}
        placeholder="10 digit number"
        className={cls}
      />
    );
  }

  return (
    <input
      type={field.type}
      required={field.required}
      value={val}
      onChange={(e) => onChange(field.name, e.target.value)}
      className={cls}
    />
  );
};

export default FormInput;