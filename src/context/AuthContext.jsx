import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  // ✅ Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('habitTrackerToken');
    const savedUser = localStorage.getItem('habitTrackerUser');
    const savedTheme = localStorage.getItem('habitTrackerTheme') || 'dark';

    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (username, password) => {
    const { data } = await authAPI.login({ username, password });

    localStorage.setItem('habitTrackerToken', data.token || "dummy-token");
    localStorage.setItem('habitTrackerUser', JSON.stringify(data.user || { username }));

    setUser(data.user || { username });

    return data;
  };

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('habitTrackerToken')) {
        await authAPI.logout();
      }
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('habitTrackerToken');
      localStorage.removeItem('habitTrackerUser');
      setUser(null);
    }
  }, []);

  // ✅ UPDATE USER
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('habitTrackerUser', JSON.stringify(updatedUser));
  };

  // ✅ THEME TOGGLE
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('habitTrackerTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        theme,
        toggleTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;