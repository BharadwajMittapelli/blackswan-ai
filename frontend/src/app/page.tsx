"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import Header from "@/components/header";
import EmptyState from "@/components/empty-state";
import ResultsSkeleton from "@/components/results-skeleton";
import ResultsView from "@/components/results-view";
import ErrorState from "@/components/error-state";
import type { AnalysisResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ══════════════════════════════════════════════════════════════════════ */
/*  Risk Command Center                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  /* ── Rotate loading status text every 1.2 s ─────────────────────── */
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % 10);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  /* ── API call ───────────────────────────────────────────────────── */
  const handleScan = useCallback(
    async (addressOverride?: string) => {
      const trimmed = (addressOverride ?? tokenAddress).trim();
      if (!trimmed) {
        toast.error("Please enter a token contract address.");
        return;
      }

      if (addressOverride) setTokenAddress(trimmed);

      setLoading(true);
      setData(null);
      setError(null);
      setLoadingMsgIndex(0);

      try {
        const res = await fetch(`${API_URL}/api/v1/analyze`, {
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
      } catch (err: any) {
        setError(err.message || "Analysis failed. Please check the contract address and try again.");
        toast.error(err.message || "Analysis failed.");
      } finally {
        setLoading(false);
      }
    },
    [tokenAddress]
  );

  const isInitialState = !data && !loading && !error;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Header ────────────────────────────────────────────────── */}
      {!isInitialState && (
        <Header
          tokenAddress={tokenAddress}
          loading={loading}
          onAddressChange={setTokenAddress}
          onScan={() => handleScan()}
        />
      )}

      {/* ── Content Area ──────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
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
