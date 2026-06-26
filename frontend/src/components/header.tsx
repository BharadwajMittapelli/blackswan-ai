"use client";

import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  tokenAddress: string;
  loading: boolean;
  onAddressChange: (value: string) => void;
  onScan: () => void;
}

export default function Header({
  tokenAddress,
  loading,
  onAddressChange,
  onScan,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[rgba(148,163,184,0.1)] bg-[#0F172A]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <Input
            id="token-address-input"
            placeholder="Paste token contract address (0x…)"
            value={tokenAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onScan()}
            className="pl-10 h-11 text-sm bg-[#1E293B]/70 border-[rgba(148,163,184,0.15)] placeholder:text-[#4B5563] focus-visible:ring-[#38BDF8]/40 rounded-xl"
            disabled={loading}
          />
        </div>
        <Button
          id="scan-button"
          onClick={onScan}
          disabled={loading}
          className="h-11 px-5 text-sm font-semibold bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:from-[#38BDF8]/90 hover:to-[#818CF8]/90 text-[#0F172A] rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-[#38BDF8]/10"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
              Scanning…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Scan
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
