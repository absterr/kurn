"use client";
import {
  Briefcase,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Lead } from "@/lib/types";

export default function LeadsCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-lg bg-background p-4 md:p-6 transition-all cursor-pointer group">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          <h3 className="text-left text-base md:text-lg font-semibold text-foreground/90 group-hover:text-green-700 transition-colors duration-150">
            {lead.name}
          </h3>
        </div>
        <ChevronRight className="hidden xl:block w-5 h-5 text-foreground/40 group-hover:text-foreground/80 transition-colors shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <MapPin className="w-4 h-4 text-foreground/60 shrink-0" />
          <p className="text-foreground/80 hover:text-foreground truncate">
            {lead.address}
          </p>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Phone className="w-4 h-4 text-foreground/60 shrink-0" />
            <p className="text-foreground/80 hover:text-foreground">
              {lead.phone}
            </p>
          </div>
        )}

        {lead.website && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Globe className="w-4 h-4 text-foreground/60 shrink-0" />
            <p className="text-foreground/80 hover:text-foreground">
              {lead.website}
            </p>
          </div>
        )}

        {lead.emails.length > 0 && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Mail className="w-4 h-4 text-foreground/60 shrink-0" />
            <p className="text-foreground/80 hover:text-foreground">
              {lead.emails[0]}
            </p>
          </div>
        )}
      </div>

      {lead.overview && (
        <p className="text-xs text-left sm:text-sm text-foreground/60 gray-600 line-clamp-2 mb-4 mt-2">
          {lead.overview}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 sm:pt-4">
        <div className="flex items-center gap-6 text-xs sm:text-sm text-foreground/50">
          {lead.jobs && lead.jobs.length > 0 && (
            <div className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{lead.jobs.length} open jobs</span>
            </div>
          )}
          {lead.linkedinUrl && (
            <div className="flex items-center gap-1">
              <a href={lead.linkedinUrl} className="hover:text-foreground">
                LinkedIn
              </a>
            </div>
          )}
        </div>
        <p className="hidden md:block text-xs sm:text-sm text-foreground/50">
          Click to view details
        </p>
      </div>
    </div>
  );
}
