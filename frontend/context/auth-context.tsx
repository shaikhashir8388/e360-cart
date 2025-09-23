'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { apiService, RegisterData, LoginData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (userData: { username?: string; phone?: string; profileImage?: File }) => Promise<boolean>;
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<boolean>;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, isUserLoaded] = useLocalStorage<User | null>('user', null);
  const [token, setToken, isTokenLoaded] = useLocalStorage<string | null>('token', null);
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from token on app start
  useEffect(() => {
    const initializeAuth = async () => {
      if (isUserLoaded && isTokenLoaded) {
        if (token && !user) {
          try {
            const response = await apiService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data.user);
            }
          } catch (error) {
            // Token might be expired, clear it
            setToken(null);
            setRefreshToken(null);
            setUser(null);
          }
        }
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isUserLoaded, isTokenLoaded, token, user, setToken, setRefreshToken, setUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        toast.success('Login successful!');
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.loginAdmin({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        toast.success('Admin login successful!');
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      toast.error(error.message || 'Admin login failed');
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully');
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        
        toast.success('Registration successful!');
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const updateProfile = async (userData: { username?: string; phone?: string; profileImage?: File }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.updateProfile(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      toast.error(error.message || 'Profile update failed');
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.changePassword(passwordData);
      
      if (response.success) {
        toast.success('Password changed successfully!');
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      toast.error(error.message || 'Password change failed');
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginAdmin, 
      logout, 
      register, 
      updateProfile, 
      changePassword, 
      isLoading, 
      token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}