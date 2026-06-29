import { Skeleton } from "@/components/ui/skeleton";

const dummyArr = ["1", "2", "3", "4"];

export default function LeadsListSkeleton() {
  return (
    <div className="flex flex-col lg:pr-6">
      {dummyArr.map((n) => (
        <LeadItemSkeleton key={n} />
      ))}
    </div>
  );
}

const LeadItemSkeleton = () => (
  <div className="border-b border-foreground/10 py-4 flex flex-col gap-y-2">
    <div className="flex items-start justify-between gap-3 py-1">
      <Skeleton className="h-3.5 w-40" />
    </div>

    <div className="flex items-center gap-1 pt-2 pb-1">
      <Skeleton className="h-3.5 w-3.5 shrink-0" />
      <Skeleton className="h-3 w-48" />
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center py-1 sm:justify-between gap-2">
      <div className="flex items-center gap-1">
        <Skeleton className="h-3.5 w-3.5 shrink-0" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);
