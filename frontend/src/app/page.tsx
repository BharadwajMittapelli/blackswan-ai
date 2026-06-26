"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import EmptyState from "@/components/empty-state";
import ResultsSkeleton from "@/components/results-skeleton";
import ResultsView from "@/components/results-view";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const STORAGE_KEY = "blackswan_recent_scans";
const MAX_RECENT = 5;

/* ══════════════════════════════════════════════════════════════════════ */
/*  Dashboard Page                                                       */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [recentScans, setRecentScans] = useState<string[]>([]);

  /* ── Load recent scans from localStorage on mount ───────────────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecentScans(parsed.slice(0, MAX_RECENT));
      }
    } catch {
      /* ignore corrupt localStorage */
    }
  }, []);

  /* ── Persist recent scans ───────────────────────────────────────── */
  const pushRecentScan = useCallback((address: string) => {
    setRecentScans((prev) => {
      const filtered = prev.filter((a) => a.toLowerCase() !== address.toLowerCase());
      const next = [address, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* quota exceeded — silent */
      }
      return next;
    });
  }, []);

  /* ── Rotate loading status text every 1.2 s ─────────────────────── */
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % 7);
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

      /* Update input if triggered from sidebar */
      if (addressOverride) setTokenAddress(trimmed);

      setLoading(true);
      setReport(null);
      setLoadingMsgIndex(0);

      try {
        const res = await fetch(`${API_URL}/api/v1/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_address: trimmed }),
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        const reportText = data.report ?? "No report data returned.";
        setReport(reportText);
        pushRecentScan(trimmed);
      } catch {
        toast.error(
          "Analysis failed. Please check the contract address and try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [tokenAddress, pushRecentScan]
  );

  /* ── Sidebar callback ───────────────────────────────────────────── */
  const handleSelectToken = useCallback(
    (address: string) => {
      setTokenAddress(address);
      handleScan(address);
    },
    [handleScan]
  );

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <Sidebar recentScans={recentScans} onSelectToken={handleSelectToken} />

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header
          tokenAddress={tokenAddress}
          loading={loading}
          onAddressChange={setTokenAddress}
          onScan={() => handleScan()}
        />

        {/* ── Content Area ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          {loading && <ResultsSkeleton loadingMsgIndex={loadingMsgIndex} />}
          {report && !loading && <ResultsView report={report} />}
          {!report && !loading && <EmptyState />}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className="py-4 text-center text-[10px] text-[#475569] border-t border-[rgba(148,163,184,0.06)]">
          BlackSwan AI &middot; On-chain risk intelligence &middot; v2.0
        </footer>
      </main>
    </div>
  );
}
