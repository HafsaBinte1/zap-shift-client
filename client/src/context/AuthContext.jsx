import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rehydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await authApi.getMe();
        setUser(me);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    rehydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (credentials) => {
    const { token: newToken, user: loggedInUser } = await authApi.login(credentials);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (payload) => {
    const { token: newToken, user: newUser } = await authApi.signup(payload);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const { user: updated } = await authApi.updateMe(payload);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
