'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  accountId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, accountId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aws_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('aws_user');
      }
    } else {
      // Default initial mock logged-in user
      const defaultUser = {
        username: 'Admin',
        email: 'admin@company.com',
        accountId: '5829-1029-4412',
        role: 'AdministratorAccess',
      };
      setUser(defaultUser);
      localStorage.setItem('aws_user', JSON.stringify(defaultUser));
    }
  }, []);

  const login = (username: string, accountId: string = '5829-1029-4412') => {
    const newUser = {
      username: username || 'Admin',
      email: `${username.toLowerCase() || 'admin'}@company.com`,
      accountId,
      role: 'AdministratorAccess',
    };
    setUser(newUser);
    localStorage.setItem('aws_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aws_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);