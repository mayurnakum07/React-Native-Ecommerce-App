import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateAvatar: (avatarUri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, message: '' }),
  logout: async () => {},
  updateProfile: async () => {},
  updateAvatar: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Simulate API call - in a real app, this would be an actual authentication API
      if (email && password) {
        const newUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email prefix as name initially
          email: email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        };
        
        setUser(newUser);
        await saveUserToStorage(newUser);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: 'Please enter both email and password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Clear all user-related data
      await AsyncStorage.multiRemove([
        'userData',
        'hasCompletedOnboarding',
        'cartItems',
        'userPreferences'
      ]);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const updateAvatar = async (avatarUri: string) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, avatar: avatarUri };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Avatar update error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateProfile,
    updateAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 