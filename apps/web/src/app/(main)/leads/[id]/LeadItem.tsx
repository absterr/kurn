import { MapPin, Phone } from "lucide-react";
import type { Lead } from "./mockLeads";

const LeadItem = ({ lead }: { lead: Lead }) => {
  return (
    <div
      key={lead.id}
      className="group border-b border-foreground/10 py-4 flex flex-col gap-y-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground/90 underline xl:no-underline xl:group-hover:underline truncate">
              {lead.companyName}
            </p>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-foreground/80 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
              {lead.completionStatus}
            </span>
          </div>
          <p className="pt-1 flex items-center gap-1 text-xs text-foreground/50">
            <MapPin className="w-4" />

            <a
              href={lead.mapLink}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 max-w-50 sm:max-w-xs sm:text-sm text-foreground/50 hover:text-foreground truncate"
            >
              {lead.address}
            </a>
          </p>
        </div>

        {/* View btn goes here */}
        <div></div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-foreground/50">
        <a
          href={`tel:${lead.phone}`}
          className="sm:text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"
        >
          <Phone className="w-4" />
          {lead.phone}
        </a>

        <span>
          Added:{" "}
          {new Date(lead.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default LeadItem;
