import {
  Briefcase,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Lead } from "@/lib/types";

const LeadsCard = ({ lead }: { lead: Lead }) => {
  return (
    <div className="rounded-lg p-2 md:p-4 transition-all cursor-pointer group">
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground/90 group-hover:text-green-700 transition-colors duration-150">
            {lead.name}
          </h3>
        </div>
        <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-foreground/80 transition-colors shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <MapPin className="w-4 h-4 text-foreground/60 shrink-0" />
          <a
            href={lead.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 hover:text-foreground truncate"
          >
            {lead.address}
          </a>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Phone className="w-4 h-4 text-foreground/60 shrink-0" />
            <a
              href={`tel:${lead.phone}`}
              // onClick={(e) => e.stopPropagation()}
              className="text-foreground/80 hover:text-foreground"
            >
              {lead.phone}
            </a>
          </div>
        )}

        {lead.website && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Globe className="w-4 h-4 text-foreground/60 shrink-0" />
            <a
              href={`https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/80 hover:text-foreground"
            >
              {lead.website}
            </a>
          </div>
        )}

        {lead.emails.length > 0 && (
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Mail className="w-4 h-4 text-foreground/60 shrink-0" />
            <a
              href={`mailto:${lead.emails[0]}`}
              // onClick={(e) => e.stopPropagation()}
              className="text-foreground/80 hover:text-foreground"
            >
              {lead.emails[0]}
            </a>
          </div>
        )}
      </div>

      {lead.overview && (
        <p className="text-xs sm:text-sm text-foreground/60 gray-600 line-clamp-2 mb-4 mt-2">
          {lead.overview}
        </p>
      )}

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-6 text-2xs sm:text-xs text-foreground/50">
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
        <p className="text-2xs sm:text-xs text-foreground/50">
          Click to view details
        </p>
      </div>
    </div>
  );
};

export default LeadsCard;
