"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ── Rotating status messages for the loading state ─────────────────── */
const LOADING_MESSAGES = [
  "Fetching on-chain data…",
  "Querying DexScreener liquidity…",
  "Analyzing tokenomics supply…",
  "Checking CoinGecko metrics…",
  "Scanning wallet concentration…",
  "Evaluating vesting schedules…",
  "Synthesizing risk report…",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ══════════════════════════════════════════════════════════════════════ */
/*  Main Page                                                           */
/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  /* Rotate the loading status text every 1.2 s */
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  /* ── API call ──────────────────────────────────────────────────────── */
  const handleScan = useCallback(async () => {
    const trimmed = tokenAddress.trim();
    if (!trimmed) {
      toast.error("Please enter a token contract address.");
      return;
    }

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
      setReport(data.report ?? "No report data returned.");
    } catch {
      toast.error(
        "Analysis failed. Please check the contract address and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [tokenAddress]);

  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center pt-20 pb-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="h-10 w-10 text-[#38BDF8]" strokeWidth={1.5} />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
            BlackSwan AI
          </h1>
        </div>

        <p className="text-[#94A3B8] text-lg md:text-xl text-center max-w-2xl leading-relaxed">
          Don&apos;t ask what to buy.{" "}
          <span className="text-[#F472B6] font-semibold">
            Ask what can destroy your investment.
          </span>
        </p>
      </section>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl px-4 mb-12">
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
            <Input
              id="token-address-input"
              placeholder="Paste token contract address (0x…)"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              className="pl-10 h-14 text-base bg-[#1E293B] border-[rgba(148,163,184,0.2)] placeholder:text-[#64748B] focus-visible:ring-[#38BDF8]/50 rounded-xl"
              disabled={loading}
            />
          </div>
          <Button
            id="scan-button"
            onClick={handleScan}
            disabled={loading}
            className="h-14 px-6 text-base font-semibold bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:from-[#38BDF8]/90 hover:to-[#818CF8]/90 text-[#0F172A] rounded-xl transition-all duration-200 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                Scanning…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Scan Contract
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </section>

      {/* ── Loading State ───────────────────────────────────────────── */}
      {loading && (
        <section className="w-full max-w-3xl px-4 mb-12">
          <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#1E293B]/60 p-8 animate-pulse-glow">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-[#FBBF24] animate-pulse" />
              <p className="text-[#FBBF24] font-medium text-sm tracking-wide uppercase">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4 bg-[#334155]" />
              <Skeleton className="h-4 w-full bg-[#334155]" />
              <Skeleton className="h-4 w-5/6 bg-[#334155]" />
              <div className="pt-4 space-y-3">
                <Skeleton className="h-4 w-2/3 bg-[#334155]" />
                <Skeleton className="h-4 w-full bg-[#334155]" />
                <Skeleton className="h-4 w-4/5 bg-[#334155]" />
              </div>
              <div className="pt-4 space-y-3">
                <Skeleton className="h-5 w-1/2 bg-[#334155]" />
                <Skeleton className="h-4 w-full bg-[#334155]" />
                <Skeleton className="h-4 w-3/4 bg-[#334155]" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Report Output ───────────────────────────────────────────── */}
      {report && !loading && (
        <section className="w-full max-w-3xl px-4 pb-20">
          <div className="rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#1E293B]/60 p-8 md:p-10">
            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h1:bg-gradient-to-r prose-h1:from-[#38BDF8] prose-h1:to-[#818CF8] prose-h1:bg-clip-text prose-h1:text-transparent prose-h2:text-[#38BDF8] prose-strong:text-[#E2E8F0] prose-a:text-[#38BDF8] prose-code:text-[#F472B6] prose-code:bg-[#0F172A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0F172A] prose-pre:border prose-pre:border-[rgba(148,163,184,0.15)] prose-th:text-[#94A3B8] prose-td:text-[#CBD5E1]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {report}
              </ReactMarkdown>
            </article>
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 text-center text-sm text-[#475569]">
        BlackSwan AI &middot; On-chain risk intelligence
      </footer>
    </main>
  );
}
