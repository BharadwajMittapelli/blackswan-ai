"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import Header from "@/components/header";
import PortfolioScanner from "@/components/portfolio-scanner";
import EmptyState from "@/components/empty-state";
import { useMockAccount } from "@/lib/use-mock-account";
import ResultsSkeleton from "@/components/results-skeleton";
import ResultsView from "@/components/results-view";
import ErrorState from "@/components/error-state";
import type { AnalysisResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ══════════════════════════════════════════════════════════════════════ */
/*  Risk Command Center                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const { isConnected, connect, disconnect, address } = useMockAccount();

  /* ── Rotate loading status text every 1.2 s ─────────────────────── */
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % 10);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleReset = useCallback(() => {
    setTokenAddress("");
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  /* ── API call ───────────────────────────────────────────────────── */
  const handleScan = useCallback(
    async (addressOverride?: string) => {
      const trimmed = (addressOverride ?? tokenAddress).trim();
      if (!trimmed) {
        toast.error("Please enter a token ticker or contract address.");
        return;
      }

      if (addressOverride) setTokenAddress(trimmed);

      setLoading(true);
      setData(null);
      setError(null);
      setLoadingMsgIndex(0);

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: trimmed }),
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Could not resolve this ticker to an active liquidity pair. Try pasting the direct contract address.");
          }
          throw new Error(`Server responded with ${res.status}. Please try again.`);
        }

        const json = await res.json();

        /* Validate structure */
        if (!json.markdown_report || typeof json.top_100_concentration !== "number") {
          throw new Error("Received an unexpected response format from the API.");
        }

        setData(json as AnalysisResponse);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Analysis failed.";
        setError(message || "Analysis failed. Please check the contract address and try again.");
        toast.error(message || "Analysis failed.");
      } finally {
        setLoading(false);
      }
    },
    [tokenAddress]
  );

  const isInitialState = !data && !loading && !error;

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* ── Floating Connect Button (Initial State) ───────────────── */}
      {isInitialState && (
        <div className="absolute top-4 right-6 z-50">
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
      )}

      {/* ── Header ────────────────────────────────────────────────── */}
      {!isInitialState && (
        <Header
          tokenAddress={tokenAddress}
          loading={loading}
          onAddressChange={setTokenAddress}
          onScan={() => handleScan()}
          onHome={handleReset}
        />
      )}

      {/* ── Content Area ──────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        <PortfolioScanner onScan={(address) => handleScan(address)} />
        {loading && <ResultsSkeleton loadingMsgIndex={loadingMsgIndex} />}
        {data && !loading && <ResultsView data={data} />}
        {error && !loading && <ErrorState message={error} />}
        {isInitialState && (
          <EmptyState
            tokenAddress={tokenAddress}
            onAddressChange={setTokenAddress}
            onScan={() => handleScan()}
          />
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-3 text-center text-[10px] text-gray-400 border-t border-gray-200">
        BlackSwan AI &middot; On-chain risk intelligence &middot; v2.0
      </footer>
    </div>
  );
}
