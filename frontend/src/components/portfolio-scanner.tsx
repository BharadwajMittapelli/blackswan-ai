"use client";

import { Wallet } from "lucide-react";
import { useMockAccount } from "@/lib/use-mock-account";

interface PortfolioScannerProps {
  onScan: (address: string) => void;
}

export default function PortfolioScanner({ onScan }: PortfolioScannerProps) {
  const { isConnected } = useMockAccount();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 p-6 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[#10b981]" />
          <h3 className="text-white text-sm font-semibold tracking-wide">
            Portfolio Assets Detected
          </h3>
        </div>
          <p className="text-slate-400 text-xs">
            Select an asset below to run a deep-dive security risk audit.
          </p>

          <div className="flex flex-row flex-wrap justify-center gap-4 mt-2 w-full">
            <button
              onClick={() => onScan("0xreentrancyvault000000000000000000000000")}
              className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 hover:border-[#10b981] hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-4 flex flex-col items-start gap-1 cursor-pointer"
            >
              <span className="text-white font-bold text-sm">$VAULT</span>
              <span className="text-slate-400 text-xs font-medium">Yield Aggregator</span>
            </button>
            <button
              onClick={() => onScan("0xungatedminttoken0000000000000000000000")}
              className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 hover:border-[#10b981] hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-4 flex flex-col items-start gap-1 cursor-pointer"
            >
              <span className="text-white font-bold text-sm">$MEME</span>
              <span className="text-slate-400 text-xs font-medium">Community Token</span>
            </button>
            <button
              onClick={() => onScan("0xsecureerc20asset0000000000000000000000")}
              className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 hover:border-[#10b981] hover:bg-slate-800/50 transition-all duration-200 rounded-lg p-4 flex flex-col items-start gap-1 cursor-pointer"
            >
              <span className="text-white font-bold text-sm">$USDC</span>
              <span className="text-slate-400 text-xs font-medium">Stablecoin</span>
            </button>
        </div>
      </div>
    </div>
  );
}
