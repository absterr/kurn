import type { DashboardDetails } from "@/lib/schema/dashboard-schema";

export default function ProgressBar({ data }: { data: DashboardDetails }) {
  const cx = 140;
  const cy = 130;
  const r = 100;
  const sw = 40;

  const gaugeStart = 270;
  const gaugeEnd = 450;
  const totalSweep = gaugeEnd - gaugeStart;

  const completedFrac = data.completedQueriesPercentage / 100;
  const inProgressFrac = data.processingQueriesPercentage / 100;

  const completedEnd = gaugeStart + totalSweep * completedFrac;
  const inProgressEnd = completedEnd + totalSweep * inProgressFrac;
  const pendingEnd = gaugeEnd;

  return (
    <div className="rounded-2xl sm:rounded-3xl border p-4 sm:p-6 h-full flex flex-col">
      <h3 className="text-base sm:text-lg font-medium pb-2">Progress</h3>
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="w-full max-w-60 sm:max-w-70">
          <svg viewBox="0 0 280 210" className="w-full h-auto text-foreground">
            <title>Progress Gauge</title>
            <defs>
              <pattern
                id="hatch-gauge"
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill="#eef1ef" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="#c9d3ce"
                  strokeWidth="2"
                />
              </pattern>
            </defs>

            <path
              d={describeArc(cx, cy, r, inProgressEnd, pendingEnd)}
              fill="none"
              stroke="url(#hatch-gauge)"
              strokeWidth={sw}
              strokeLinecap="round"
            />

            <path
              d={describeArc(cx, cy, r, completedEnd, inProgressEnd)}
              fill="none"
              stroke="#173c2c"
              strokeWidth={sw}
              strokeLinecap="round"
            />

            <path
              d={describeArc(cx, cy, r, gaugeStart, completedEnd)}
              fill="none"
              stroke="#8fe0ac"
              strokeWidth={sw}
              strokeLinecap="round"
            />

            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize="30"
              fontWeight={700}
              fill="currentColor"
            >
              {data.completedQueriesPercentage}%
            </text>
            <text
              x={cx}
              y={cy + 22}
              textAnchor="middle"
              fontSize="13"
              fill="currentColor"
              opacity={0.5}
            >
              Queries completed
            </text>
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] sm:text-[13px] text-foreground/50 pt-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8fe0ac]" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#173c2c]" /> In Progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={hatchStyle} /> Pending
        </span>
      </div>
    </div>
  );
}

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const hatchStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, #c9d3ce 0, #c9d3ce 1.5px, transparent 1.5px, transparent 6px)",
  backgroundColor: "#eef1ef",
};
