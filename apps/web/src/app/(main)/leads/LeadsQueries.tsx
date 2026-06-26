"use client";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLeadQueriesHandler } from "@/lib/queries/lead-queries";
import type { LeadQuery } from "@/lib/schema/lead-schema";
import { cn, formatDate } from "@/lib/utils";

export default function LeadsQueries({ role }: { role: string }) {
  const { data: leadQueries = [] } = useQuery({
    queryKey: ["leadQueries"],
    queryFn: getLeadQueriesHandler,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: role === "member",
  });

  // min-h-0: constrains grid child so descendants with h-full have a real boundary
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between lg:px-6">
        <h2 className="font-medium text-base sm:text-lg">Leads Queries</h2>
        {leadQueries.length > 0 && (
          <p className="text-xs sm:text-sm text-foreground/50">
            {leadQueries.length}{" "}
            {leadQueries.length === 1 ? "query" : "queries"}
          </p>
        )}
      </div>

      {/* "min-h-0" allows this element to shrink within its flex/grid parent and enable overflow scrolling */}
      <ScrollArea className="min-h-0 w-full py-6">
        <div className="flex flex-col gap-y-4 lg:px-6">
          {leadQueries.length === 0 ? (
            <EmptyState />
          ) : (
            leadQueries.map((query) => (
              <LeadQueryCard key={query.id} leadQuery={query} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

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

const LeadQueryCard = ({ leadQuery }: { leadQuery: LeadQuery }) => (
  <Link href={`/leads/${leadQuery.id}`} className="group">
    <div className="border border-foreground/10 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground/90 underline xl:no-underline xl:group-hover:underline">
            {leadQuery.keyword}
          </p>
          <p className="pt-1 flex items-center gap-1 text-xs text-foreground/50">
            <MapPin className="w-4" />
            {leadQuery.location}
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-foreground/80 font-medium">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full bg-foreground/80",
              ["pending", "processing"].includes(leadQuery.status) &&
                "animate-pulse",
            )}
          />
          {leadQuery.status}
        </span>
      </div>

      <div className="my-3 border-t border-foreground/10" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-foreground/50">
        <span className="font-medium text-foreground/70">
          {leadQuery.resultsCount}{" "}
          <span className="font-normal text-foreground/50">
            {leadQuery.resultsCount === 1 ? "result" : "results"}
          </span>
        </span>

        <span>Created: {formatDate(leadQuery.createdAt)}</span>
        <span>Last updated: {formatDate(leadQuery.updatedAt)}</span>
      </div>
    </div>
  </Link>
);
