// src/utils/employeeUtils.js

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
    value: v, label: v,
  })),
];

export const MARITAL_OPTIONS = [
  { value: "", label: "Select" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export const PERSONAL_FIELDS = [
  "first_name", "last_name", "phone_no", "email","alternative_phone_no", 
  "date_of_birth", "gender", "blood_group", "marital_status",
];

export const FAMILY_FIELDS = ["father_name", "mother_name", "spouse_name"];

export const toDate = (raw) => {
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    const [d, m, y] = raw.split("-");
    return `${y}-${m}-${d}`;
  }
  try {
    const dt = new Date(raw);
    if (!isNaN(dt)) return dt.toISOString().split("T")[0];
  } catch (_) {}
  return "";
};

export const buildForm = (emp) => {
  const prof = emp.professional_details ?? {};
  return {
    first_name: emp.first_name ?? "",
    last_name: emp.last_name ?? "",
    phone_no: emp.phone_no ?? "",
    email: emp.email ?? "",
    alternative_phone_no: emp.alternative_phone_no ?? "",
    date_of_birth: toDate(emp.date_of_birth),
    gender: emp.gender ?? "",
    blood_group: emp.blood_group ?? "",
    marital_status: emp.marital_status ?? "",
    father_name: emp.father_name ?? "",
    mother_name: emp.mother_name ?? "",
    spouse_name: emp.spouse_name ?? "",
    current_address: emp.current_address ?? "",
    current_pincode: emp.current_pincode ?? "",
    current_city: emp.current_city ?? "",
    current_state: emp.current_state ?? "",
    permanent_address: emp.permanent_address ?? "",
    permanent_pincode: emp.permanent_pincode ?? "",
    permanent_city: emp.permanent_city ?? "",
    permanent_state: emp.permanent_state ?? "",
    aadhaar_address: emp.aadhaar_address ?? "",
    nation: emp.nation ?? "",
    department: prof.department ?? "",
    designation: prof.designation ?? "",
    joined_on: toDate(prof.joined_on),
    status: prof.status ?? "billable",
    reporting_to: prof.reporting_to ?? "",
  };
};

export const validateStep = (fields, form) => {
  const errors = {};
  fields.forEach((f) => {
    if (f.required && !String(form[f.name] ?? "").trim())
      errors[f.name] = `${f.label} is required`;
    else if (f.validate) {
      const e = f.validate(form[f.name]);
      if (e) errors[f.name] = e;
    }
  });
  return errors;
};