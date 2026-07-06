import { ArrowUpRight } from "lucide-react";
import type { DashboardDetails } from "@/lib/schema/dashboard-schema";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  trend: React.ReactNode;
  pill?: React.ReactNode;
  isFirst?: boolean;
}

export default function Stats({ data }: { data: DashboardDetails }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
      <StatCard
        label="Total leads"
        value={data.totalLeads}
        trend={<Trend n="5" isFirst />}
        pill={<TrendPill n="5" isFirst />}
        isFirst
      />
      <StatCard
        label="Reviewed leads"
        value={data.reviewedLeads}
        trend={<Trend n="6" />}
        pill={<TrendPill n="6" />}
      />
      <StatCard
        label="Processing queries"
        value={data.processingQueries}
        trend={
          <span className="pt-2 text-[11px] sm:text-[12.5px] text-foreground/50 flex items-center">
            In Queue
          </span>
        }
      />
      <StatCard
        label="Pending queries"
        value={data.pendingQueries}
        trend={
          <span className="pt-2 text-[11px] sm:text-[12.5px] text-foreground/50 flex items-center">
            On Hold
          </span>
        }
      />
    </div>
  );
}

const StatCard = ({
  label,
  value,
  trend,
  pill,
  isFirst = false,
}: StatCardProps) => (
  <div
    className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 ${
      isFirst ? "bg-[#0f2e1f] text-white" : "border"
    }`}
  >
    <div className="flex items-center justify-between gap-2">
      <span
        className={cn(
          "text-xs sm:text-[15px] font-medium",
          isFirst && "text-white",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full",
          isFirst ? "bg-white/15" : "bg-foreground/5",
        )}
      >
        <ArrowUpRight
          size={15}
          className={isFirst ? "text-white" : "text-foreground/40"}
        />
      </span>
    </div>
    <div className="pt-2 sm:pt-3 flex items-center gap-2">
      <div className="text-2xl sm:text-4xl font-semibold tracking-tight">
        {value}
      </div>
      <div className="sm:hidden">{pill}</div>
    </div>
    <div className="hidden sm:block pt-2 sm-pt-3">{trend}</div>
  </div>
);

const TrendPill = ({
  n,
  isFirst = false,
}: {
  n: string;
  isFirst?: boolean;
}) => (
  <span
    className={`flex text-xs sm-text-sm items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium sm:font-semibold ${
      isFirst ? "bg-white/15 text-white" : "bg-emerald-50 text-emerald-600"
    }`}
  >
    {n}
    <ArrowUpRight size={11} />
  </span>
);

const Trend = ({ n, isFirst = false }: { n: string; isFirst?: boolean }) => (
  <div className="pt-2 hidden sm:flex flex-wrap items-center gap-1.5 text-[11px] sm:text-[12.5px]">
    <TrendPill n={n} isFirst={isFirst} />
    <span className={cn(isFirst ? "text-white/70" : "text-foreground/50")}>
      Increased from last week
    </span>
  </div>
);
