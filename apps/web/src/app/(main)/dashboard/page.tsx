import AnalyticsGraph from "./AnalyticsGraph";
import ProgressGauge from "./ProgressGauge";
import Stats from "./Stats";

export default function Dashboard() {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="font-medium text-xl sm:text-2xl py-4">Dashboard</h1>
      <div className="pt-4 flex flex-col gap-y-3 sm:gap-y-5">
        <Stats />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5">
          <AnalyticsGraph />
          <ProgressGauge />
        </div>
      </div>
    </div>
  );
}
