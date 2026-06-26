"use client";
import { createContext, useContext, useState } from "react";
import { mockLeadQueries } from "@/lib/mock-data/mock-lead-queries";
import type { LeadQuery } from "@/lib/schema/lead-schema";

type LeadsContextType = {
  guestQueries: LeadQuery[];
  setGuestQueries: React.Dispatch<React.SetStateAction<LeadQuery[]>>;
};

const LeadsContext = createContext<LeadsContextType | null>(null);

export function LeadsProvider({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const [guestQueries, setGuestQueries] = useState<LeadQuery[]>(
    role === "guest" ? mockLeadQueries : [],
  );

  return (
    <LeadsContext.Provider value={{ guestQueries, setGuestQueries }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}
