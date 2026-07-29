// Get token from localStorage
export const getAccessToken = () =>
  localStorage.getItem('access_token');

export const getRefreshToken = () =>
  localStorage.getItem('refresh_token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Build query string from params object
export const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined);
  if (!filtered.length) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${v}`).join('&');
};