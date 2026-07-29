import { useState } from "react";
import { MessageSquare, X, Send, RefreshCw } from "lucide-react";
import { API_BASE, getToken, CATEGORIES } from "../utils/concernUtils";
import CustomSelect from "./CustomSelect";

const RequestFeedbackModal = ({ employees, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    employee: '', reason_category: 'performance', message: '', priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.employee || !form.message.trim())
      return setError('Please select an employee and write a message.');
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/concerns/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send request.');
      onSuccess(await res.json());
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const textareaClass = "w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm resize-none";

  // Build options from CATEGORIES
  // CATEGORIES may be an object { key: label } or an array of strings — handle both
  const categoryOptions = Array.isArray(CATEGORIES)
    ? CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
    : Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: v }));

  const priorityOptions = [
    { value: 'low',    label: 'Low'    },
    { value: 'medium', label: 'Medium' },
    { value: 'high',   label: 'High'   },
  ];

  const employeeOptions = employees.map(e => ({
    value: String(e.id),
    label: `${e.first_name} ${e.last_name}`,
  }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 dark:border-slate-800 overflow-visible max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-xl p-2">
                <MessageSquare size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Request Employee Feedback</h2>
                <p className="text-xs text-gray-400">Send a private feedback request to an employee</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Employee */}
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                Employee <span className="text-red-400">*</span>
              </label>
              <CustomSelect
                value={form.employee}
                onChange={val => setForm(f => ({ ...f, employee: val }))}
                options={employeeOptions}
                placeholder="Select employee…"
                searchable
              />
            </div>

            {/* Category + Priority — stacked on mobile, side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                  Category
                </label>
                <CustomSelect
                  value={form.reason_category}
                  onChange={val => setForm(f => ({ ...f, reason_category: val }))}
                  options={categoryOptions}
                  placeholder="Select category…"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                  Priority
                </label>
                <CustomSelect
                  value={form.priority}
                  onChange={val => setForm(f => ({ ...f, priority: val }))}
                  options={priorityOptions}
                  placeholder="Select priority…"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Describe the concern..."
                className={textareaClass}
              />
            </div>

            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Send size={11} /> A private response link will be sent to the employee.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors"
            >
              {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? 'Sending…' : 'Send Request'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestFeedbackModal;