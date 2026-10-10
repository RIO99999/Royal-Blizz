import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rb_token') || '');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem('rb_token');
        setToken('');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();

  }, []);

  const setAuth = (newToken, newUser) => {
    localStorage.setItem('rb_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setAuth(res.data.token, res.data.user);
    return res.data.user;
  };

  
  const register = async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    setAuth(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('rb_token');
    setToken('');
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
