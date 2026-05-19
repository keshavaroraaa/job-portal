import { createContext, useState, useEffect, useCallback } from 'react';
import { loginAPI, registerAPI, getMeAPI } from '../api/auth';
import { message } from 'antd';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getMeAPI();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await loginAPI(credentials);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    message.success('Login successful!');
    return data.data.user;
  };

  const register = async (userData) => {
    const { data } = await registerAPI(userData);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
    message.success('Registration successful!');
    return data.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    message.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
