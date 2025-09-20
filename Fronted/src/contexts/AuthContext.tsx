import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, ApiError } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  organizationId: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    role?: string;
    name: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      apiClient.setToken(storedToken);
      // Set user data for development
      setUser({
        id: '68cea79a37fb4cf22fefbedb',
        email: 'test@example.com',
        role: 'invoicing_user',
        name: 'Test User',
        organizationId: '68ce8a3cc61c753c8a03080d',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    } else {
      // Development mode: Auto-login with test user
      const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2VhNzlhMzdmYjRjZjIyZmVmYmVkYiIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJpbnZvaWNpbmdfdXNlciIsIm9yZ2FuaXphdGlvbklkIjoiNjhjZThhM2NjNjFjNzUzYzhhMDMwODBkIiwiaWF0IjoxNzU4MzczNzg2LCJleHAiOjE3NTg0NjAxODZ9.P-OvZ1vaZtaed6hgAp8YzxwEJPJiwPkqj51gKtDKsoE';
      setToken(testToken);
      apiClient.setToken(testToken);
      setUser({
        id: '68cea79a37fb4cf22fefbedb',
        email: 'test@example.com',
        role: 'invoicing_user',
        name: 'Test User',
        organizationId: '68ce8a3cc61c753c8a03080d',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.login(email, password);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        setUser(userData);
        setToken(authToken);
        apiClient.setToken(authToken);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    role?: string;
    name: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      
      if (response.success) {
        const { user: newUser, token: authToken } = response.data;
        setUser(newUser);
        setToken(authToken);
        apiClient.setToken(authToken);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
