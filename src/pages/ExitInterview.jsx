import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { ClipboardList, Search, RefreshCw, Eye, Plus, Clock, Send, CheckCircle2, ChevronDown, X, User, AlertCircle } from 'lucide-react';
import { API_BASE, getToken, fmt } from '../utils/exitInterviewUtils';
import { InterviewStatusBadge } from '../common/Badge';
import SendInterviewModal from '../components/SendInterviewModal';
import InterviewDrawer from '../components/InterviewDrawer';

export default function ExitInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected]     = useState(null);
  const [resending, setResending]   = useState(false);
  const [showSend, setShowSend]     = useState(false);

  const fetchInterviews = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/exit-interviews/`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setInterviews(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const handleResend = async (interview) => {
    setResending(true);
    try {
      const res = await fetch(
        `${API_BASE}/employees/${interview.employee_id}/exit-interview/send/`,
        { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error('Failed to send');
      const updated = await res.json();
      setInterviews(prev => prev.map(i => i.id === updated.id ? updated : i));
      setSelected(updated);
    } catch (e) { alert(e.message); }
    finally { setResending(false); }
  };

  const filtered = interviews.filter(i => {
    const matchSearch = !search || i.employee_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  // LOGIC FIX: "Pending" now means any interview that has NOT been submitted yet
  const stats = {
    total:     interviews.length,
    sent:      interviews.filter(i => i.status?.toLowerCase() === 'sent').length,
    submitted: interviews.filter(i => i.status?.toLowerCase() === 'submitted').length,
  };

  return (
    <Layout bgClass="bg-sky-50/10 dark:bg-slate-950">
      <div className="space-y-5">
        
        {/* MOBILE FIX: Removed w-full and flex-1 so buttons don't stretch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-2.5 flex-shrink-0">
              <ClipboardList size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Exit Interviews</h1>
              <p className="text-xs text-gray-400">Manage and track employee exit interviews</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={fetchInterviews} className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-blue-300 transition-colors shadow-sm">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={() => setShowSend(true)} className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-colors">
              <Plus size={15} /> 
              <span className="hidden sm:inline">Send Interview</span>
              <span className="sm:hidden">Send</span>
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
  {[
    { label: 'Total',     value: stats.total,     accent: 'bg-blue-600',    Icon: ClipboardList },
    { label: 'Sent',      value: stats.sent,      accent: 'bg-amber-500',   Icon: Send          },
    { label: 'Submitted', value: stats.submitted, accent: 'bg-emerald-500', Icon: CheckCircle2  },
  ].map(({ label, value, accent, Icon }) => (
    <div key={label} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-3 sm:p-5 flex items-center gap-2 sm:gap-4 overflow-hidden shadow-sm">
      <div className={`rounded-xl p-2 sm:p-3 flex-shrink-0 ${accent}`}>
        <Icon size={18} className="text-white sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate" title={label}>
          {label}
        </p>
      </div>
    </div>
  ))}
</div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 px-5 py-4 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" placeholder="Search by employee name…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="submitted">Submitted</option>
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {filtered.length} interview{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw size={24} className="animate-spin text-blue-500" />
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertCircle size={32} className="text-red-400" />
              <p className="text-sm font-semibold text-red-500">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <ClipboardList size={36} className="text-gray-200 dark:text-slate-700" />
              <p className="text-sm text-gray-400 font-medium">
                No exit interviews found
              </p>
            </div>
          ) : (
            <div className="h-[220px] overflow-y-scroll overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-slate-800">
                  <tr>
                    {['Employee', 'Status', 'Sent On', 'Submitted On', 'Response', ''].map(h => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap border-b border-gray-200 dark:border-slate-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {filtered.map(interview => (
                    <tr
                      key={interview.id}
                      onClick={() => setSelected(interview)}
                      className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                            <User size={13} className="text-sky-600" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {interview.employee_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <InterviewStatusBadge status={interview.status} />
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                        {fmt(interview.sent_at)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                        {fmt(interview.submitted_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        {/* UI FIX: Explicitly label anything not submitted as "Pending Response" so it matches the card */}
                        {interview.status?.toLowerCase() === 'submitted' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 size={11} /> Received
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-amber-500 italic">
                            Pending Response
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelected(interview);
                          }}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all"
                        >
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InterviewDrawer interview={selected} onClose={() => setSelected(null)} onResend={handleResend} resending={resending} />

      {showSend && (
        <SendInterviewModal onClose={() => setShowSend(false)} onSuccess={(newInterview) => setInterviews(prev => [newInterview, ...prev])} />
      )}
    </Layout>
  );
}