import { Skeleton } from "@/components/ui/skeleton";

export default function LeadsLoading() {
  return (
    <>
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-0 pt-4">
        <LeadsQueryFormSkeleton />
        <LeadsQueriesSkeleton />
      </div>

      <div className="flex flex-col md:hidden min-h-0">
        <LeadsWrapperSkeleton />
      </div>
    </>
  );
}

// ─── Shared pieces ────────────────────────────────────────────────────────────

const LeadsQueryFormSkeleton = ({ mobile = false }: { mobile?: boolean }) => (
  <div>
    <div className="py-1">
      <Skeleton className="h-6 w-24" />
    </div>

    <div
      className={`flex gap-4 pt-4 pb-8 ${
        mobile ? "flex-col" : "flex-col md:flex-row"
      } items-start`}
    >
      <div className="w-full">
        <div className="py-2.5 sm:py-3">
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-10.5 w-full rounded-lg border" />
      </div>

      <div className="w-full">
        <div className="py-2.5 sm:py-3">
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-10.5 w-full rounded-lg border" />
      </div>
    </div>

    <Skeleton className="h-10 w-full sm:w-18 rounded-2xl" />
  </div>
);

const LeadQueryCardSkeleton = () => (
  <div className="border rounded-lg p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="py-1">
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="flex items-center gap-1 py-1.5">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-2.5 w-18" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 py-1 px-2.5">
        <Skeleton className="h-2 w-2" />
        <Skeleton className="h-3 w-16 shrink-0 rounded-md" />
      </div>
    </div>

    <div className="my-3 border-t" />

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-0.5">
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

const LeadsQueriesSkeleton = () => (
  <div className="flex flex-col h-full min-h-0">
    <div className="flex items-center justify-between lg:px-6 py-1">
      <Skeleton className="h-5 w-30" />
      <Skeleton className="h-4 w-16" />
    </div>

    <div className="flex flex-col gap-y-4 lg:px-6 py-6">
      <LeadQueryCardSkeleton />
      <LeadQueryCardSkeleton />
      <LeadQueryCardSkeleton />
      <div className="hidden lg:block">
        <LeadQueryCardSkeleton />
      </div>
    </div>
  </div>
);

// ─── Mobile wrapper skeleton ───────────────────────────────────────────────────

const LeadsWrapperSkeleton = () => (
  <div className="flex flex-col gap-y-6 min-h-0">
    <div className="flex w-full border-b">
      {/* Add tab (active) */}
      <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3 border-b-2 border-current">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3 w-6" />
      </div>
      {/* Saved tab (inactive) */}
      <div className="flex flex-1 items-center justify-center gap-2 px-4 py-3 opacity-50">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3 w-9" />
      </div>
    </div>

    {/* Default active tab is "form" */}
    <div className="flex-1 min-h-0">
      <LeadsQueryFormSkeleton mobile />
    </div>
  </div>
);
