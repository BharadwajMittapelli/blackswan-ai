"use client";

import { useState } from "react";
import { FundamentalAudit } from "@/lib/types";
import { AlertTriangle, CheckCircle, ShieldAlert, GitBranch, Fingerprint, Code2, Coins, Activity } from "lucide-react";

interface MatrixProps {
  data?: FundamentalAudit;
}

export default function FundamentalAuditMatrix({ data }: MatrixProps) {
  const [activeTab, setActiveTab] = useState<"team" | "technology" | "tokenomics" | "roadmap">("team");

  // Defensive fallback state
  if (!data) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-center justify-center min-h-[300px] mt-2 mb-2">
        <Activity className="h-8 w-8 text-slate-500 mb-4 opacity-50" />
        <h3 className="text-slate-300 font-medium">Diligence Data Pending</h3>
        <p className="text-slate-500 text-sm mt-2 text-center max-w-sm">
          Awaiting the backend engine to complete its fundamental synthesis pass.
        </p>
      </div>
    );
  }

  const { team, technology, tokenomics, roadmap } = data;

  const tabs = [
    { id: "team", label: "Team & Entity", icon: Fingerprint },
    { id: "technology", label: "Tech Security", icon: Code2 },
    { id: "tokenomics", label: "Tokenomics", icon: Coins },
    { id: "roadmap", label: "Roadmap", icon: GitBranch },
  ] as const;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col mt-2 mb-2">
      <div className="px-5 py-4 border-b border-slate-800">
        <h2 className="text-white font-semibold text-lg tracking-tight mb-4">
          Institutional Fundamental Audit Matrix
        </h2>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "team" | "technology" | "tokenomics" | "roadmap")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 min-h-[250px]">
        {/* TEAM TAB */}
        {activeTab === "team" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start justify-between mb-6">
              <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
                {team.summary_text}
              </p>
              <div
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5 ${
                  team.status === "Verified"
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                    : team.status === "Anonymous"
                    ? "bg-amber-950/40 text-amber-400 border border-amber-900/50"
                    : "bg-rose-950/40 text-rose-400 border border-rose-900/50"
                }`}
              >
                {team.status === "Verified" ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {team.status}
              </div>
            </div>

            {team.anomalies_detected && team.anomalies_detected.length > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-slate-200 font-medium text-sm flex items-center gap-2 mb-3">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  Detected Anomalies
                </h4>
                <ul className="space-y-2">
                  {team.anomalies_detected.map((anomaly, idx) => (
                    <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {anomaly}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TECHNOLOGY TAB */}
        {activeTab === "technology" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Contract Status</span>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  {technology.contract_verification ? (
                    <><CheckCircle className="h-4 w-4 text-emerald-400" /> Verified Source</>
                  ) : (
                    <><AlertTriangle className="h-4 w-4 text-rose-400" /> Unverified Bytecode</>
                  )}
                </div>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Compiler Risk</span>
                <span className="font-mono text-xs bg-slate-950 text-slate-300 px-2 py-1 rounded border border-slate-800 inline-flex">
                  {technology.compiler_version_risk}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Vulnerabilities</span>
              {technology.vulnerabilities && technology.vulnerabilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {technology.vulnerabilities.map((vuln, idx) => {
                    const isHighRisk = vuln.toLowerCase().includes("honeypot") || vuln.toLowerCase().includes("mint");
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1.5 rounded-md border ${
                          isHighRisk 
                            ? "bg-rose-950/40 text-rose-400 border-rose-900/50 font-medium" 
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}
                      >
                        {vuln}
                      </span>
                    )
                  })}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No static vulnerabilities flagged in bytecode analysis.</p>
              )}
            </div>
          </div>
        )}

        {/* TOKENOMICS TAB */}
        {activeTab === "tokenomics" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col md:flex-row gap-6">
            <div className={`p-5 rounded-xl border flex-shrink-0 flex flex-col items-center justify-center min-w-[160px] ${
              tokenomics.is_unbalanced 
                ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                : "bg-slate-800/50 border-slate-700"
            }`}>
              <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 text-center">Insider<br/>Allocation</span>
              <span className={`text-3xl font-bold tracking-tight ${tokenomics.is_unbalanced ? "text-amber-400" : "text-emerald-400"}`}>
                {tokenomics.insider_allocation_pct}%
              </span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Vesting & Integrity Narrative</span>
              <blockquote className="border-l-2 border-slate-700 pl-4 py-1">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {tokenomics.cliff_and_vesting_risk}
                </p>
              </blockquote>
            </div>
          </div>
        )}

        {/* ROADMAP TAB */}
        {activeTab === "roadmap" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">GitHub Velocity:</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  {roadmap.github_velocity_status === "Active" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  {roadmap.github_velocity_status === "Stalled" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    roadmap.github_velocity_status === "Active" ? "bg-emerald-500" :
                    roadmap.github_velocity_status === "Stalled" ? "bg-amber-500" :
                    "bg-slate-500"
                  }`}></span>
                </span>
                <span className="text-slate-300 text-sm font-medium">{roadmap.github_velocity_status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Unmet Whitepaper Milestones</span>
              {roadmap.unmet_milestones && roadmap.unmet_milestones.length > 0 ? (
                <ul className="space-y-2">
                  {roadmap.unmet_milestones.map((milestone, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className="mt-0.5 h-4 w-4 rounded-sm border border-slate-600 bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {/* Empty checkbox look */}
                      </div>
                      <span className="text-slate-300 text-sm">{milestone}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 text-sm italic">All tracked public milestones currently appear to be met.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
