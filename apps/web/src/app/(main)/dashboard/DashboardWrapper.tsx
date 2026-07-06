"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardDetailsHandler } from "@/lib/queries/dashboard-queries";
import AnalyticsGraph from "./AnalyticsGraph";
import ProgressGauge from "./ProgressGauge";
import Stats from "./Stats";

export default function DashboardWrapper({ role }: { role: string }) {
  const { data } = useQuery({
    queryKey: ["dashboardDetails"],
    queryFn: getDashboardDetailsHandler,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: role === "member",
  });

  if (!data) {
    throw new Error("Unable to fetch dashboard details at the moment");
  }

  return (
    <div className="pt-4 flex flex-col gap-y-3 sm:gap-y-5">
      <Stats data={data} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5">
        <AnalyticsGraph />
        <ProgressGauge data={data} />
      </div>
    </div>
  );
}
