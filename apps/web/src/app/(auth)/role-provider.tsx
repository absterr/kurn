"use client";
import { createContext, useContext, useState } from "react";

type Role = "member" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("member");
  const value: RoleContextType = { role, setRole };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);

  if (!ctx) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return ctx;
}
