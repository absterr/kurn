"use client";
import {
  BriefcaseBusiness,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import LinkedinIcon from "@/components/LinkedinIcon";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Lead } from "@/lib/types";
import LeadsCard from "./LeadsCard";

export default function LeadsDrawer({ lead }: { lead: Lead }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <LeadsCard lead={lead} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="py-6">
          <DrawerTitle className="font-semibold text-lg">
            {lead.name}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-y-6 overflow-y-auto h-fit px-6 py-2 no-scrollbar">
          <div className="space-y-3">
            <h3 className="font-medium text-base sm:text-lg">
              Contact Information
            </h3>
            <div className="flex flex-col gap-y-2">
              <a
                href={lead.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm hover:bg-foreground/5 p-2 rounded-lg transition-colors group"
              >
                <MapPin className="w-4 h-4 text-foreground/50 mt-0.5 shrink-0" />
                <span className="group-hover:underline">{lead.address}</span>
              </a>
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 text-sm sm:text-base hover:bg-foreground/5 p-2 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4 text-foreground/50" />
                  <span>{lead.phone}</span>
                </a>
              )}

              {lead.website && (
                <a
                  href={`https://${lead.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm sm:text-base hover:bg-foreground/5 p-2 rounded-lg transition-colors group"
                >
                  <Globe className="w-4 h-4 text-foreground/50" />
                  <span className="group-hover:underline">{lead.website}</span>
                  <ExternalLink className="w-3 h-3 text-foreground/40" />
                </a>
              )}

              {lead.emails.length > 0 && (
                <div className="space-y-1">
                  {lead.emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="flex items-center gap-3 text-sm sm:text-base hover:bg-foreground/5 p-2 rounded-lg transition-colors group"
                    >
                      <Mail className="w-4 h-4 text-foreground/50" />
                      <span className="group-hover:underline">{email}</span>
                    </a>
                  ))}
                </div>
              )}

              {lead.linkedinUrl && (
                <a
                  href={lead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm sm:text-base hover:bg-foreground/5 p-2 rounded-lg transition-colors group"
                >
                  <LinkedinIcon className="w-4 h-4 text-background bg-foreground/50 border-0" />
                  <span className="group-hover:underline">
                    LinkedIn Profile
                  </span>
                  <ExternalLink className="w-3 h-3 text-foreground/40" />
                </a>
              )}
            </div>
          </div>

          {lead.overview && (
            <div className="flex flex-col gap-y-3">
              <h3 className="font-medium text-base sm:text-lg">Overview</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {lead.overview}
              </p>
            </div>
          )}

          {lead.jobs && lead.jobs.length > 0 && (
            <div className="flex flex-col gap-y-3 py-4">
              <h3 className="font-medium text-base sm:text-lg flex items-center gap-2">
                <BriefcaseBusiness className="w-5 h-5" />
                Open Positions ({lead.jobs.length})
              </h3>
              <ul className="flex flex-col gap-y-2">
                {lead.jobs.slice(0, 5).map((job) => (
                  <li key={job.link}>
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-foreground/10 rounded-md hover:border-foreground/20 hover:bg-foreground/2 transition-all group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm group-hover:underline">
                            {job.title}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {job.location}
                          </p>
                        </div>
                        <span className="text-xs text-foreground/50 whitespace-nowrap">
                          {job.posted}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
                {lead.jobs.length > 5 && (
                  <p className="text-xs text-foreground/60 pt-2">
                    +{lead.jobs.length - 5} more positions
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
