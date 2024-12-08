import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwt_token');
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('email');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);