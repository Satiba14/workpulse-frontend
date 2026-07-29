import { Clock, Send, CheckCircle2 } from 'lucide-react';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const getToken = () => localStorage.getItem('access_token');

export const fmt = (iso) => iso
  ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

export const STATUS_META = {
  pending:   { label: 'Pending',   color: 'text-gray-500 bg-gray-100 border-gray-200',        icon: Clock        },
  sent:      { label: 'Sent',      color: 'text-amber-600 bg-amber-50 border-amber-200',       icon: Send         },
  submitted: { label: 'Submitted', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
};