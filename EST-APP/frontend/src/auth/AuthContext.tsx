import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { UserRole } from "../api/auth";
import * as AuthApi from "../api/auth";

type AuthUser = { id: string; name: string; email: string; role: UserRole };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const LS_TOKEN = "cam_token";
const LS_USER = "cam_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(LS_TOKEN, token);
    else localStorage.removeItem(LS_TOKEN);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);

  async function login(email: string, password: string) {
    const res = await AuthApi.login(email, password);
    setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo<AuthState>(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}