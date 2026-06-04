"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeadQueryCard from "./LeadQueryCard";
import { mockLeadQueries } from "./mockLeadQueries";

const EmptyState = () => (
  <div className="text-center">
    <h3 className="md:text-lg font-medium text-foreground/70 py-4">
      No lead queries
    </h3>
    <p className="text-xs md:text-sm text-foreground/70">
      Start by creating a new lead query
    </p>
  </div>
);

export default function LeadsQueries() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between lg:px-6">
        <h2 className="font-medium text-base sm:text-lg">Leads Queries</h2>
        {mockLeadQueries.length > 0 && (
          <p className="text-xs sm:text-sm text-foreground/50">
            {mockLeadQueries.length}{" "}
            {mockLeadQueries.length === 1 ? "query" : "queries"}
          </p>
        )}
      </div>

      {/* "flex-1 min-h-0" allows this element to shrink within its flex/grid parent and enable overflow scrolling */}
      <ScrollArea className="flex-1 min-h-0 w-full flex flex-col gap-y-4 py-6">
        <div className="flex flex-col gap-y-3 lg:px-6">
          {mockLeadQueries.length === 0 ? (
            <EmptyState />
          ) : (
            mockLeadQueries.map((query) => (
              <LeadQueryCard key={query.id} leadQuery={query} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
