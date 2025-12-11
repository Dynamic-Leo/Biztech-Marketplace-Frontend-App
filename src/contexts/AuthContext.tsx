import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserData: (user: User, token: string) => void; // New helper for manual updates
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize State from LocalStorage
  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('biztech_user');
      const token = localStorage.getItem('biztech_token');
      
      if (storedUser && token) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.removeItem('biztech_user');
          localStorage.removeItem('biztech_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // Login Action
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      setUserData(response.user, response.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Manual State Setter (Used by Register Page after OTP)
  const setUserData = (userData: User, token: string) => {
    localStorage.setItem('biztech_token', token);
    localStorage.setItem('biztech_user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout Action
  const logout = () => {
    authAPI.logout(); 
    localStorage.removeItem('biztech_token');
    localStorage.removeItem('biztech_user');
    setUser(null);
    window.location.href = '/signin';
  };

  const value = {
    user,
    login,
    logout,
    setUserData,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};