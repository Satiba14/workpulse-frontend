import React from "react";
import { Upload, X, CheckCircle, FileText } from "lucide-react";

export const DOCUMENT_TYPES = [
  "Photo",
  "Resume",
  "Offer Letter",
  "Revision Letter",
  "Other",
];

const DocumentUpload = ({ documents, addDoc, remDoc }) => {
  return (
    <div className="mt-5">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <FileText size={12} /> Documents
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {DOCUMENT_TYPES.map((type) => {
          const staged = documents.find((d) => d.name === type);
          return (
            <label
              key={type}
              className={`flex items-center gap-2 p-2.5 border border-dashed rounded-xl cursor-pointer transition-colors group ${
                staged
                  ? "border-green-300 dark:border-green-500/50 bg-green-50 dark:bg-green-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-500"
              }`}
            >
              {staged ? (
                <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
              ) : (
                <Upload size={12} className="text-gray-400 dark:text-gray-500 group-hover:text-sky-500 dark:group-hover:text-sky-400 flex-shrink-0" />
              )}
              <span className={`text-xs font-medium truncate ${
                  staged ? "text-green-700 dark:text-green-400" : "text-gray-600 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                }`}
              >
                {staged ? staged.file.name.slice(0, 14) + "…" : type}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files[0]) addDoc(type, e.target.files[0]);
                }}
              />
            </label>
          );
        })}
      </div>

      {documents.length > 0 && (
        <div className="space-y-1.5">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
              <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex-shrink-0">{doc.name}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 truncate flex-1">{doc.file?.name}</span>
              <button
                type="button"
                onClick={() => remDoc(i)}
                className="text-gray-300 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-400"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;