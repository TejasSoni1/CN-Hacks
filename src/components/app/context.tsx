"use client";

import { createContext, useContext } from "react";
import type { ChimpManager } from "./useChimpManager";

export const CMContext = createContext<ChimpManager | null>(null);

export function useCM(): ChimpManager {
  const ctx = useContext(CMContext);
  if (!ctx) throw new Error("useCM must be used within <ChimpManagerApp>");
  return ctx;
}
