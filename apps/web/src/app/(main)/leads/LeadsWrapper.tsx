"use client";
import { Globe } from "lucide-react";
import { useState, useTransition } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { findLeads } from "@/lib/actions";
import type { Lead } from "@/lib/types";
import LeadsDrawer from "./LeadsDrawer";
import LeadsForm from "./LeadsForm";

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-24 md:py-32">
    <div className="flex justify-center pb-4">
      <Globe className="w-8 h-8 md:w-12 md:h-12 text-neutral-400" />
    </div>
    <h3 className="md:text-lg font-medium text-foreground/70 pb-2">
      {message}
    </h3>

    <p className="text-xs md:text-sm text-foreground/70">
      Enter a keyword and location to discover potential leads{" "}
    </p>
  </div>
);

export default function LeadsWrapper() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
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
      <section>
        {isPending ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size={8} />
          </div>
        ) : leads === null ? (
          <EmptyState message="Search for leads" />
        ) : leads.length === 0 ? (
          <EmptyState message="No results found" />
        ) : (
          <div className="p-4 rounded-xl max-h-[67vh] overflow-y-auto no-scrollbar">
            {leads.map((lead, idx) => (
              <div key={lead.mapLink}>
                <LeadsDrawer lead={lead} />
                {idx !== leads.length - 1 && (
                  <div className="py-3">
                    <hr className="bg-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
