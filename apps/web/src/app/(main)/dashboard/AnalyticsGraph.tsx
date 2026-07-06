const analyticsData: {
  id: string;
  day: string;
  height: number;
  type: "hatch" | "solid";
  color?: string;
  badge?: boolean;
}[] = [
  { id: "1", day: "S", height: 78, type: "hatch" },
  { id: "2", day: "M", height: 122, type: "solid", color: "#2f6b4d" },
  {
    id: "3",
    day: "T",
    height: 108,
    type: "solid",
    color: "#8fe0ac",
    badge: true,
  },
  { id: "4", day: "W", height: 150, type: "solid", color: "#0f2e1f" },
  { id: "5", day: "T", height: 88, type: "hatch" },
  { id: "6", day: "F", height: 70, type: "hatch" },
  { id: "7", day: "S", height: 96, type: "hatch" },
];

export default function AnalyticsGraph() {
  const viewW = 400;
  const viewH = 230;
  const barW = 42;
  const gap = 14;
  const step = barW + gap;
  const startX =
    (viewW - (analyticsData.length * barW + (analyticsData.length - 1) * gap)) /
    2;
  const baseline = 190;

  return (
    <div className="xl:max-w-xl rounded-2xl sm:rounded-3xl border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-medium pb-2">Analytics</h3>
      <div className="w-full" style={{ aspectRatio: `${viewW} / ${viewH}` }}>
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Analytics Graph</title>
          <defs>
            <pattern
              id="hatch-analytics"
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
            <filter
              id="badge-shadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2.5"
                floodColor="#000000"
                floodOpacity="0.12"
              />
            </filter>
          </defs>

          {analyticsData.map((data, idx) => {
            const x = startX + idx * step;
            const top = baseline - data.height;
            const cx = x + barW / 2;
            return (
              <g key={data.id}>
                <rect
                  x={x}
                  y={top}
                  width={barW}
                  height={data.height}
                  rx={barW / 2}
                  fill={
                    data.type === "hatch" ? "url(#hatch-analytics)" : data.color
                  }
                />
                {data.badge && (
                  <g filter="url(#badge-shadow)">
                    <rect
                      x={cx - 22}
                      y={top - 34}
                      width={44}
                      height={24}
                      rx={12}
                      fill="#ffffff"
                    />
                    <text
                      x={cx}
                      y={top - 17}
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight={700}
                      fill="#0f2e1f"
                    >
                      74%
                    </text>
                    <circle
                      cx={cx}
                      cy={top - 4}
                      r={5}
                      fill="#ffffff"
                      stroke="#8fe0ac"
                      strokeWidth={2.5}
                    />
                  </g>
                )}
                <text
                  x={cx}
                  y={baseline + 26}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight={500}
                  fill="#9ca3af"
                >
                  {data.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
