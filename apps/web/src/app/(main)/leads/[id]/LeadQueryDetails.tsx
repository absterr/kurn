import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeadQuery } from "../mockLeadQueries";

export default function LeadQueryDetails({
  leadQuery,
}: {
  leadQuery: LeadQuery;
}) {
  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-medium text-base sm:text-lg">
          {leadQuery.keyword}
        </h2>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-foreground/10 px-2 py-1 text-xs capitalize">
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

      <div className="flex flex-wrap items-center gap-6">
        <p className="text-sm text-foreground/50 flex items-center gap-1.5">
          <MapPin className="w-4" />
          {leadQuery.location}
        </p>

        <div className="text-foreground/50 text-sm">
          <span className="font-medium text-foreground/70">
            {leadQuery.resultsCount}
          </span>{" "}
          {leadQuery.resultsCount === 1 ? "result" : "results"}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs sm:text-sm text-foreground/50">
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
}
