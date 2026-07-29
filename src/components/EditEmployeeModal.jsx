import { useState, useEffect } from "react";
import { updateEmployee } from "../api/employees";
import { uploadEmployeeDocument } from "../api/employees";
import { EMPLOYEE_FORM_SECTIONS } from "../constants/formFields";
import {
  buildForm,
  validateStep,
  PERSONAL_FIELDS,
  FAMILY_FIELDS
} from "../utils/employeeUtils";
import { FormField } from "./FormField";
import { DocumentSection } from "./DocumentSection";

const TOTAL_STEPS = EMPLOYEE_FORM_SECTIONS.length;

const EditEmployeeModal = ({ isOpen, employee, onClose, onSuccess, departments, employees }) => {
  const [step, setStep] = useState(1);
  const [addrStep, setAddrStep] = useState(1);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [pendingUploads, setPendingUploads] = useState({});

  useEffect(() => {
    if (employee) {
      setForm(buildForm(employee));
      setStep(1);
      setAddrStep(1);
      setErrors({});
      setFormError("");
      setPendingUploads({});
    }
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleUpdate = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleNext = () => {
    const currentSection = EMPLOYEE_FORM_SECTIONS[step - 1];
    let fieldsToValidate = currentSection.fields;

    if (step === 2) {
      if (addrStep === 1)
        fieldsToValidate = currentSection.fields.filter((f) => f.name.startsWith("current_"));
      else if (addrStep === 2)
        fieldsToValidate = currentSection.fields.filter((f) => f.name.startsWith("permanent_"));
      else
        fieldsToValidate = currentSection.fields.filter((f) => f.name === "aadhaar_address" || f.name === "nation");
    }

    const errs = validateStep(fieldsToValidate, form);
    if (Object.keys(errs).length) {
      setErrors((prev) => ({ ...prev, ...errs }));
      return;
    }

    setErrors({});
    if (step === 2 && addrStep < 3) {
      setAddrStep((s) => s + 1);
    } else {
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
      };

      await updateEmployee(employee.id, payload);

      // ── Upload any staged documents (photo / resume / offer / revision / other) ──
      const uploadEntries = Object.entries(pendingUploads);
      for (const [docType, file] of uploadEntries) {
        const docLabel = {
          photo: 'Photo',
          resume: 'Resume',
          offer_letter: 'Offer Letter',
          revision_letter: 'Revision Letter',
          other: 'Other',
        }[docType] || 'Document';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', docLabel);
        formData.append('document_type', docType);

        await uploadEmployeeDocument(employee.id, formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setFormError("Failed to update employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const section = EMPLOYEE_FORM_SECTIONS[step - 1];
  const isLast = step === TOTAL_STEPS;

  const renderLayout = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {section.fields.filter(f => PERSONAL_FIELDS.includes(f.name)).map(field => (
              <FieldWrapper key={field.name} field={field} form={form} errors={errors} handleUpdate={handleUpdate} departments={departments} employees={employees} />
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Family Details</p>
          <div className="grid grid-cols-3 gap-3">
            {section.fields.filter(f => FAMILY_FIELDS.includes(f.name)).map(field => (
              <FieldWrapper key={field.name} field={field} form={form} errors={errors} handleUpdate={handleUpdate} departments={departments} employees={employees} />
            ))}
          </div>
        </div>
      );
    }

    if (step === 2) {
      const addressGroups = [
        { title: "Current Address", prefix: "current_" },
        { title: "Permanent Address", prefix: "permanent_" },
        { title: "Aadhaar Details", fields: ["aadhaar_address", "nation"] }
      ];
      const activeGroup = addressGroups[addrStep - 1];
      const groupFields = activeGroup.fields
        ? section.fields.filter(f => activeGroup.fields.includes(f.name))
        : section.fields.filter(f => f.name.startsWith(activeGroup.prefix));

      return (
        <div className="col-span-2">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === addrStep ? "bg-sky-500" : i < addrStep ? "bg-sky-200" : "bg-gray-100"}`} />
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{activeGroup.title}</p>
          <div className="grid grid-cols-2 gap-3">
            {groupFields.map(field => (
              <FieldWrapper key={field.name} field={field} form={form} errors={errors} handleUpdate={handleUpdate} departments={departments} employees={employees} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3">
        {section.fields.map(field => (
          <FieldWrapper key={field.name} field={field} form={form} errors={errors} handleUpdate={handleUpdate} departments={departments} employees={employees} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-opacity" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">Edit Employee</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
        </div>

        <div className="px-6 pt-4 flex items-center gap-2 flex-shrink-0">
          {EMPLOYEE_FORM_SECTIONS.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i + 1 <= step ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}>{i + 1}</div>
              <span className={`text-xs font-semibold truncate ${i + 1 === step ? "text-sky-600" : "text-gray-400"}`}>{s.title}</span>
              {i < TOTAL_STEPS - 1 && <div className={`flex-1 h-0.5 rounded ${i + 1 < step ? "bg-sky-400" : "bg-gray-100 dark:bg-gray-700"}`} />}
            </div>
          ))}
        </div>

        <div className="flex-1 px-7 py-4 overflow-y-auto pb-6">
          {formError && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm mb-4">{formError}</div>}
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${section.color}`}>{section.title}</p>

          {renderLayout()}

          {isLast && (
            <DocumentSection
              existingDocs={employee.documents ?? []}
              pendingUploads={pendingUploads}
              setPendingUploads={setPendingUploads}
            />
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 flex justify-end gap-3 flex-shrink-0">
          {step > 1 && <button onClick={handleBack} className="px-5 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">← Back</button>}
          <button
            onClick={isLast ? handleSubmit : handleNext}
            disabled={submitting}
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {isLast ? (submitting ? "Saving..." : "Save Changes ✓") : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldWrapper = ({ field, form, errors, handleUpdate, departments, employees }) => (
  <div className={field.cols === 2 || field.type === "textarea" ? "col-span-2" : ""}>
    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1">
      {field.label} {field.required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <FormField
      field={field}
      value={form[field.name]}
      error={errors[field.name]}
      onChange={(val) => handleUpdate(field.name, val)}
      departments={departments}
      employees={employees}
    />
    {errors[field.name] && <p className="text-xs text-red-500 mt-0.5">{errors[field.name]}</p>}
  </div>
);

export default EditEmployeeModal;