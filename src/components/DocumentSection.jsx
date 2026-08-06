import React, { useState } from "react";
import { Upload, X, CheckCircle, FileText, ExternalLink, Paperclip, RefreshCw, Image as ImageIcon, Trash2, Download } from "lucide-react";
import { deleteEmployeeDocument } from "../api/employees";

// ── Document type config ────────────────────────────────────────────────────
const DOC_TYPES = [
  {
    key: "photo",
    label: "Photo",
    accept: ".jpg,.jpeg,.png,.webp",
    hint: "JPG, PNG or WEBP only",
  },
  {
    key: "resume",
    label: "Resume",
    accept: ".pdf,.doc,.docx",
    hint: "PDF or Word",
  },
  {
    key: "offer_letter",
    label: "Offer Letter",
    accept: ".pdf,.doc,.docx",
    hint: "PDF or Word",
  },
  {
    key: "revision_letter",
    label: "Revision Letter",
    accept: ".pdf,.doc,.docx",
    hint: "PDF or Word",
  },
  {
    key: "other",
    label: "Other",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
    hint: "PDF, image or Word",
  },
];

export const DocumentSection = ({
  existingDocs = [],
  pendingUploads,
  setPendingUploads,
  onDocDeleted,
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [localRemoved, setLocalRemoved] = useState([]); // ids removed optimistically

  const findExisting = (typeKey) =>
    existingDocs.find(
      (d) => d.document_type === typeKey && !localRemoved.includes(d.id),
    );

  const handleFile = (typeKey, file) => {
    setPendingUploads((prev) => ({ ...prev, [typeKey]: file }));
  };

  const clearPending = (typeKey) => {
    setPendingUploads((prev) => {
      const next = { ...prev };
      delete next[typeKey];
      return next;
    });
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete ${doc.name}? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await deleteEmployeeDocument(
        doc.employee_professional_details ?? doc.empId,
        doc.id,
      );
      setLocalRemoved((prev) => [...prev, doc.id]);
      onDocDeleted?.(doc.id);
    } catch (e) {
      alert("Failed to delete document. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
        <FileText size={12} /> Documents
      </p>

      <div className="space-y-2.5">
        {DOC_TYPES.map(({ key, label, accept, hint }) => {
          const existing = findExisting(key);
          const pending = pendingUploads?.[key];

          return (
            <div
              key={key}
              className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              {/* Icon */}
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
                {key === "photo" ? (
                  <ImageIcon size={13} className="text-sky-400" />
                ) : (
                  <Paperclip size={13} className="text-sky-400" />
                )}
              </div>

              {/* Label + status */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {label}
                </p>
                {pending ? (
                  <p className="text-xs text-green-600 dark:text-green-400 truncate flex items-center gap-1">
                    <CheckCircle size={11} /> {pending.name} (will replace on
                    save)
                  </p>
                ) : existing ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Uploaded
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    Not uploaded
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {existing?.file_path && !pending && (
                  <>
                    <a
                      href={existing.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        // For PDFs and docs, force download instead of trying to open inline
                        const url = existing.file_path || "";
                        if (
                          url.includes("/raw/") ||
                          url.endsWith(".pdf") ||
                          url.endsWith(".docx") ||
                          url.endsWith(".doc")
                        ) {
                          e.preventDefault();
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = existing.name || "document";
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 px-2 py-1 rounded-lg transition-colors"
                    >
                      <ExternalLink size={11} /> Open
                    </a>

                    

                    <button
                      type="button"
                      onClick={() => handleDelete(existing)}
                      disabled={deletingId === existing.id}
                      className="flex items-center justify-center w-6 h-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === existing.id
                        ? <RefreshCw size={12} className="animate-spin" />
                        : <Trash2 size={12} />}
                    </button>
                    
                      <a href={existing.file_path}
                      download={existing.name || 'document'}
                      className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/30 px-2 py-1 rounded-lg transition-colors"
                    >
                      <Download size={11} /> Download
                    </a>
                  </>
                )}

                {pending && (
                  <button
                    type="button"
                    onClick={() => clearPending(key)}
                    className="flex items-center justify-center w-6 h-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Cancel"
                  >
                    <X size={13} />
                  </button>
                )}

                <label
                  className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-500 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  title={hint}
                >
                  {existing ? <RefreshCw size={11} /> : <Upload size={11} />}
                  {existing ? "Re-upload" : "Upload"}
                  <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={(e) => {
                      if (e.target.files[0]) handleFile(key, e.target.files[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Re-uploading a document replaces the existing file of that type — it
        never adds a duplicate.
      </p>
    </div>
  );
};
