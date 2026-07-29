import { useState, useEffect, useRef } from "react";
import { getInitials, formatDate } from "../utils/formatters";
import { StatusBadge } from "../common/Badge";
import EditEmployeeModal from "./EditEmployeeModal";
import { deleteEmployeeDocument } from "../api/employees";
import {
  Pencil, X, Phone, MapPin, Calendar, Building2, User, Heart, FileText,
  ExternalLink, Download, Trash2, RefreshCw,
} from "lucide-react";

const Field = ({ label, value }) => (
  <div className="py-2 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
      {value || "—"}
    </p>
  </div>
);

const SectionHead = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mt-5 mb-1">
    <div className="w-5 h-5 rounded-md bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
      <Icon size={11} className="text-sky-500 dark:text-sky-400" />
    </div>
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
      {title}
    </p>
  </div>
);

const AddressBlock = ({ title, address, pincode, city, state }) => {
  const hasData = address || pincode || city || state;
  return (
    <div className="mb-2.5 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
        {title}
      </p>
      {hasData ? (
        <div className="space-y-0.5">
          {address && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {address}
            </p>
          )}
          {(city || pincode) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {[city, pincode].filter(Boolean).join(" — ")}
            </p>
          )}
          {state && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{state}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-600">—</p>
      )}
    </div>
  );
};

const EmployeeProfilePanel = ({ employee, onClose, onEditSuccess, employees, departments }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [docs, setDocs] = useState(employee?.documents ?? []);
  const [deletingId, setDeletingId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (employee && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setDocs(employee?.documents ?? []);
  }, [employee]);

  if (!employee) return null;

  const prof = employee.professional_details ?? {};
  const currentStatus = prof.status ?? employee.status ?? undefined;

  const handleDownload = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete ${doc.name}? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await deleteEmployeeDocument(employee.id, doc.id);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
      onEditSuccess?.(); // refresh parent list/counts if needed
    } catch (e) {
      alert("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-[2px] transition-opacity"
          onClick={onClose}
        />

        <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col overflow-hidden transition-colors">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 flex-shrink-0 transition-colors">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              Employee Profile
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-xs font-bold shadow-sm transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Avatar + name */}
          <div className="px-5 py-5 bg-gradient-to-br from-sky-50/60 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-lg font-bold">
                  {getInitials(employee.first_name, employee.last_name)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                  {employee.first_name} {employee.last_name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                  <Building2 size={11} />
                  {prof.department_name ?? "No Department"}
                </p>
                <div className="mt-2">
                  {currentStatus ? (
                    <StatusBadge status={currentStatus} />
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600 italic">
                      No status
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-6">
            {/* Contact */}
            <SectionHead icon={Phone} title="Contact" />
            <Field label="Phone" value={employee.phone_no} />
            <Field label="Email" value={employee.email} />
            <Field label="Alt Phone" value={employee.alternative_phone_no} />

            {/* Personal */}
            <SectionHead icon={User} title="Personal" />
            <Field
              label="Date of Birth"
              value={formatDate(employee.date_of_birth)}
            />
            <Field label="Gender" value={employee.gender} />
            <Field label="Blood Group" value={employee.blood_group} />
            <Field label="Marital Status" value={employee.marital_status} />

            {/* Family */}
            <SectionHead icon={Heart} title="Family" />
            <Field label="Father's Name" value={employee.father_name} />
            <Field label="Mother's Name" value={employee.mother_name} />
            <Field label="Spouse's Name" value={employee.spouse_name} />

            {/* Address */}
            <SectionHead icon={MapPin} title="Address" />
            <AddressBlock
              title="Current"
              address={employee.current_address}
              pincode={employee.current_pincode}
              city={employee.current_city}
              state={employee.current_state}
            />
            <AddressBlock
              title="Permanent"
              address={employee.permanent_address}
              pincode={employee.permanent_pincode}
              city={employee.permanent_city}
              state={employee.permanent_state}
            />
            {employee.aadhaar_address && (
              <AddressBlock
                title="Aadhaar"
                address={employee.aadhaar_address}
              />
            )}

            {/* Professional */}
            <SectionHead icon={Calendar} title="Professional" />

            <Field label="Designation" value={prof.designation} />

            <Field label="Joined On" value={formatDate(prof.joined_on)} />

            <Field label="Reports To" value={prof.reporting_to_name} />

            <Field
              label="Account Status"
              value={prof.is_active ? "Active" : "Deactivated"}
            />

            {/* Documents */}
            <SectionHead icon={FileText} title="Documents" />
            {docs.length > 0 ? (
              <div className="space-y-2 mt-1">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    <FileText
                      size={14}
                      className="text-sky-400 dark:text-sky-500 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                        {doc.name}
                      </p>
                      {doc.unique_id && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          ID: {doc.unique_id}
                        </p>
                      )}
                    </div>
                    {doc.file_path ? (
                      <div
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Open */}
                        <a
                          href={doc.file_path}
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <ExternalLink size={11} />
                          Open
                        </a>

                        {/* Download */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(doc.file_path, doc.name);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Download size={11} />
                          Download
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(doc);
                          }}
                          disabled={deletingId === doc.id}
                          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                          title="Delete document"
                        >
                          {deletingId === doc.id
                            ? <RefreshCw size={11} className="animate-spin" />
                            : <Trash2 size={11} />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-600 italic flex-shrink-0">
                        No file
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                No documents uploaded yet.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/80 flex-shrink-0 transition-colors">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Added: {formatDate(employee.created_at)}
            </p>
          </div>
        </div>
      </div>

      <EditEmployeeModal
        isOpen={showEdit}
        employee={employee}
        departments={departments}
        employees={employees}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          setShowEdit(false);
          onEditSuccess?.();
        }}
      />
    </>
  );
};

export default EmployeeProfilePanel;