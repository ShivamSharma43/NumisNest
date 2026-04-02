import { API_BASE_URL, getHeaders, getAuthToken } from './config';
import type { AdminUser } from '@/types/admin';

export interface LoginCredentials {
  email: string;
  password: string;
}

// BUG FIX: Backend returns flat {user, token} — NOT wrapped in ApiResponse
export interface LoginResponse {
  user: AdminUser;
  token: string;
}

export const authApi = {
  // Login — backend returns {user, token} directly
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw { message: err.message || 'Login failed', status: response.status };
    }
    return response.json();
  },

  // Logout — no backend endpoint, just clear locally
  logout: async (): Promise<void> => {
    return Promise.resolve();
  },

  // Get current user via /auth/verify
  getCurrentUser: async (): Promise<{ valid: boolean; user: AdminUser }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: getHeaders(token || undefined),
    });
    if (!response.ok) throw { message: 'Unauthorized', status: response.status };
    return response.json();
  },

  // Change password via /auth/change-password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw { message: err.message || 'Failed to change password', status: response.status };
    }
    return response.json();
  },
};
