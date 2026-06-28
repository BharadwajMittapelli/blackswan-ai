"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

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
        <Loader2 className="h-4 w-4 text-[#42705e] animate-spin" />
        <p className="text-[#42705e] font-medium text-xs tracking-wide uppercase">
          {LOADING_MESSAGES[loadingMsgIndex % LOADING_MESSAGES.length]}
        </p>
      </div>

      {/* ── Top Row: Gauge + Stats + Matrix ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-5">
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

        {/* Escape Velocity Widget skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28 bg-gray-100 opacity-0 hidden lg:block" />
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex flex-col justify-between h-full animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-4 w-4 rounded bg-slate-800" />
              <Skeleton className="h-3 w-40 bg-slate-800" />
            </div>
            
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-2 w-20 bg-slate-800" />
                <Skeleton className="h-4 w-12 bg-slate-800" />
              </div>
              <Skeleton className="h-3 w-full bg-slate-800 rounded-full" />
              <Skeleton className="h-2 w-48 bg-slate-800" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-slate-800/50 bg-slate-800/30">
                  <Skeleton className="h-2 w-16 bg-slate-800" />
                  <Skeleton className="h-4 w-12 bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Clustering & Chart skeleton ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

        {/* Chart Skeleton */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col w-full h-full min-h-[300px]">
          <Skeleton className="h-3 w-48 bg-gray-100 mb-2" />
          <Skeleton className="h-2 w-64 bg-gray-100 mb-6" />
          <Skeleton className="flex-1 w-full bg-gray-50 rounded-lg" />
        </div>
      </div>

      {/* ── Fundamental Audit Matrix Skeleton ─────────────────────── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden mt-2 mb-2">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col gap-4">
          <Skeleton className="h-5 w-64 bg-slate-800" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-4 w-24 bg-slate-800" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-1/3 bg-slate-800" />
          <Skeleton className="h-4 w-3/4 bg-slate-800" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 bg-slate-800 rounded-full" />
            <Skeleton className="h-8 w-32 bg-slate-800 rounded-full" />
          </div>
          <div className="pt-4 space-y-2">
            <Skeleton className="h-4 w-full bg-slate-800" />
            <Skeleton className="h-4 w-5/6 bg-slate-800" />
          </div>
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
