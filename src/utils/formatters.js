// Format date → "Jan 01, 2024"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

// Format datetime → "01 Jan 2024, 10:30 AM"
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get initials from name → "John Doe" → "JD"
export const getInitials = (firstName, lastName) => {
  const f = firstName?.charAt(0) || '';
  const l = lastName?.charAt(0) || '';
  return (f + l).toUpperCase();
};

// Format full name
export const getFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '—';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Truncate long text
export const truncate = (str, length = 50) => {
  if (!str) return '—';
  return str.length > length ? str.substring(0, length) + '...' : str;
};