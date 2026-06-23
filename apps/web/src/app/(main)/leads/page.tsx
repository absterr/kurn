import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLeadQueriesHandler } from "@/lib/queries/lead-queries";
import LeadsQueries from "./LeadsQueries";
import LeadsQueryForm from "./LeadsQueryForm";
import LeadsWrapper from "./LeadsWrapper";

export default async function Leads() {
  const headersList = await headers();
  const role = headersList.get("x-role");

  if (!role || role === "admin") {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  if (role === "member") {
    await queryClient.prefetchQuery({
      queryKey: ["leadQueries"],
      queryFn: getLeadQueriesHandler,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    });
  }

  return (
    <>
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-10 min-h-0 pt-4">
        <LeadsQueryForm role={role} />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LeadsQueries role={role} />
        </HydrationBoundary>
      </div>

      {/* "flex-col" and "min-h-0" lets ScrollArea stretch as needed for the content */}
      <div className="flex flex-col md:hidden min-h-0">
        <LeadsWrapper
          form={<LeadsQueryForm role={role} />}
          list={
            <HydrationBoundary state={dehydrate(queryClient)}>
              <LeadsQueries role={role} />
            </HydrationBoundary>
          }
        />
      </div>
    </>
  );
}
