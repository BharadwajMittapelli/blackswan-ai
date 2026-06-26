"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

const LOADING_MESSAGES = [
  "Fetching on-chain data…",
  "Querying DexScreener liquidity…",
  "Analyzing tokenomics supply…",
  "Checking CoinGecko metrics…",
  "Scanning wallet concentration…",
  "Evaluating vesting schedules…",
  "Synthesizing risk report…",
];

interface ResultsSkeletonProps {
  loadingMsgIndex: number;
}

export default function ResultsSkeleton({ loadingMsgIndex }: ResultsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 p-6">
      {/* ── Left Column Skeleton ─────────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#1E293B]/50 p-6 animate-pulse-glow">
        <Skeleton className="h-5 w-32 bg-[#334155] mb-6 mx-auto" />
        <div className="flex justify-center mb-6">
          <Skeleton className="h-48 w-48 rounded-full bg-[#334155]/60" />
        </div>
        <Skeleton className="h-4 w-24 bg-[#334155] mx-auto mb-4" />
        <div className="space-y-3 mt-6">
          <Skeleton className="h-3 w-full bg-[#334155]" />
          <Skeleton className="h-3 w-3/4 bg-[#334155]" />
          <Skeleton className="h-3 w-5/6 bg-[#334155]" />
        </div>
      </div>

      {/* ── Right Column Skeleton ────────────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#1E293B]/50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-5 w-5 text-[#FBBF24] animate-pulse" />
          <p className="text-[#FBBF24] font-medium text-sm tracking-wide uppercase">
            {LOADING_MESSAGES[loadingMsgIndex % LOADING_MESSAGES.length]}
          </p>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-2/3 bg-[#334155]" />
          <Skeleton className="h-4 w-full bg-[#334155]" />
          <Skeleton className="h-4 w-5/6 bg-[#334155]" />
          <div className="pt-4 space-y-3">
            <Skeleton className="h-5 w-1/2 bg-[#334155]" />
            <Skeleton className="h-4 w-full bg-[#334155]" />
            <Skeleton className="h-4 w-4/5 bg-[#334155]" />
          </div>
          <div className="pt-4 space-y-3">
            <Skeleton className="h-5 w-2/5 bg-[#334155]" />
            <Skeleton className="h-4 w-full bg-[#334155]" />
            <Skeleton className="h-4 w-3/4 bg-[#334155]" />
          </div>
        </div>
      </div>
    </div>
  );
}
