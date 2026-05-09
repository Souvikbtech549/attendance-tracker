export function CircularProgress({ value, size = 96 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;
  const color = value >= 75 ? "#16a34a" : value >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="54" textAnchor="middle" className="fill-slate-900 text-lg font-bold dark:fill-white">
        {value.toFixed(0)}%
      </text>
    </svg>
  );
}
