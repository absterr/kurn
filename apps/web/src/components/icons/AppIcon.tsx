export default function AppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Kurn</title>
      <ellipse
        cx="100"
        cy="150"
        rx="50"
        ry="10"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M80 150 L95 60 M100 150 L100 55 M120 150 L105 60"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g fill="currentColor">
        <ellipse cx="95" cy="60" rx="6" ry="9" />
        <ellipse cx="100" cy="55" rx="6" ry="9" />
        <ellipse cx="105" cy="60" rx="6" ry="9" />
      </g>
      <rect x="85" y="110" width="30" height="8" rx="4" fill="currentColor" />
    </svg>
  );
}
