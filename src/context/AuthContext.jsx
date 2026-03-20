import { createContext, useState, useEffect } from "react";

// ✅ DYNAMIC BASE URL
export const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000"
    : "https://amazon-backend-production-219d.up.railway.app";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  // -------- LOAD USER SAFELY --------
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return null;

      const parsed = JSON.parse(savedUser);
      return parsed && typeof parsed === "object" ? parsed : null;

    } catch {
      return null;
    }
  });

  // -------- LOAD TOKEN SAFELY --------
  const [token, setToken] = useState(() => {
    try {
      const savedToken = localStorage.getItem("token");
      return savedToken || null;
    } catch {
      return null;
    }
  });

  // -------- SYNC USER --------
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch {}
  }, [user]);

  // -------- SYNC TOKEN --------
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    } catch {}
  }, [token]);

  // -------- LOGIN --------
  const login = (data) => {
    if (!data || !data.user) return;
    setUser(data.user);
    setToken(data.token || null);
  };

  // -------- LOGOUT --------
  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch {}
  };

  // -------- AUTH HEADERS --------
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        authHeaders,
        BASE_URL
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
