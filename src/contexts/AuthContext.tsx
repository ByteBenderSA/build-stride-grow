
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  progress: {
    totalProjects: number;
    completedSteps: number;
    currentStreak: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('buildflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      progress: {
        totalProjects: 0,
        completedSteps: 0,
        currentStreak: 0,
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('buildflow_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
      progress: {
        totalProjects: 0,
        completedSteps: 0,
        currentStreak: 0,
      }
    };
    
    setUser(mockUser);
    localStorage.setItem('buildflow_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('buildflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
