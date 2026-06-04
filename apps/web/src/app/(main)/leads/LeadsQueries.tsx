"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeadQueryCard from "./LeadQueryCard";
import { mockLeadQueries } from "./mockLeadQueries";

export default function LeadsQueries() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between lg:px-6">
        <h2 className="font-medium text-base sm:text-lg">Leads Queries</h2>
        <p className="text-xs sm:text-sm text-foreground/50">
          {mockLeadQueries.length} results
        </p>
      </div>

      {/* "flex-1 min-h-0" allows this element to shrink within its flex/grid parent and enable overflow scrolling */}
      <ScrollArea className="flex-1 min-h-0 w-full flex flex-col gap-y-4 py-6">
        <div className="flex flex-col gap-y-3 lg:px-6">
          {mockLeadQueries.map((query) => (
            <LeadQueryCard key={query.id} leadQuery={query} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
