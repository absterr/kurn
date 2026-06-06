import { ScrollArea } from "@/components/ui/scroll-area";
import { getLeadQuery } from "../mockLeadQueries";
import LeadItem from "./LeadItem";
import LeadQueryDetails from "./LeadQueryDetails";
import { getLeadsByQueryId } from "./mockLeads";

export default async function LeadQuery({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leadQuery = getLeadQuery(id);

  // Custom not-found UI for this page
  if (!leadQuery) return <div>Not found lol</div>;

  const leads = getLeadsByQueryId(id);

  // "flex-col" and "min-h-0" lets ScrollArea stretch as needed for the content
  // ScrollArea needs a child div with "flex" to define the content width bounds
  return (
    <div className="flex flex-col min-h-0 pt-4">
      <LeadQueryDetails leadQuery={leadQuery} />
      <div className="grid grid-cols-1 xl:grid-cols-2 min-h-0">
        <ScrollArea className="min-h-0 w-full">
          <div className="flex flex-col lg:pr-6">
            {leads.map((lead) => (
              <LeadItem key={lead.id} lead={lead} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
