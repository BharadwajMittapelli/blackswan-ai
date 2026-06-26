"use client";

import { ShieldAlert, AlertTriangle, Activity, Lock } from "lucide-react";

const TIPS = [
  {
    icon: AlertTriangle,
    title: "Unlock Events",
    description:
      "Large token unlocks (>5% of circulating supply) within 30 days create significant dump risk. Always check vesting schedules.",
    color: "text-amber-400",
  },
  {
    icon: Activity,
    title: "Liquidity Traps",
    description:
      "Pools with <$50k liquidity can be easily manipulated. Low liquidity means high slippage and rug-pull exposure.",
    color: "text-rose-400",
  },
  {
    icon: Lock,
    title: "Wallet Concentration",
    description:
      "If the top 10 wallets hold >30% of supply, the token is susceptible to coordinated selling pressure.",
    color: "text-violet-400",
  },
  {
    icon: ShieldAlert,
    title: "Contract Risks",
    description:
      "Hidden mint functions, proxy contracts, and unrenounced ownership are all red flags for smart contract security.",
    color: "text-cyan-400",
  },
];

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16">
      {/* ── Illustration ──────────────────────────────────────────── */}
      <div className="relative mb-10">
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#38BDF8]/10 to-[#818CF8]/10 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#38BDF8]/15 to-[#818CF8]/15 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-[#38BDF8]/60" strokeWidth={1.2} />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#818CF8]/20 animate-ping" />
        <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-[#38BDF8]/20 animate-ping animation-delay-700" />
      </div>

      <h2 className="text-2xl font-bold text-[#E2E8F0] mb-2 tracking-tight">
        Ready to Scan
      </h2>
      <p className="text-[#64748B] text-sm text-center max-w-md mb-10">
        Paste a token contract address above or pick a demo token from the sidebar to generate a full risk analysis.
      </p>

      {/* ── Risk Tips Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className="group p-4 rounded-xl border border-[rgba(148,163,184,0.1)] bg-[#1E293B]/40 hover:bg-[#1E293B]/70 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <tip.icon className={`h-5 w-5 mt-0.5 ${tip.color} shrink-0`} strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-semibold text-[#E2E8F0] mb-1">
                  {tip.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#64748B]">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
