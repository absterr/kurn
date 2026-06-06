import { getLeadQuery } from "../mockLeadQueries";
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

  return (
    <div className="pt-4">
      <LeadQueryDetails leadQuery={leadQuery} />
    </div>
  );
}
