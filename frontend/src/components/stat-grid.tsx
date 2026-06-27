"use client";

import { PieChart, Anchor, BarChart3 } from "lucide-react";

interface StatGridProps {
  top100: number;
  whale: number;
  gini: number;
}

const stats = (props: StatGridProps) => [
  {
    label: "Top 100 Concentration",
    value: `${props.top100.toFixed(2)}%`,
    icon: PieChart,
    color: "text-[#42705e]",
    border: "border-[#42705e]/15",
    bg: "bg-[#42705e]/5",
  },
  {
    label: "Whale Concentration",
    value: `${props.whale.toFixed(2)}%`,
    icon: Anchor,
    color: "text-amber-600",
    border: "border-amber-200",
    bg: "bg-amber-50",
  },
  {
    label: "Gini Distribution Score",
    value: props.gini.toFixed(4),
    icon: BarChart3,
    color: "text-rose-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
  },
];

export default function StatGrid({ top100, whale, gini }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats({ top100, whale, gini }).map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col gap-1 transition-colors hover:shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-1">
            <s.icon className={`h-3.5 w-3.5 ${s.color}`} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-500">
              {s.label}
            </span>
          </div>
          <span className="text-2xl font-black text-gray-900 tabular-nums tracking-tight">
            {s.value}
          </span>
        </div>
      ))}
    </div>
  );
}
