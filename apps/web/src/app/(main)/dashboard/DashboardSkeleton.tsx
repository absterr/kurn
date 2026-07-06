import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="h-full overflow-hidden">
      <div className="flex flex-col gap-y-3 sm:gap-y-5 pt-4 pb-4 pr-2 sm:pr-3">
        <StatsSkeleton />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5">
          <AnalyticsGraphSkeleton />
          <ProgressGaugeSkeleton />
        </div>
      </div>
    </div>
  );
}

const mapArr = [1, 2, 3, 4];
const StatsSkeleton = () => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
    {mapArr.map((n) => (
      <div key={n} className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3.5 w-20 sm:h-4 sm:w-24" />
          <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
        </div>
        <div className="pt-3 sm:pt-4 flex items-center gap-2">
          <Skeleton className="h-8 w-14 sm:h-10 sm:w-16" />
          <Skeleton className="h-5 w-10 rounded-full sm:hidden" />
        </div>
        <div className="hidden sm:block pt-3">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsGraphSkeleton = () => (
  <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6">
    <div className="pb-4 sm:pb-2">
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="w-full aspect-400/230 flex items-end justify-center gap-3 sm:gap-4 px-2 pb-2">
      {[0.35, 0.58, 0.48, 0.72, 0.4, 0.32, 0.44].map((h) => (
        <Skeleton
          key={h}
          className="w-[10%] rounded-full"
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  </div>
);

const ProgressGaugeSkeleton = () => (
  <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6 h-full flex flex-col">
    <div className="mb-2">
      <Skeleton className="h-5 w-20" />
    </div>
    <div className="flex-1 flex items-center justify-center py-2">
      <Skeleton className="h-40 w-40 sm:h-48 sm:w-48 rounded-full" />
    </div>
    <div className="flex items-center justify-center gap-4 pt-2">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);
