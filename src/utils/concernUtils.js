import { AlertCircle, Mail, BookOpen, CheckCircle2 } from 'lucide-react';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const getToken = () => localStorage.getItem('access_token');

export const CATEGORIES = [
  'performance', 'welfare', 'exit', 'misconduct', 'attendance', 'other',
];

export const STATUS_META = {
  open:      { label: 'Open',      color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: AlertCircle  },
  in_review: { label: 'Responded', color: 'text-blue-600 bg-blue-50 border-blue-200',         icon: Mail         },
  read:      { label: 'Read',      color: 'text-violet-600 bg-violet-50 border-violet-200',   icon: BookOpen     },
  resolved:  { label: 'Resolved',  color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
};

export const PRIORITY_META = {
  low:    { label: 'Low',    color: 'text-slate-500 bg-slate-100 border-slate-200' },
  medium: { label: 'Medium', color: 'text-amber-600 bg-amber-50 border-amber-200'  },
  high:   { label: 'High',   color: 'text-red-600 bg-red-50 border-red-200'        },
};

export const fmt = (iso) => iso
  ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';