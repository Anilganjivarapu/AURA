import { createContext, useContext, useEffect, useState } from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

const storedToken = () => localStorage.getItem("aura_token");

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(storedToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSessionExpired = () => {
      localStorage.removeItem("aura_token");
      setToken(null);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("aura:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("aura:session-expired", handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem("aura_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const handleAuthSuccess = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem("aura_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const response = await authService.login(payload);
    handleAuthSuccess(response);
    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    handleAuthSuccess(response);
    return response;
  };

  const updateProfile = async (payload) => {
    const response = await authService.updateProfile(payload);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("aura_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
