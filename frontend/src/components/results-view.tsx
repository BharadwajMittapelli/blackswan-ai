"use client";

import StatGrid from "@/components/stat-grid";
import InsiderClusteringCard from "@/components/insider-clustering-card";
import EscapeVelocityWidget from "@/components/escape-velocity-widget";
import { HistoricalActivityChart } from "@/components/historical-activity-chart";
import FundamentalAuditMatrix from "@/components/fundamental-audit-matrix";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Terminal } from "lucide-react";
import type { AnalysisResponse } from "@/lib/types";
import SyntaxDiagnosticExplorer from "@/components/syntax-diagnostic-explorer";

interface ResultsViewProps {
  data: AnalysisResponse;
}

export default function ResultsView({ data }: ResultsViewProps) {
  return (
    <div className="flex flex-col gap-5 p-6">
      {/* ── Top Row: Stats + Escape Velocity ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 px-1">
            Holders Overview
          </p>
          <StatGrid
            top100={data.top_100_concentration}
            whale={data.whale_concentration}
            gini={data.gini_index}
          />
        </div>

        {/* Escape Velocity */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400 px-1 opacity-0 hidden lg:block">
            Escape Velocity
          </p>
          {data.escape_velocity && (
            <EscapeVelocityWidget data={data.escape_velocity} />
          )}
        </div>
      </div>

      {/* ── Middle Row: Insider Clustering & Historical Chart ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <InsiderClusteringCard holders={data.holders} />
        <HistoricalActivityChart data={data.historical_data} anomalies={data.anomalies} />
      </div>

      {/* ── Fundamental Audit Matrix & Syntax Explorer ──────────────────────────── */}
      <div className="mb-5 flex flex-col gap-5">
        <FundamentalAuditMatrix data={data.fundamental_audit} />
        <SyntaxDiagnosticExplorer data={data.diligence_matrix} />
      </div>

      {/* ── Bottom Row: AI Narrative Terminal ───────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Terminal chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/60">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <Terminal className="h-3 w-3 text-gray-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">
              AI Narrative Report
            </span>
          </div>
        </div>

        {/* Markdown body */}
        <div className="p-6 md:p-8 overflow-auto max-h-[600px]">
          <article className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-xl prose-h1:text-[#42705e] prose-h2:text-[#42705e] prose-h2:text-base prose-h3:text-gray-800 prose-strong:text-gray-800 prose-a:text-[#42705e] prose-code:text-rose-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-th:text-gray-500 prose-td:text-gray-700 prose-li:text-gray-600 prose-p:text-gray-600 prose-li:marker:text-[#42705e]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.markdown_report}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
