import { Globe } from "lucide-react";
import LeadsCard from "./LeadsCard";
import LeadsForm from "./LeadsForm";
import { leads } from "./leads";

export default function Leads() {
  return (
    <div className="p-2 sm:p-4">
      <h1>Find Leads</h1>
      <div>
        <LeadsForm />
      </div>
      {leads.length > 0 ? (
        <div className="p-4 rounded-xl bg-background">
          {leads.map((lead, idx) => (
            <div key={`${lead.id}`}>
              <LeadsCard lead={lead} />
              {idx !== leads.length - 1 && (
                <div className="py-3">
                  <hr className="bg-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 md:py-32">
          <div className="flex justify-center pb-4">
            <Globe className="w-8 h-8 md:w-12 md:h-12 text-neutral-400" />
          </div>
          <h3 className="md:text-lg font-medium text-foreground/70 pb-2">
            Search for leads
          </h3>
          <p className="text-xs md:text-sm text-foreground/70">
            Enter a keyword and location to discover potential leads
          </p>
        </div>
      )}
    </div>
  );
}
