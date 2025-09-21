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
        id: '68ce8a3cc61c753c8a030822',
        email: 'admin@invoicing.com',
        role: 'admin',
        name: 'Admin User',
        organizationId: '68ce8a3cc61c753c8a03080d',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    } else {
      // Development mode: Auto-login with admin user
      const performAutoLogin = async () => {
        try {
          const response = await apiClient.login('admin@invoicing.com', 'admin123');
          if (response.success) {
            const { user: userData, token: authToken } = response.data;
            setUser(userData);
            setToken(authToken);
            apiClient.setToken(authToken);
            localStorage.setItem('auth_token', authToken);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        } finally {
          setLoading(false);
        }
      };
      
      performAutoLogin();
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
