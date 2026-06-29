import { Skeleton } from "@/components/ui/skeleton";

export default function LeadQueryDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex flex-wrap items-center gap-3 pb-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      <div className="flex flex-wrap items-center gap-6 py-1">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-3.5 w-26" />
        </div>
        <Skeleton className="h-3.5 w-16" />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
