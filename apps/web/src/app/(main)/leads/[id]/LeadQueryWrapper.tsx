"use client";
import { MousePointer2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LeadQuery } from "../mockLeadQueries";
import LeadDetails from "./LeadDetails";
import LeadHeader from "./LeadHeader";
import LeadItem from "./LeadItem";
import LeadQueryDetails from "./LeadQueryDetails";
import type { Lead } from "./mockLeads";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center w-full h-3/4 gap-3 text-center px-6">
    <div className="size-8 rounded-full bg-muted flex items-center justify-center">
      <MousePointer2 className="size-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium">No lead selected</p>
      <p className="text-xs text-muted-foreground pt-1">
        Click on a lead name on the left to view its details
      </p>
    </div>
  </div>
);

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
                onClickAction={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 hidden xl:flex min-h-0">
        {selectedLead === null ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col w-full">
            <LeadHeader
              lead={selectedLead}
              onCloseAction={() => setSelectedLead(null)}
            />
            <ScrollArea className="min-h-0">
              <LeadDetails lead={selectedLead} />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
