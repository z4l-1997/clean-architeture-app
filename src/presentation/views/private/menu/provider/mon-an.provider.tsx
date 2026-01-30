"use client";

import { createContext, useContext, useMemo } from "react";
import { monAnContainer } from "@/di/container";
import type { MonAnContainer } from "@/di/mon-an.container";

type MonAnContextType = {
  getAllMonAn: MonAnContainer["executeGetAllMonAn"];
};

const MonAnContext = createContext<MonAnContextType | null>(null);

export function MonAnProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<MonAnContextType>(
    () => ({
      getAllMonAn: monAnContainer.executeGetAllMonAn,
    }),
    [],
  );

  return <MonAnContext.Provider value={value}>{children}</MonAnContext.Provider>;
}

export function useMonAnContext() {
  const ctx = useContext(MonAnContext);
  if (!ctx) {
    throw new Error("useMonAnContext must be used within MonAnProvider");
  }
  return ctx;
}
