import LeadQueryDetailsSkeleton from "./LeadQueryDetailsSkeleton";
import LeadListSkeleton from "./LeadsListSkeleton";

export default function LeadQueryLoading() {
  return (
    <div className="flex flex-col min-h-0 pt-4">
      <LeadQueryDetailsSkeleton />
      <div className="flex flex-col xl:grid xl:grid-cols-2 min-h-0">
        <LeadListSkeleton />
        <div className="hidden xl:flex p-4 min-h-0" />
      </div>
    </div>
  );
}
