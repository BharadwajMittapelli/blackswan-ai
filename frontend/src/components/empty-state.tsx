"use client";

import { ShieldAlert, AlertTriangle, Activity, Lock, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TokenSearch, { TokenOption, POPULAR_TOKENS } from "./TokenSearch";

const TIPS = [
  {
    icon: AlertTriangle,
    title: "Unlock Events",
    description:
      "Large token unlocks (>5% of circulating supply) within 30 days create significant dump risk. Always check vesting schedules.",
    color: "text-amber-500",
  },
  {
    icon: Activity,
    title: "Liquidity Traps",
    description:
      "Pools with <$50k liquidity can be easily manipulated. Low liquidity means high slippage and rug-pull exposure.",
    color: "text-rose-500",
  },
  {
    icon: Lock,
    title: "Wallet Concentration",
    description:
      "If the top 10 wallets hold >30% of supply, the token is susceptible to coordinated selling pressure.",
    color: "text-violet-500",
  },
  {
    icon: ShieldAlert,
    title: "Insider Clustering",
    description:
      "Multiple wallets funded by the same source indicate developer bundling — a strong signal for coordinated rug pulls.",
    color: "text-[#42705e]",
  },
];

interface EmptyStateProps {
  tokenAddress: string;
  onAddressChange: (val: string) => void;
  onScan: () => void;
}

export default function EmptyState({ tokenAddress, onAddressChange, onScan }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 md:py-20 w-full max-w-3xl mx-auto">
      {/* ── Brand Logo Centered ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <ShieldAlert className="h-10 w-10 text-[#42705e]" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-[3px] border-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            BlackSwan<span className="text-[#42705e]"> AI</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mt-0.5">
            Risk Command Center
          </p>
        </div>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div className="w-full relative flex items-center mb-12 shadow-sm rounded-xl">
        <TokenSearch
          tokens={POPULAR_TOKENS}
          value={tokenAddress}
          onChange={onAddressChange}
          onSelect={onAddressChange}
          onScan={onScan}
        />
        <Button
          onClick={onScan}
          className="absolute right-1.5 h-11 px-5 text-sm font-semibold bg-[#42705e] hover:bg-[#376251] text-white rounded-lg transition-all duration-200 cursor-pointer shadow-sm z-10"
        >
          <span className="flex items-center gap-2">
            Scan
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </div>

      {/* ── Risk Tips Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className="group p-4 rounded-xl border border-gray-200/60 bg-transparent hover:bg-gray-100/30 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <tip.icon className={`h-4 w-4 mt-0.5 ${tip.color} shrink-0`} strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">
                  {tip.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-gray-400">
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
