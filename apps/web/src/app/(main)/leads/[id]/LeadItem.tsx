"use client";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import type { Lead } from "@/lib/schema/lead-schema";
import { formatDate } from "@/lib/utils";

export default function LeadItem({
  lead,
  onClickAction,
}: {
  lead: Lead;
  onClickAction: () => void;
}) {
  return (
    <div
      key={lead.id}
      className="border-b border-foreground/10 py-4 flex flex-col gap-y-2"
    >
      <button
        type="button"
        onClick={onClickAction}
        className="group flex items-start justify-between gap-3"
      >
        <p className="text-sm font-medium text-foreground/90 underline xl:no-underline xl:group-hover:underline cursor-pointer truncate">
          {lead.companyName}
        </p>

        <ArrowRight className="hidden xl:block xl:w-4 cursor-pointer" />
      </button>

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-foreground/50">
        <a
          href={`tel:${lead.phone}`}
          className="sm:text-sm text-foreground/50 hover:text-foreground flex items-center gap-1"
        >
          <Phone className="w-4" />
          {lead.phone}
        </a>

        <span>Added: {formatDate(lead.createdAt)}</span>
      </div>
    </div>
  );
}
