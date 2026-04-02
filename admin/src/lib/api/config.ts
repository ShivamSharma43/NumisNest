// API Configuration
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Default request headers
// BUG FIX: Send both Authorization AND token headers — backend adminAuth middleware accepts either
export const getHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['token'] = token; // backend middleware reads this directly
  }
  
  return headers;
};

// Helper to get auth token from storage
export const getAuthToken = (): string | null => {
  // BUG FIX: read from sessionStorage (matches AuthContext which now uses sessionStorage)
  const authData = sessionStorage.getItem('numisnest-admin-session');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.token || null;
    } catch {
      return null;
    }
  }
  return null;
};
