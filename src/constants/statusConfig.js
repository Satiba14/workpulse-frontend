// Employee active/inactive status colors
export const STATUS_CONFIG = {
  billable: {
    label: 'Billable',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  non_billable: {
    label: 'Non-Billable',
    bg: 'bg-lime-100',
    text: 'text-lime-700',
    dot: 'bg-lime-500',
  },
  buffer: {
    label: 'Buffer',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-400',
  },
  inactive: {
    label: 'Inactive',
    bg: 'bg-red-100',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
};

// Role badge colors
export const ROLE_COLORS = {
  'super-admin': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'admin':       { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  'manager':     { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  'user':        { bg: 'bg-gray-100',   text: 'text-gray-600'   },
};

// Audit log action colors
export const ACTION_COLORS = {
  create: { bg: 'bg-green-100', text: 'text-green-700' },
  update: { bg: 'bg-blue-100',  text: 'text-blue-700'  },
  delete: { bg: 'bg-red-100',   text: 'text-red-600'   },
  login:  { bg: 'bg-cyan-100',  text: 'text-cyan-700'  },
  logout: { bg: 'bg-gray-100',  text: 'text-gray-600'  },
  status_change:       { bg: 'bg-amber-100',  text: 'text-amber-700'  },
  exit_interview_sent: { bg: 'bg-violet-100', text: 'text-violet-700' },
};

// Dashboard stat cards config
export const DASHBOARD_STATS_CONFIG = [
  {
    key: 'total_employees',
    label: 'Total Employees',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    iconName: 'Users',
  },
  {
    key: 'active',
    label: 'Active Employees',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    iconName: 'UserCheck',
  },
  {
    key: 'inactive',
    label: 'Inactive',
    bg: 'bg-red-50',
    text: 'text-red-500',
    iconName: 'UserX',
  },
  {
    key: 'total_attrition',
    label: 'Total Attrition',
    bg: 'bg-rose-50',
    text: 'text-rose-500',
    iconName: 'TrendingDown',
  },
  {
    key: 'open_concerns',
    label: 'Open Concerns',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    iconName: 'MessageSquare',
  },
  {
    key: 'attrition_rate',
    label: 'Attrition Rate',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    iconName: 'Percent',
    suffix: '%',
  },
];