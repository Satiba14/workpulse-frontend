import { useState, useEffect, useCallback, Fragment } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../common/LoadingSpinner";
import { ClipboardList, Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import axios from "../api/axios";

const ACTION_CONFIG = {
  create: { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  update: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  delete: { bg: "bg-red-50",    text: "text-red-600",    dot: "bg-red-500"    },
  login:  { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  logout: { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400"   },
};

function ActionBadge({ action }) {
  const key = action?.toLowerCase();
  const c = ACTION_CONFIG[key] ?? ACTION_CONFIG.update;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {key}
    </span>
  );
}

const ACTIONS = ["ALL", "create", "update", "delete", "login", "logout"];

export default function AuditLog() {
  const [logs,         setLogs]     = useState([]);
  const [loading,      setLoading]  = useState(true);
  const [error,        setError]    = useState(null);
  const [search,       setSearch]   = useState("");
  const [actionFilter, setAction]   = useState("ALL");
  const [expandedRow,  setExpanded] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (actionFilter !== "ALL") params.action = actionFilter;
      const res = await axios.get("/audit-logs/", { params });
      setLogs(res.data?.results ?? res.data ?? []);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(log => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.user_email?.toLowerCase().includes(q)  ||
      log.model_name?.toLowerCase().includes(q)  ||
      log.description?.toLowerCase().includes(q) ||
      log.ip_address?.toLowerCase().includes(q)  ||
      log.object_id?.toLowerCase().includes(q)
    );
  });

  const fmt = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: true,
    });
  };

  return (
    <Layout bgClass="bg-sky-50/20 dark:bg-slate-950">
      <div className="flex flex-col gap-5 h-full">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-sky-50 dark:bg-slate-800 rounded-xl p-2.5">
              <ClipboardList size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Audit Log</h1>
              <p className="text-xs text-gray-400">
                {loading ? "Loading…" : `${filtered.length} records`}
              </p>
            </div>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-3 flex-shrink-0">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, model, description, IP…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-slate-700 dark:bg-slate-800/50 dark:text-gray-100 rounded-xl focus:outline-none focus:border-sky-400 font-medium"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ACTIONS.map(a => {
              const active = actionFilter === a;
              const c = a !== "ALL" ? ACTION_CONFIG[a] : null;
              return (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    active
                      ? a === "ALL"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : `${c.bg} ${c.text} border-transparent shadow-sm`
                      : "bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-gray-300"
                  }`}
                >
                  {a.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex-shrink-0 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* ── Table card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden flex-1 min-h-0">
          {loading ? (
            <div className="py-20"><LoadingSpinner color="sky" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-2">
              <ClipboardList size={40} className="text-gray-200 dark:text-slate-700" />
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No audit logs found</p>
              <p className="text-xs text-gray-400">Try changing the filter or search query</p>
            </div>
          ) : (
            <>
              {/* Sticky thead */}
              <div className="flex-shrink-0 overflow-x-auto border-b border-gray-100 dark:border-slate-800">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                      {["Timestamp","User","Action","Model","Description","IP Address"].map((h, i) => (
                        <th key={i} className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Scrollable tbody */}
              <div className="overflow-y-auto overflow-x-auto flex-1">
                <table className="w-full">
                  <tbody>
                    {filtered.map((log, idx) => {
                      const rowId = log.id ?? idx;
                      const isExpanded = expandedRow === rowId;
                      const hasDetail = !!(log.old_value || log.new_value);
                      return (
                        // ← Fragment with key prop fixes the React console warning
                        <Fragment key={rowId}>
                          <tr
                            onClick={() => hasDetail && setExpanded(isExpanded ? null : rowId)}
                            className={`border-b border-gray-50 dark:border-slate-800/50 transition-colors ${
                              hasDetail ? "cursor-pointer" : ""
                            } ${
                              isExpanded
                                ? "bg-sky-50/40 dark:bg-slate-800/60"
                                : "hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            {/* Timestamp */}
                            <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {fmt(log.timestamp)}
                            </td>

                            {/* User */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {log.user_email?.[0]?.toUpperCase() ?? "?"}
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[160px]">
                                  {log.user_email ?? <span className="text-gray-400 italic font-normal">anonymous</span>}
                                </span>
                              </div>
                            </td>

                            {/* Action */}
                            <td className="px-4 py-4">
                              <ActionBadge action={log.action} />
                            </td>

                            {/* Model */}
                            <td className="px-4 py-4">
                              {log.model_name ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                                  {log.model_name}
                                  {log.object_id && (
                                    <span className="text-gray-400 dark:text-gray-500 font-normal">
                                      #{log.object_id.slice(0, 8)}
                                    </span>
                                  )}
                                </span>
                              ) : <span className="text-gray-300 dark:text-slate-600">—</span>}
                            </td>

                            {/* Description */}
                            <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                              {log.description || <span className="text-gray-300 dark:text-slate-600">—</span>}
                            </td>

                            {/* IP + chevron */}
                            <td className="px-4 py-4 text-xs font-mono text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              <div className="flex items-center justify-between gap-2">
                                <span>{log.ip_address || "—"}</span>
                                {hasDetail && (
                                  isExpanded
                                    ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                                    : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded detail row */}
                          {isExpanded && hasDetail && (
                            <tr className="bg-sky-50/30 dark:bg-slate-800/30 border-b border-gray-50 dark:border-slate-800/50">
                              <td colSpan={6} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  {log.old_value && (
                                    <div>
                                      <p className="text-gray-400 uppercase tracking-wider font-bold mb-1.5 text-[10px]">Before</p>
                                      <pre className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-gray-600 dark:text-gray-300 overflow-x-auto max-h-36 text-[11px] leading-relaxed">
                                        {typeof log.old_value === "string" ? log.old_value : JSON.stringify(log.old_value, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.new_value && (
                                    <div>
                                      <p className="text-gray-400 uppercase tracking-wider font-bold mb-1.5 text-[10px]">After</p>
                                      <pre className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800 rounded-xl p-3 text-gray-600 dark:text-gray-300 overflow-x-auto max-h-36 text-[11px] leading-relaxed">
                                        {typeof log.new_value === "string" ? log.new_value : JSON.stringify(log.new_value, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-gray-100 dark:border-slate-800 px-4 py-3 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing <span className="font-bold text-gray-600 dark:text-gray-300">{filtered.length}</span> entries
                  {search && ` for "${search}"`}
                </p>
                <p className="text-xs text-gray-400">Click rows with before/after changes to expand</p>
              </div>
            </>
          )}
        </div>

      </div>
    </Layout>
  );
}