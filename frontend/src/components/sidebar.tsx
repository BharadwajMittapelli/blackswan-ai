"use client";

import { ShieldAlert, Clock, Zap, ExternalLink } from "lucide-react";

/* ── Demo Sandbox Tokens ─────────────────────────────────────────────── */
const DEMO_TOKENS = [
  {
    name: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    color: "from-green-400 to-emerald-500",
  },
  {
    name: "SHIB",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    color: "from-orange-400 to-amber-500",
  },
  {
    name: "UNI",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    color: "from-pink-400 to-rose-500",
  },
];

interface SidebarProps {
  recentScans: string[];
  onSelectToken: (address: string) => void;
}

export default function Sidebar({ recentScans, onSelectToken }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0F172A] border-r border-[rgba(148,163,184,0.1)] flex flex-col z-40">
      {/* ── Brand ──────────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-5 border-b border-[rgba(148,163,184,0.1)]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShieldAlert className="h-8 w-8 text-[#38BDF8]" strokeWidth={1.5} />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-[#0F172A] animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
              BlackSwan AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#475569] font-medium">
              Risk Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Scans ───────────────────────────────────────────── */}
      <div className="px-4 pt-5 flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="h-3.5 w-3.5 text-[#64748B]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
              Recent Scans
            </span>
          </div>

          {recentScans.length === 0 ? (
            <p className="text-[12px] text-[#475569] italic px-1">
              No scans yet. Try a demo token below.
            </p>
          ) : (
            <ul className="space-y-1">
              {recentScans.map((address, i) => (
                <li key={`${address}-${i}`}>
                  <button
                    onClick={() => onSelectToken(address)}
                    className="w-full group flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-[12px] font-mono text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#E2E8F0] transition-all duration-150 cursor-pointer"
                  >
                    <span className="truncate flex-1">
                      {address.slice(0, 6)}…{address.slice(-4)}
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Demo Sandbox ───────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Zap className="h-3.5 w-3.5 text-[#64748B]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
              Demo Sandbox
            </span>
          </div>

          <div className="flex flex-wrap gap-2 px-1">
            {DEMO_TOKENS.map((token) => (
              <button
                key={token.address}
                onClick={() => onSelectToken(token.address)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-gradient-to-r ${token.color} text-[#0F172A] hover:scale-105 active:scale-95 transition-transform duration-150 shadow-lg shadow-black/20 cursor-pointer`}
              >
                {token.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-t border-[rgba(148,163,184,0.1)]">
        <p className="text-[10px] text-[#475569] text-center">
          v2.0 &middot; On-Chain Risk Engine
        </p>
      </div>
    </aside>
  );
}
