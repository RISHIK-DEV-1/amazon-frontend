import { createContext, useState, useEffect } from "react";

export const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://amazon-backend-production-219d.up.railway.app";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const authHeaders = () => {
    const freshToken = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(freshToken ? { Authorization: `Bearer ${freshToken}` } : {}),
    };
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, authHeaders, BASE_URL, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
