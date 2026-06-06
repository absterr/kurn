"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LeadQuery } from "../mockLeadQueries";
import LeadItem from "./LeadItem";
import LeadQueryDetails from "./LeadQueryDetails";
import type { Lead } from "./mockLeads";

export default function LeadQueryWrapper({
  leadQuery,
  leads,
}: {
  leadQuery: LeadQuery;
  leads: Lead[];
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // "flex-col" and "min-h-0" lets ScrollArea stretch as needed for the content
  // ScrollArea needs a child div with "flex" to define the content width bounds
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 min-h-0">
      <div className="flex flex-col min-h-0 pt-4">
        <LeadQueryDetails leadQuery={leadQuery} />
        <ScrollArea className="min-h-0 w-full">
          <div className="flex flex-col lg:pr-6">
            {leads.map((lead) => (
              <LeadItem
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-2 hidden xl:flex rounded-md">{/* Lead details */}</div>
    </div>
  );
}
