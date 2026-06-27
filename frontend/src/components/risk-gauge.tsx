"use client";

interface RiskGaugeProps {
  score: number;
  label?: string;
}

function getTier(score: number) {
  if (score <= 40) return { color: "#42705e", glow: "animate-teal-glow", label: "LOW RISK", labelClass: "text-[#42705e]" };
  if (score <= 69) return { color: "#D97706", glow: "animate-amber-glow", label: "MODERATE", labelClass: "text-amber-600" };
  return { color: "#E11D48", glow: "animate-critical-glow", label: "CRITICAL", labelClass: "text-rose-600" };
}

export default function RiskGauge({ score, label }: RiskGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dashoffset = circumference - (clamped / 100) * circumference;
  const tier = getTier(clamped);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-44 h-44 ${tier.glow}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            style={{
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease",
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-black tabular-nums"
            style={{ color: tier.color, transition: "color 0.5s ease" }}
          >
            {clamped}
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <span
        className={`mt-2 text-[10px] font-bold uppercase tracking-[0.15em] ${tier.labelClass}`}
        style={{ transition: "color 0.5s ease" }}
      >
        {label ?? tier.label}
      </span>
    </div>
  );
}
