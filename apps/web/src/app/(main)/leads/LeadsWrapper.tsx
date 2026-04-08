"use client";
import { Globe } from "lucide-react";
import { useState, useTransition } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { findLeads } from "@/lib/actions";
import type { Lead } from "@/lib/types";
import LeadsCard from "./LeadsCard";
import LeadsDetails from "./LeadsDetails";
import LeadsDrawer from "./LeadsDrawer";
import LeadsForm from "./LeadsForm";
import { mockLeads } from "./mockLeads";

const EmptyState = ({
  caption,
  message,
}: {
  caption: string;
  message: string;
}) => (
  <div className="text-center py-24 md:py-32">
    <div className="flex justify-center pb-4">
      <Globe className="w-8 h-8 md:w-12 md:h-12 text-neutral-400" />
    </div>
    <h3 className="md:text-lg font-medium text-foreground/70 pb-2">
      {caption}
    </h3>
    <p className="text-xs md:text-sm text-foreground/70">{message}</p>
  </div>
);

export default function LeadsWrapper() {
  const [leads, setLeads] = useState<Lead[] | null>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = ({
    keyword,
    location,
  }: {
    keyword: string;
    location: string;
  }) => {
    startTransition(async () => {
      try {
        const leads = await findLeads(keyword, location);
        setLeads(leads);
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <div>
      <LeadsForm isPending={isPending} onSearchAction={handleSearch} />
      <div>
        {isPending ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size={8} />
          </div>
        ) : leads === null ? (
          <EmptyState
            caption="Search for leads"
            message="Enter a keyword and location to discover potential leads"
          />
        ) : leads.length === 0 ? (
          <EmptyState
            caption="No results found"
            message="Enter a keyword and location to discover potential leads"
          />
        ) : (
          <div className="xl:grid xl:grid-cols-2 xl:gap-8 h-full py-1">
            <section className="rounded-xl overflow-y-auto no-scrollbar">
              <h3 className="py-2">
                Results{" "}
                <span className="text-xs sm:text-sm">({leads.length})</span>
              </h3>
              <div className="py-4 flex flex-col gap-y-6 rounded-xl overflow-y-auto no-scrollbar">
                {leads.map((lead) => (
                  <div key={lead.mapLink}>
                    <div className="xl:hidden">
                      <LeadsDrawer lead={lead} />
                    </div>
                    <button
                      type="button"
                      className="hidden xl:block w-full"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <LeadsCard lead={lead} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="hidden xl:block xl:bg-background rounded-xl p-2 overflow-y-auto no-scrollbar">
              {selectedLead ? (
                <div>
                  <h3 className="text-left text-lg font-semibold px-6 py-4">
                    {selectedLead.name}
                  </h3>
                  <LeadsDetails lead={selectedLead} />
                </div>
              ) : (
                <EmptyState
                  caption="Select a card"
                  message="Click on any of the results to see details"
                />
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
