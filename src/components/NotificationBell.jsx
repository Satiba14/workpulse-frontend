import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem('access_token');

const fmt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)  return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const TYPE_META = {
  concern_response:  { color: 'bg-emerald-500', dot: 'bg-emerald-400' },
  exit_submitted:    { color: 'bg-blue-500',    dot: 'bg-blue-400'    },
  concern_created:   { color: 'bg-violet-500',  dot: 'bg-violet-400'  },
  employee_inactive: { color: 'bg-red-500',     dot: 'bg-red-400'     },
};

const NotificationBell = () => {
  const [open, setOpen]         = useState(false);
  const [notifs, setNotifs]     = useState([]);
  const [unread, setUnread]     = useState(0);
  const [loading, setLoading]   = useState(false);
  const ref                     = useRef(null);
  const navigate                = useNavigate();

  // ── Fetch unread count (polls every 30s) ─────────────────────────────────
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUnread(data.count);
      }
    } catch {}
  }, []);

  // ── Fetch full list when bell is opened ───────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setNotifs(await res.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    if (open) fetchNotifs();
  }, [open, fetchNotifs]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Mark single as read ───────────────────────────────────────────────────
  const markOne = async (id) => {
    await fetch(`${API_BASE}/notifications/mark-read/${id}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAll = async () => {
    await fetch(`${API_BASE}/notifications/mark-read/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnread(0);
  };

  // ── Handle click on notification ──────────────────────────────────────────
  const handleClick = async (notif) => {
    if (!notif.is_read) await markOne(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">Notifications</span>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAll}
                  title="Mark all as read"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <CheckCheck size={13} /> All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-400">Loading…</div>
            ) : notifs.length === 0 ? (
              <div className="py-10 flex flex-col items-center gap-2 text-center">
                <Bell size={28} className="text-gray-200 dark:text-slate-700" />
                <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
              </div>
            ) : (
              notifs.map(notif => {
                const meta = TYPE_META[notif.type] ?? { dot: 'bg-gray-400' };
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${
                      !notif.is_read ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    {/* Dot */}
                    <div className="flex-shrink-0 mt-1.5">
                      <span className={`w-2 h-2 rounded-full block ${!notif.is_read ? meta.dot : 'bg-gray-200 dark:bg-slate-700'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-tight ${!notif.is_read ? 'font-bold text-gray-800 dark:text-gray-100' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                        {fmt(notif.created_at)}
                      </p>
                    </div>

                    {/* Link icon */}
                    {notif.link && (
                      <ExternalLink size={12} className="text-gray-300 dark:text-slate-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-slate-800 text-center">
              <p className="text-xs text-gray-400">Showing last {notifs.length} notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;