import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { MessageSquare, Plus, Search, ChevronDown, CheckCircle2, AlertCircle, BookOpen, Eye, X, User, RefreshCw } from "lucide-react";
import { API_BASE, getToken, CATEGORIES, fmt } from "../utils/concernUtils";
import { ConcernStatusBadge, PriorityBadge } from '../common/Badge';
import RequestFeedbackModal from "../components/RequestFeedbackModal";
import ConcernDrawer from "../components/ConcernDrawer";

const Concerns = () => {
  const [concerns, setConcerns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [actioning, setActioning] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  const fetchConcerns = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/concerns/`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setConcerns(await res.json());
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/employees/`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (res.ok) {
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : data.results || []);
      }
    } catch (e) { console.error("Failed to load employees", e); }
  }, []);

  useEffect(() => { fetchConcerns(); fetchEmployees(); }, [fetchConcerns, fetchEmployees]);

  const stats = [
    { label: "Total", val: concerns.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Pending", val: concerns.filter(c => c.status === "open").length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "In Progress", val: concerns.filter(c => c.status === "in_progress").length, icon: RefreshCw, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
    { label: "Resolved", val: concerns.filter(c => c.status === "resolved").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  ];

  const filtered = concerns.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.employee_name?.toLowerCase().includes(q) || c.message?.toLowerCase().includes(q);
    const matchStatus = statusFilter ? c.status === statusFilter : true;
    const matchPriority = priorityFilter ? c.priority === priorityFilter : true;
    const matchCat = categoryFilter ? c.reason_category === categoryFilter : true;
    return matchSearch && matchStatus && matchPriority && matchCat;
  });

  const handleAction = async (id, action) => {
    setActioning(true);
    try {
      const res = await fetch(`${API_BASE}/concerns/${id}/${action}/`, {
        method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) fetchConcerns();
    } catch (e) { console.error(e); } finally { setActioning(false); setSelected(null); }
  };

  return (
    <Layout bgClass="bg-gray-50/50 dark:bg-slate-950">
      <div className="flex flex-col h-full overflow-y-auto lg:h-[calc(100vh-80px)] lg:overflow-hidden max-w-7xl mx-auto space-y-4 pb-20 lg:pb-0">
        
        {/* Updated Header: Inline items to prevent button stretch */}
        <div className="flex flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-500 shrink-0" />
              <span className="truncate">Employee Feedback</span>
            </h1>
            <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track employee feedback.</p>
          </div>
          <button onClick={() => setShowRequest(true)} className="shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all w-auto">
            <Plus size={16} /> <span className="hidden sm:inline">Request Feedback</span><span className="sm:hidden">Request</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          {stats.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg}`}><s.icon size={20} className={s.color} /></div>
              <div><p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{s.val}</p></div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 shrink-0">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search feedback..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-gray-200 transition-all" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
          </div>
          <div className="flex gap-2">
            {[
              { val: statusFilter, set: setStatusFilter, opts: [{ value: '', label: 'All Status' }, { value: 'open', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }] },
              { val: priorityFilter, set: setPriorityFilter, opts: [{ value: '', label: 'All Priority' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
              { val: categoryFilter, set: setCategoryFilter, opts: [{ value: '', label: 'All Categories' }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ value: k, label: v }))] },
            ].map((f, i) => (
              <div key={i} className="relative group">
                <select value={f.val} onChange={e => f.set(e.target.value)} className="appearance-none pl-3 pr-8 py-2 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  {f.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col min-h-[500px] lg:min-h-0 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400"><RefreshCw size={28} className="animate-spin mb-3 text-blue-500" /><p className="text-sm font-medium">Loading feedback...</p></div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-500"><div className="bg-red-50 dark:bg-red-500/10 px-4 py-3 rounded-xl flex items-center gap-2"><AlertCircle size={18} /> {error}</div></div>
          ) : filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400"><div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-full mb-3"><MessageSquare size={32} /></div><p className="font-medium text-gray-600 dark:text-gray-300">No feedback found</p><p className="text-xs mt-1">Adjust filters or search query.</p></div>
          ) : (
            <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-slate-900/50">
              <div className="min-w-[1000px] inline-block w-full align-middle">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Employee</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Category</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Message</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Priority</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Status</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Reply</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800">Date</th>
                      <th className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {filtered.map(concern => (
                      <tr key={concern.id} onClick={() => setSelected(concern)} className="group hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0"><User size={14} /></div><div><p className="text-sm font-bold text-gray-900 dark:text-white">{concern.employee_name}</p><p className="text-xs text-gray-500">{concern.is_anonymous ? 'Anonymous' : 'Known'}</p></div></div></td>
                        <td className="px-5 py-3.5"><span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300">{CATEGORIES[concern.reason_category] || concern.reason_category}</span></td>
                        <td className="px-5 py-3.5"><div className="max-w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">{concern.message}</div></td>
                        <td className="px-5 py-3.5"><PriorityBadge priority={concern.priority} /></td>
                        <td className="px-5 py-3.5"><ConcernStatusBadge status={concern.status} /></td>
                        <td className="px-5 py-3.5">
                          {concern.has_reply ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg"><CheckCircle2 size={11} /> Received</span> : <span className="text-xs text-gray-400 dark:text-gray-500 italic">Pending</span>}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{fmt(concern.created_at)}</td>
                        <td className="px-5 py-3.5 text-right"><button onClick={(e) => { e.stopPropagation(); setSelected(concern); }} className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"><Eye size={12} /> View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showRequest && <RequestFeedbackModal employees={employees} onClose={() => setShowRequest(false)} onSuccess={(newConcern) => setConcerns(p => [newConcern, ...p])} />}
      <ConcernDrawer concern={selected} onClose={() => setSelected(null)} onAction={handleAction} actioning={actioning} />
    </Layout>
  );
};

export default Concerns;