import { useState, useEffect, useCallback } from "react";
import { MessageSquare, X, User, Tag, Calendar, FileText, CheckCircle2, RefreshCw, Mic, FileUp, BookOpen } from "lucide-react";
import { API_BASE, getToken, fmt } from "../utils/concernUtils";
import { ConcernStatusBadge, PriorityBadge } from '../common/Badge';

const ConcernDrawer = ({ concern, onClose, onAction, actioning }) => {
  const [response, setResponse] = useState(null);
  const [loadingResp, setLoadingResp] = useState(false);

  const fetchResponse = useCallback(async () => {
    if (!concern?.has_response) return;
    setLoadingResp(true);
    try {
      const res = await fetch(`${API_BASE}/concerns/${concern.id}/response/`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) setResponse(await res.json());
    } catch {} 
    finally { setLoadingResp(false); }
  }, [concern]);

  useEffect(() => { setResponse(null); fetchResponse(); }, [fetchResponse]);

  if (!concern) return null;

  const actionBtn = () => {
    if (concern.status === "in_review") return { label: "Mark as Read", action: "read", color: "bg-violet-600 hover:bg-violet-700", icon: BookOpen };
    if (concern.status === "read") return { label: "Mark as Resolved", action: "resolve", color: "bg-emerald-600 hover:bg-emerald-700", icon: CheckCircle2 };
    return null;
  };
  const btn = actionBtn();

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-xl p-2"><MessageSquare size={15} className="text-white" /></div>
            <div>
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">Feedback Request Detail</h2>
              <p className="text-xs text-gray-400 font-mono">{String(concern.id).slice(0, 8)}…</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><X size={18} /></button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><User size={18} className="text-blue-600" /></div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{concern.employee_name}</p>
                <p className="text-xs text-gray-400 font-mono">ID: {concern.employee_emp_id}</p>
              </div>
            </div>
            {/* FIXED TAG HERE: Changed from StatusBadge to ConcernStatusBadge */}
            <div className="flex flex-col items-end gap-2">
              <ConcernStatusBadge status={concern.status} />
              <PriorityBadge priority={concern.priority} />
            </div>
          </div>

          {/* Info Grid Cards */}
          <div className="grid grid-cols-2 gap-3">
            {[ 
              { icon: Tag, label: "Category", value: concern.reason_category }, 
              { icon: Calendar, label: "Requested", value: fmt(concern.created_at) }, 
              { icon: User, label: "Requested by", value: concern.created_by_email ?? "—" }, 
              { icon: User, label: "Reviewed by", value: concern.reviewed_by_email ?? "Not yet" } 
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 border border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-1"><Icon size={12} className="text-gray-400" /><span className="text-xs text-gray-400 font-medium">{label}</span></div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate capitalize">{value}</p>
              </div>
            ))}
          </div>

          {/* Request Message */}
          <div>
            <div className="flex items-center gap-1.5 mb-2"><FileText size={13} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Feedback Request Message</span></div>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{concern.message}</p>
            </div>
          </div>

          {/* Share Token Link */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Employee Response Link</p>
            <p className="text-xs text-blue-500 font-mono break-all">{window.location.origin}/respond/{concern.unique_token}/</p>
          </div>

          {/* Employee Response Box */}
          <div>
            <div className="flex items-center gap-1.5 mb-2"><MessageSquare size={13} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Employee Response {concern.has_response ? "(Received)" : "(Pending)"}</span></div>
            {loadingResp ? (
              <div className="flex items-center gap-2 py-4"><RefreshCw size={14} className="animate-spin text-blue-500" /><span className="text-sm text-gray-400">Loading response…</span></div>
            ) : response ? (
              <div className="space-y-3">
                {response.response_text && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{response.response_text}</p>
                    <p className="text-xs text-gray-400 mt-2">{fmt(response.responded_at)}</p>
                  </div>
                )}
                {response.audio_file_path && (
                  <a href={`${API_BASE.replace('/api/v1', '')}/media/${response.audio_file_path}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all">
                    <Mic size={14} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Audio Response</span>
                  </a>
                )}
                {response.document_file_path && (
                  <a href={`${API_BASE.replace('/api/v1', '')}/media/${response.document_file_path}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all">
                    <FileUp size={14} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Document Attachment</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 text-center border border-gray-200 dark:border-slate-800">
                <p className="text-sm text-gray-400 italic">Awaiting employee response…</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Footer */}
        {btn && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800">
            <button onClick={() => onAction(concern, btn.action)} disabled={actioning} className={`w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-2.5 rounded-xl disabled:opacity-50 transition-colors ${btn.color}`}>
              {actioning ? <RefreshCw size={14} className="animate-spin" /> : <btn.icon size={14} />} {actioning ? "Updating…" : btn.label}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ConcernDrawer;