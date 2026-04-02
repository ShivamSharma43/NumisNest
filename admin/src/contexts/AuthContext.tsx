import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '@/types/admin';
import { authApi } from '@/lib/api/auth';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// BUG FIX: Use sessionStorage instead of localStorage so session dies on browser close/refresh
const SESSION_KEY = 'numisnest-admin-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // sessionStorage clears on tab/browser close — must log in again on every new session
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      const { user: authUser, token } = response;

      if (authUser.role !== 'admin' && authUser.role !== 'super_admin') {
        return false;
      }

      setUser(authUser);
      // Store in sessionStorage — cleared automatically when tab/browser closes
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: authUser, token }));
      return true;
    } catch (error: any) {
      console.error('Login failed:', error?.message || error);
      throw error;
    }
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
