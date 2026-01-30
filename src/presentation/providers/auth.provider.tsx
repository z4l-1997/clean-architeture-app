"use client";

import { createContext, useContext, useMemo } from "react";
import { authContainer } from "@/di/container";
import type { AuthContainer } from "@/di/auth.container";

type AuthContextType = {
  login: AuthContainer["executeLogin"];
  refresh: AuthContainer["executeRefresh"];
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<AuthContextType>(
    () => ({
      login: authContainer.executeLogin,
      refresh: authContainer.executeRefresh,
    }),
    [],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
