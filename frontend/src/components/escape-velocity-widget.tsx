"use client";

import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import type { EscapeVelocityMetrics } from "@/lib/types";

interface EscapeVelocityWidgetProps {
  data: EscapeVelocityMetrics;
}

export default function EscapeVelocityWidget({ data }: EscapeVelocityWidgetProps) {
  const isStable = data.survival_probability === "Stable";
  const isWarning = data.survival_probability === "Warning";
  const isCritical = data.survival_probability === "Critical";

  // Dynamic colors
  const primaryTextColor = isStable ? "text-emerald-500" : isWarning ? "text-amber-500" : "text-rose-600";
  const bgAccentColor = isStable ? "bg-emerald-500/10" : isWarning ? "bg-amber-500/10" : "bg-rose-950/20";
  const barColor = isStable ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-rose-600";
  
  const Icon = isCritical ? ShieldAlert : isWarning ? Shield : ShieldCheck;

  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden font-sans h-full`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800/50">
        <Icon className={`h-4 w-4 ${primaryTextColor}`} />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Tactical Exit Liquidity Matrix
        </h3>
      </div>

      {/* Main Content */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-5">
        {/* Bottleneck Indicator */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Exit Bottleneck</span>
            <span className={`text-lg font-bold ${primaryTextColor}`}>{data.exit_bottleneck_pct}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-in-out`} 
              style={{ width: `${data.exit_bottleneck_pct}%` }} 
            />
          </div>
          <span className="text-[10px] text-slate-500">Retail capital able to exit before 90% price collapse.</span>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Column 1 */}
          <div className={`flex flex-col gap-1.5 p-3 rounded-lg border border-slate-800/50 ${bgAccentColor}`}>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Survival Rating</span>
            <span className={`text-sm font-bold ${primaryTextColor}`}>{data.survival_probability}</span>
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-slate-800/50 bg-slate-800/20">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold line-clamp-1" title="Blocks Until Pool Depletion">Time Window</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-200">{data.estimated_blocks_to_drain}</span>
              <span className="text-[10px] text-slate-500 uppercase">Blocks</span>
            </div>
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-slate-800/50 bg-slate-800/20">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold line-clamp-1" title="Required Safety Slippage">Countermeasure</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-200">{data.recommended_slippage_pct}%</span>
              <span className="text-[10px] text-slate-500 uppercase">Slip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Defense Playbook Banner */}
      {!isStable && (
        <div className={`px-5 py-3 border-t border-slate-800 ${isCritical ? 'bg-rose-950/40 text-rose-200' : 'bg-amber-950/40 text-amber-200'}`}>
          <p className="text-xs leading-relaxed font-mono">
            <strong>SYSTEM WARNING:</strong> Internal liquidity pool architecture cannot sustain an insider cluster liquidation event. To counter an automated smart contract exit cascade, manual wallet slippage must be configured to at least <span className="font-bold border-b border-current">{data.recommended_slippage_pct}%</span>.
          </p>
        </div>
      )}
    </div>
  );
}
