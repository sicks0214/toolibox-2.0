'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  login as loginApi,
  register as registerApi,
  getProfile,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getStoredUser,
  removeUser,
  LoginData,
  RegisterData,
} from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        // Verify token is still valid
        try {
          const response = await getProfile(storedToken);
          if (response.success) {
            setUser(response.data.user);
            saveUser(response.data.user);
          } else {
            // Token invalid, clear auth
            removeToken();
            removeUser();
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          // Token invalid or network error
          removeToken();
          removeUser();
          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await loginApi(data);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        saveToken(token);
        saveUser(user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await registerApi(data);

      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        saveToken(token);
        saveUser(user);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeToken();
    removeUser();
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await getProfile(token);
      if (response.success) {
        setUser(response.data.user);
        saveUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
