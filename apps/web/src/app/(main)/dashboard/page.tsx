import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMockDashboardDetails } from "@/lib/mock-data/mock-dashboard-details";
import { getDashboardDetailsHandler } from "@/lib/queries/dashboard-queries";
import type { DashboardDetails } from "@/lib/schema/dashboard-schema";
import AnalyticsGraph from "./AnalyticsGraph";
import ProgressGauge from "./ProgressGauge";
import Stats from "./Stats";

export default function DashboardPage() {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Dashboard</h1>
      <Suspense fallback={<p className="py-4">Loading dashboard...</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

const Dashboard = async () => {
  const headersList = await headers();
  const role = headersList.get("x-role");

  if (!role || role === "admin") {
    redirect("/login");
  }

  let details: DashboardDetails;
  if (role === "member") {
    const result = await getDashboardDetailsHandler();
    if (!result.data) {
      throw new Error("Unable to fetch dashboard details at the moment");
    }
    details = result.data;
  } else {
    details = getMockDashboardDetails();
  }

  return (
    <div className="pt-4 flex flex-col gap-y-3 sm:gap-y-5">
      <Stats data={details} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5">
        <AnalyticsGraph />
        <ProgressGauge data={details} />
      </div>
    </div>
  );
};
