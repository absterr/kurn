import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import EmptyState from "@/components/EmptyState";
import { mockLeadQueries } from "@/lib/mock-data/mock-lead-queries";
import { getLeadQueriesHandler } from "@/lib/queries/lead-queries";
import LeadQueryWrapper from "./_LeadQueryWrapper";

export default async function LeadQuery({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const role = headersList.get("x-role");

  if (!role || role === "admin") {
    redirect("/login");
  }

  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) {
    return (
      <EmptyState
        icon={Ban}
        headline="Invalid ID"
        message="The provided ID is not valid"
      />
    );
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["leadQueries"],
    queryFn: getLeadQueriesHandler,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    initialData: role === "guest" ? mockLeadQueries : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeadQueryWrapper id={id} role={role} />
    </HydrationBoundary>
  );
}
