"use client";

import RiskGauge from "@/components/risk-gauge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ShieldAlert, TrendingDown, Droplets, Wallet } from "lucide-react";

/* ── Helpers ──────────────────────────────────────────────────────────── */
function extractRiskScore(report: string): number {
  /* Try to find a "Risk Score" of <number> or similar pattern */
  const patterns = [
    /risk\s*score[:\s]*(\d{1,3})\s*(?:\/\s*100)?/i,
    /(\d{1,3})\s*\/\s*100/i,
    /score[:\s]*(\d{1,3})/i,
  ];
  for (const pat of patterns) {
    const match = report.match(pat);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= 0 && num <= 100) return num;
    }
  }
  return 65; // sensible default when parsing fails
}

function detectCritical(report: string): boolean {
  const lower = report.toLowerCase();
  return lower.includes("critical") || lower.includes("catastrophic");
}

function countFindings(report: string): { tokenomics: number; onchain: number } {
  const lines = report.split("\n");
  let tokenomics = 0;
  let onchain = 0;
  let section = "";

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("tokenomic")) section = "tokenomics";
    else if (lower.includes("on-chain") || lower.includes("on chain") || lower.includes("liquidity")) section = "onchain";
    else if (lower.startsWith("##") || lower.startsWith("### conclusion") || lower.startsWith("### risk")) section = "";

    if (line.trim().startsWith("- **") || line.trim().startsWith("* **")) {
      if (section === "tokenomics") tokenomics++;
      else if (section === "onchain") onchain++;
    }
  }
  return { tokenomics, onchain };
}

interface ResultsViewProps {
  report: string;
}

export default function ResultsView({ report }: ResultsViewProps) {
  const score = extractRiskScore(report);
  const isCritical = detectCritical(report);
  const findings = countFindings(report);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 p-6">
      {/* ── Left Column: Asset Risk Profile ────────────────────── */}
      <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#1E293B]/50 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#64748B] text-center mb-5">
          Asset Risk Profile
        </h2>

        <RiskGauge score={score} isCritical={isCritical} />

        {/* ── Quick Stats ────────────────────────────────────────── */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0F172A]/50">
            <TrendingDown className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-[#64748B]">Tokenomics Flags</p>
              <p className="text-sm font-bold text-[#E2E8F0]">{findings.tokenomics}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0F172A]/50">
            <Droplets className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-[#64748B]">On-Chain Flags</p>
              <p className="text-sm font-bold text-[#E2E8F0]">{findings.onchain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0F172A]/50">
            <Wallet className="h-4 w-4 text-violet-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-[#64748B]">Verdict</p>
              <p className={`text-sm font-bold ${isCritical ? "text-red-400" : "text-emerald-400"}`}>
                {isCritical ? "Do Not Invest" : "Proceed with Caution"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Shield Badge ───────────────────────────────────────── */}
        <div className="mt-5 flex justify-center">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isCritical
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          }`}>
            <ShieldAlert className="h-3 w-3" />
            BlackSwan Verified
          </div>
        </div>
      </div>

      {/* ── Right Column: Full Report ─────────────────────────── */}
      <div className="rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[#1E293B]/50 p-6 md:p-8 overflow-auto">
        <article className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:bg-gradient-to-r prose-h1:from-[#38BDF8] prose-h1:to-[#818CF8] prose-h1:bg-clip-text prose-h1:text-transparent prose-h2:text-[#38BDF8] prose-h2:text-lg prose-strong:text-[#E2E8F0] prose-a:text-[#38BDF8] prose-code:text-[#F472B6] prose-code:bg-[#0F172A] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0F172A] prose-pre:border prose-pre:border-[rgba(148,163,184,0.15)] prose-th:text-[#94A3B8] prose-td:text-[#CBD5E1] prose-li:text-[#CBD5E1]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {report}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
