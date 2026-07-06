import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMockDashboardDetails } from "@/lib/mock-data/mock-dashboard-details";
import { getDashboardDetailsHandler } from "@/lib/queries/dashboard-queries";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardWrapper from "./DashboardWrapper";

export default function DashboardPage() {
  return (
    <div className="p-2 sm:p-4 h-full flex flex-col">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Dashboard</h1>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </div>
    </div>
  );
}

const Dashboard = async () => {
  const headersList = await headers();
  const role = headersList.get("x-role");

  if (!role || role === "admin") {
    redirect("/login");
  }

  const queryClient = new QueryClient();
  const mockDetails = getMockDashboardDetails();

  await queryClient.prefetchQuery({
    queryKey: ["dashboardDetails"],
    queryFn: getDashboardDetailsHandler,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    initialData: role === "guest" ? mockDetails : undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardWrapper role={role} />
    </HydrationBoundary>
  );
};
