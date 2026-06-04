"use client";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadQuery } from "./mockLeadQueries";

const LeadQueryCard = ({ leadQuery }: { leadQuery: LeadQuery }) => (
  <div className="rounded-lg border border-foreground/5 bg-background p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground/90">
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
            leadQuery.status === "pending" && "animate-pulse",
            leadQuery.status === "processing" && "animate-pulse",
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

      <span>
        Created:{" "}
        {new Date(leadQuery.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
      <span>
        Last updated:{" "}
        {new Date(leadQuery.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    </div>
  </div>
);

export default LeadQueryCard;
