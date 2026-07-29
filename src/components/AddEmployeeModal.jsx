import { useState } from "react";
import { createEmployee, uploadEmployeeDocument } from "../api/employees";
import { EMPLOYEE_FORM_SECTIONS, EMPLOYEE_INITIAL_STATE } from "../constants/formFields";
import { useEmployees } from "../hooks/useEmployees";
import { getSelectStyles } from "../utils/selectStyles";

// Import your newly separated components
import FormInput from "./FormInput";
import DocumentUpload from "./DocumentUpload";

const TOTAL_STEPS = EMPLOYEE_FORM_SECTIONS.length;
const PERSONAL_FIELDS = ["first_name", "last_name", "phone_no","email", "alternative_phone_no", "date_of_birth", "gender", "blood_group", "marital_status"];
const FAMILY_FIELDS = ["father_name", "mother_name", "spouse_name"];

// Maps the display label used by DocumentUpload.jsx -> backend document_type key
const DOC_TYPE_MAP = {
  "Photo":           "photo",
  "Resume":          "resume",
  "Offer Letter":    "offer_letter",
  "Revision Letter": "revision_letter",
  "Other":           "other",
};

const validateStep = (fields, form) => {
  const errors = {};
  fields.forEach((f) => {
    if (f.required && !String(form[f.name] ?? "").trim()) errors[f.name] = `${f.label} is required`;
    else if (f.validate) {
      const e = f.validate(form[f.name]);
      if (e) errors[f.name] = e;
    }
  });
  return errors;
};

