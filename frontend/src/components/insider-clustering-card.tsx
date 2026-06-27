"use client";

import { AlertTriangle, Link2, ShieldAlert } from "lucide-react";
import type { Holder } from "@/lib/types";

interface InsiderClusteringCardProps {
  holders: Holder[];
}

function tierBadge(tier: string) {
  switch (tier) {
    case "Whale":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Shark":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function truncateAddress(addr: string) {
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function InsiderClusteringCard({ holders }: InsiderClusteringCardProps) {
  const flaggedCount = holders.filter((h) => h.cluster_flag).length;
  const hasClusters = flaggedCount > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-4 w-4 text-[#42705e]" strokeWidth={1.8} />
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-700">
            Insider Clustering Analysis
          </h3>
        </div>
        {hasClusters && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              {flaggedCount} of {holders.length} clustered
            </span>
          </div>
        )}
      </div>

      {/* ── Holder Table ──────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Address</th>
              <th className="text-right px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Balance</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Tier</th>
              <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Funding Source</th>
              <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((h) => (
              <tr
                key={h.address}
                className={`border-b border-gray-50 transition-colors ${
                  h.cluster_flag
                    ? "bg-amber-50/50 hover:bg-amber-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-gray-700">
                    {truncateAddress(h.address)}
                  </span>
                </td>
                <td className="text-right px-4 py-3">
                  <span className="text-xs font-bold text-gray-800 tabular-nums">
                    {h.balance_pct.toFixed(1)}%
                  </span>
                </td>
                <td className="text-center px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tierBadge(h.tier)}`}>
                    {h.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link2 className={`h-3 w-3 shrink-0 ${h.cluster_flag ? "text-amber-500" : "text-gray-300"}`} />
                    <span className={`font-mono text-[11px] ${h.cluster_flag ? "text-amber-700 font-semibold" : "text-gray-400"}`}>
                      {truncateAddress(h.funding_source)}
                    </span>
                  </div>
                </td>
                <td className="text-center px-4 py-3">
                  {h.cluster_flag ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Flagged
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                      Clean
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
