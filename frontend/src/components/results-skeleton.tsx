"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

const LOADING_MESSAGES = [
  "Resolving token ticker via DexScreener...",
  "Locating highest-volume smart contract...",
  "Injecting contract address into ADK workflow...",
  "Fetching on-chain data…",
  "Querying DexScreener liquidity…",
  "Analyzing tokenomics supply…",
  "Scanning wallet concentration…",
  "Running insider clustering forensics…",
  "Evaluating vesting schedules…",
  "Synthesizing risk report…",
];

interface ResultsSkeletonProps {
  loadingMsgIndex: number;
}

export default function ResultsSkeleton({ loadingMsgIndex }: ResultsSkeletonProps) {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* ── Status bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-1">
        <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" />
        <p className="text-amber-600 font-medium text-xs tracking-wide uppercase">
          {LOADING_MESSAGES[loadingMsgIndex % LOADING_MESSAGES.length]}
        </p>
      </div>

      {/* ── Top Row: Gauge + Stats ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        {/* Gauge skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col items-center justify-center animate-pulse-glow">
          <Skeleton className="h-4 w-16 bg-gray-100 mb-4" />
          <Skeleton className="h-44 w-44 rounded-full bg-gray-100" />
          <Skeleton className="h-3 w-20 bg-gray-100 mt-3" />
        </div>

        {/* Stat grid skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28 bg-gray-100" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                <Skeleton className="h-3 w-24 bg-gray-100 mb-3" />
                <Skeleton className="h-7 w-20 bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Middle Row: Clustering skeleton ─────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <Skeleton className="h-4 w-48 bg-gray-100" />
          <Skeleton className="h-5 w-28 bg-gray-100 rounded-full" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-24 bg-gray-100" />
              <Skeleton className="h-4 w-12 bg-gray-100" />
              <Skeleton className="h-4 w-14 bg-gray-100 rounded-full" />
              <Skeleton className="h-4 w-24 bg-gray-100 flex-1" />
              <Skeleton className="h-4 w-16 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row: AI Narrative skeleton ───────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          </div>
          <Skeleton className="h-3 w-32 bg-gray-100 ml-2" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-2/3 bg-gray-100" />
          <Skeleton className="h-4 w-full bg-gray-100" />
          <Skeleton className="h-4 w-5/6 bg-gray-100" />
          <div className="pt-3 space-y-3">
            <Skeleton className="h-5 w-1/3 bg-gray-100" />
            <Skeleton className="h-4 w-full bg-gray-100" />
            <Skeleton className="h-4 w-4/5 bg-gray-100" />
          </div>
          <div className="pt-3 space-y-3">
            <Skeleton className="h-5 w-2/5 bg-gray-100" />
            <Skeleton className="h-4 w-full bg-gray-100" />
            <Skeleton className="h-4 w-3/4 bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
