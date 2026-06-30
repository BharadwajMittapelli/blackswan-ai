"use client";

import { Search, ArrowRight, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useMockAccount } from "@/lib/use-mock-account";

interface HeaderProps {
  tokenAddress: string;
  loading: boolean;
  onAddressChange: (value: string) => void;
  onScan: () => void;
  onHome?: () => void;
}

export default function Header({
  tokenAddress,
  loading,
  onAddressChange,
  onScan,
  onHome,
}: HeaderProps) {
  const { isConnected, connect, disconnect, address } = useMockAccount();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 py-3">
        {/* ── Brand ──────────────────────────────────────────────── */}
        <div 
          className="flex items-center gap-2.5 mr-4 shrink-0 cursor-pointer" 
          onClick={onHome}
        >
          <div className="relative">
            <ShieldAlert className="h-7 w-7 text-[#42705e]" strokeWidth={1.5} />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-gray-900">
              BlackSwan<span className="text-[#42705e]"> AI</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium -mt-0.5">
              Risk Command Center
            </p>
          </div>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────── */}
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="token-address-input"
            placeholder="Enter token ticker or contract address (e.g., PEPE, WIF, or 0x...)"
            value={tokenAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onScan()}
            className="pl-10 h-10 text-sm font-semibold text-gray-900 bg-gray-50 border-gray-200 placeholder:text-gray-400 focus-visible:ring-[#42705e]/30 rounded-lg"
            disabled={loading}
          />
        </div>

        {/* ── Scan CTA ───────────────────────────────────────────── */}
        <Button
          id="scan-button"
          onClick={onScan}
          disabled={loading}
          className="h-10 px-5 text-sm font-semibold bg-[#42705e] hover:bg-[#376251] text-white rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Scanning…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Scan
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
        {/* ── Mock Wallet Connection Button ────────────────────────── */}
        <div className="hidden sm:block">
          {isConnected ? (
            <button
              onClick={disconnect}
              className="bg-slate-900 border border-slate-800 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-sm hover:border-[#10b981] transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              {address}
            </button>
          ) : (
            <button
              onClick={connect}
              className="bg-[#10b981] hover:bg-[#059669] text-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Mock Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
