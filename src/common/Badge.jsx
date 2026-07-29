import { STATUS_CONFIG } from '../constants/statusConfig';
import { STATUS_META, PRIORITY_META } from '../utils/concernUtils';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Clock, 
  Send, 
  CheckCircle2, 
  Flag, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-react';

// ─── GENERAL SYSTEM BADGES ────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['inactive'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 
                      rounded-full text-xs font-bold 
                      ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const colors = {
    'super-admin': 'bg-purple-100 text-purple-700',
    'admin':       'bg-blue-100 text-blue-700',
    'manager':     'bg-amber-100 text-amber-700',
    'user':        'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold 
                      ${colors[role] || colors['user']}`}>
      {role}
    </span>
  );
};

export const ActionBadge = ({ action }) => {
  const colors = {
    create: 'bg-green-100 text-green-700',
    update: 'bg-blue-100 text-blue-700',
    delete: 'bg-red-100 text-red-600',
    login:  'bg-cyan-100 text-cyan-700',
    logout: 'bg-gray-100 text-gray-600',
    status_change: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize 
                      ${colors[action] || 'bg-gray-100 text-gray-600'}`}>
      {action?.replace('_', ' ')}
    </span>
  );
};

// ─── EXIT INTERVIEW BADGES ──────────────────────────────────────────────────
const INTERVIEW_STATUS_META = {
  pending:   { label: 'Pending',   color: 'text-gray-500 bg-gray-100 border-gray-200',        icon: Clock        },
  sent:      { label: 'Sent',      color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: Send         },
  submitted: { label: 'Submitted', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
};

export const InterviewStatusBadge = ({ status }) => {
  const m = INTERVIEW_STATUS_META[status] ?? INTERVIEW_STATUS_META.pending;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${m.color}`}>
      <Icon size={11} />{m.label}
    </span>
  );
};

export const BoolAnswer = ({ value }) => {
  if (value === null || value === undefined)
    return <Minus size={14} className="text-gray-300" />;
  return value
    ? <ThumbsUp size={14} className="text-emerald-500" />
    : <ThumbsDown size={14} className="text-red-400" />;
};

// ─── CONCERN BADGES ────────────────────────────────────────────────────────
export const ConcernStatusBadge = ({ status }) => {
  const m = STATUS_META[status] ?? STATUS_META.open;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${m.color}`}>
      <Icon size={12} />{m.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const m = PRIORITY_META[priority] ?? PRIORITY_META.medium;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${m.color}`}>
      <Flag size={10} />{m.label}
    </span>
  );
};

// ─── BUFFER BADGES ─────────────────────────────────────────────────────────
export const BufferBadge = ({ bufPct, hireNeeded }) => {
  const pct = parseFloat(bufPct ?? "0");
  if (pct >= 10) {
    return (
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
        <CheckCircle size={12} /> OK
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
      <AlertTriangle size={12} /> +{hireNeeded}
    </span>
  );
};