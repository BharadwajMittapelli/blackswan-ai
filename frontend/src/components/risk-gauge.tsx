"use client";

interface RiskGaugeProps {
  score: number;
  isCritical: boolean;
}

export default function RiskGauge({ score, isCritical }: RiskGaugeProps) {
  /* ── Gauge math ──────────────────────────────────────────────────── */
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const dashoffset = circumference - (clampedScore / 100) * circumference;

  const gaugeColor = isCritical ? "#EF4444" : "#22C55E";
  const glowColor = isCritical ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)";
  const label = isCritical ? "CRITICAL" : "LOW RISK";
  const labelColor = isCritical ? "text-red-400" : "text-emerald-400";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.08)"
            strokeWidth="10"
          />
          {/* Animated progress arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-black tabular-nums"
            style={{ color: gaugeColor, transition: "color 0.5s ease" }}
          >
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-[#64748B] font-medium mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <span
        className={`mt-3 text-xs font-bold uppercase tracking-[0.15em] ${labelColor}`}
        style={{ transition: "color 0.5s ease" }}
      >
        {label}
      </span>
    </div>
  );
}