const AddEmployeeModal = ({ isOpen, onClose, onSuccess, departments }) => {
  const [step, setStep] = useState(1);
  const [addrStep, setAddrStep] = useState(1);
  const [form, setForm] = useState(EMPLOYEE_INITIAL_STATE);
  const { employees } = useEmployees();
  const [errors, setErrors] = useState({});
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleFieldChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const close = () => {
    setStep(1);
    setAddrStep(1);
    setForm(EMPLOYEE_INITIAL_STATE);
    setErrors({});
    setDocuments([]);
    setFormError("");
    onClose();
  };

  const addDoc = (type, file) => {
    setDocuments((d) => {
      const existing = d.findIndex((x) => x.name === type);
      if (existing >= 0) {
        const updated = [...d];
        updated[existing] = { name: type, file };
        return updated;
      }
      return [...d, { name: type, file }];
    });
  };

  const remDoc = (i) => setDocuments((d) => d.filter((_, idx) => idx !== i));

  const handleNext = () => {
    const currentSection = EMPLOYEE_FORM_SECTIONS[step - 1];
    let fieldsToValidate = currentSection.fields;
    if (step === 2) {
      if (addrStep === 1) fieldsToValidate = currentSection.fields.filter((f) => f.name.startsWith("current_"));
      else if (addrStep === 2) fieldsToValidate = currentSection.fields.filter((f) => f.name.startsWith("permanent_"));
      else fieldsToValidate = currentSection.fields.filter((f) => f.name === "aadhaar_address" || f.name === "nation");
    }
    const errs = validateStep(fieldsToValidate, form);
    if (Object.keys(errs).length) {
      setErrors((prev) => ({ ...prev, ...errs }));
      return;
    }
    setErrors({});
    if (step === 2 && addrStep < 3) setAddrStep((s) => s + 1);
    else {
      setStep((s) => s + 1);
      if (step === 1) setAddrStep(1);
    }
  };

  const handleBack = () => {
    if (step === 2 && addrStep > 1) setAddrStep((s) => s - 1);
    else if (step === 3) {
      setStep(2);
      setAddrStep(3);
    } else setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      const payload = {
        ...form,
        department: form.department || null,
        reporting_to: form.reporting_to || null,
        date_of_birth: form.date_of_birth || null,
        joined_on: form.joined_on || null,
        gender: form.gender || "",
        blood_group: form.blood_group || "",
        marital_status: form.marital_status || "",
      };
      const res = await createEmployee(payload);
      const empId = res.data?.id ?? res.data?.data?.id;

      if (empId && documents.length > 0) {
        const uploadResults = await Promise.allSettled(
          documents.map((doc) => {
            const documentType = DOC_TYPE_MAP[doc.name] || "other";
            const fd = new FormData();
            fd.append("file", doc.file);
            fd.append("name", doc.name);
            fd.append("document_type", documentType);
            return uploadEmployeeDocument(empId, fd);
          })
        );

        const failed = uploadResults.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          console.error("Some documents failed to upload:", failed);
          setFormError(
            `Employee created, but ${failed.length} document(s) failed to upload. You can re-upload them from Edit Employee.`
          );
          // still proceed — employee record was created successfully
        }
      }
      close();
      onSuccess();
    } catch (err) {
      const detail = err?.response?.data;
      const msg = typeof detail === "object"
        ? Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`).join(", ")
        : "Failed to create employee. Please check all fields.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyles = getSelectStyles();
  const section = EMPLOYEE_FORM_SECTIONS[step - 1];
  const isLast = step === TOTAL_STEPS;

  const renderFieldComponent = (field) => (
    <div key={field.name} className={field.cols === 2 || field.type === "textarea" ? "col-span-2" : ""}>
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
        {field.label} {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <FormInput
        field={field}
        value={form[field.name]}
        error={errors[field.name]}
        onChange={handleFieldChange}
        departments={departments}
        employees={employees}
        selectStyles={selectStyles}
      />
      {errors[field.name] && <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{errors[field.name]}</p>}
    </div>
  );

  const renderAddressFields = () => {
    const groups = [
      { header: "Current Address", fields: section.fields.filter((f) => f.name.startsWith("current_")) },
      { header: "Permanent Address", fields: section.fields.filter((f) => f.name.startsWith("permanent_")) },
      { header: "Aadhaar Address", fields: section.fields.filter((f) => f.name === "aadhaar_address" || f.name === "nation") },
    ];
    const g = groups[addrStep - 1];

    return (
      <div className="col-span-2">
        <div className="flex gap-2 mb-4">
          {groups.map((_, idx) => (
            <div key={idx} className={`h-1 flex-1 rounded-full transition-colors ${idx + 1 === addrStep ? "bg-sky-500" : idx + 1 < addrStep ? "bg-sky-200 dark:bg-sky-900" : "bg-gray-100 dark:bg-gray-800"}`} />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{g.header}</p>
        <div className="grid grid-cols-2 gap-3">
          {g.fields.map(renderFieldComponent)}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col border border-gray-100 dark:border-gray-800">

        {/* Header Section */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">Add New Employee</h2>
          <button onClick={close} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">✕</button>
        </div>

        {/* Form Body */}
        <div className="px-6 py-4 overflow-y-auto">
          {formError && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm font-semibold mb-4">{formError}</div>}
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${section.color}`}>{section.title}</p>

          <div className="grid grid-cols-2 gap-3">
            {step === 1 ? (
              <>
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-3">
                    {section.fields.filter((f) => PERSONAL_FIELDS.includes(f.name)).map(renderFieldComponent)}
                  </div>
                </div>
                <div className="col-span-2 mt-4">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Family Details</p>
                  <div className="grid grid-cols-3 gap-3">
                    {section.fields.filter((f) => FAMILY_FIELDS.includes(f.name)).map(renderFieldComponent)}
                  </div>
                </div>
              </>
            ) : step === 2 ? (
              renderAddressFields()
            ) : (
              section.fields.map(renderFieldComponent)
            )}
          </div>

          {isLast && <DocumentUpload documents={documents} addDoc={addDoc} remDoc={remDoc} />}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 flex-shrink-0">
          {step > 1 && (
            <button type="button" onClick={handleBack} className="px-5 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              ← Back
            </button>
          )}
          {!isLast ? (
            <button type="button" onClick={handleNext} className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl text-sm font-bold transition-all">
              Next →
            </button>
          ) : (
            <button type="button" disabled={submitting} onClick={handleSubmit} className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl text-sm font-bold disabled:opacity-60 transition-all">
              {submitting ? "Creating..." : "Create Employee ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;