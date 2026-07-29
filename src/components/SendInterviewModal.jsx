import { useState, useEffect } from 'react';
import { ClipboardList, X, RefreshCw, Send } from 'lucide-react';
import { API_BASE, getToken } from '../utils/exitInterviewUtils';
import CustomSelect from './CustomSelect';

const SendInterviewModal = ({ onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/employees/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setEmployees(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => setError('Failed to load employees.'))
      .finally(() => setLoadingEmps(false));
  }, []);

  const handleSend = async () => {
    if (!selectedEmp) { setError('Please select an employee.'); return; }
    setSending(true); setError('');
    try {
      const res = await fetch(
        `${API_BASE}/employees/${selectedEmp}/exit-interview/send/`,
        { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error('Failed to send.');
      const data = await res.json();
      onSuccess(data);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  const employeeOptions = employees.map(e => ({
    value: String(e.id),
    label: `${e.first_name} ${e.last_name}${e.department_name ? ` — ${e.department_name}` : ''}`,
  }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-slate-800 overflow-visible">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-xl p-2">
                <ClipboardList size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Send Exit Interview</h2>
                <p className="text-xs text-gray-400">Generate a unique form link for the employee</p>
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
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">
                Select Employee <span className="text-red-400">*</span>
              </label>
              {loadingEmps ? (
                <div className="flex items-center gap-2 py-3">
                  <RefreshCw size={14} className="animate-spin text-blue-500" />
                  <span className="text-sm text-gray-400">Loading employees…</span>
                </div>
              ) : (
                <CustomSelect
                  value={selectedEmp}
                  onChange={setSelectedEmp}
                  options={employeeOptions}
                  placeholder="Select employee…"
                  searchable
                />
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <Send size={11} /> A unique form link will be generated for the selected employee.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || loadingEmps}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
            >
              {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
              {sending ? 'Sending…' : 'Send Interview'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendInterviewModal;