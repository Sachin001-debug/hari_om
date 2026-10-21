'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, getMe, logoutAdmin } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Validate current session with backend on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await getMe();
      if (response?.admin) {
        setAdmin(response.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (email, password) => {
    const response = await loginAdmin({ email, password });
    if (response?.admin) {
      setAdmin(response.admin);
    }
    return response;
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Ignore failure to reach backend during logout
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  };

  const value = {
    admin,
    isAuthenticated: Boolean(admin),
    isLoading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

