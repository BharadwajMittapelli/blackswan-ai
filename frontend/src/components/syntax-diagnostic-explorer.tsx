"use client";

import { useState } from "react";
import { ProjectDiligenceMatrix, FunctionalAnnotation } from "@/lib/types";
import { ShieldCheck, ChevronRight, Activity, Wrench, Code2 } from "lucide-react";

interface SyntaxExplorerProps {
  data?: ProjectDiligenceMatrix;
}

export default function SyntaxDiagnosticExplorer({ data }: SyntaxExplorerProps) {
  const annotations = data?.syntax_annotations || [];
  const [activeId, setActiveId] = useState<string | null>(annotations.length > 0 ? annotations[0].annotation_id : null);

  // 3. Empty States & Fallbacks
  if (!data || annotations.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-900/50 bg-slate-950 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
          <ShieldCheck className="h-10 w-10 text-emerald-500" />
        </div>
        <h3 className="text-emerald-400 font-semibold text-lg">Zero Structural Anomalies Detected</h3>
        <p className="text-slate-400 text-sm mt-2 text-center max-w-sm">
          The code has been successfully parsed and verified against all structural syntax constraints.
        </p>
      </div>
    );
  }

  const activeAnnotation = annotations.find(a => a.annotation_id === activeId) || annotations[0];

  const getPriorityBadge = (level: string) => {
    const l = level.toUpperCase();
    if (l === "CRITICAL") {
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
    if (l === "HIGH") {
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
      
      {/* Section A: The Index Menu (Master) */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/30 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <h3 className="text-white font-semibold text-sm tracking-tight flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            Detected Patterns
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-none">
          <ul className="flex flex-col">
            {annotations.map((annotation: FunctionalAnnotation) => {
              const isActive = activeId === annotation.annotation_id;
              
              return (
                <li key={annotation.annotation_id}>
                  <button
                    onClick={() => setActiveId(annotation.annotation_id)}
                    className={`w-full text-left px-5 py-4 flex flex-col gap-2 border-b border-slate-800/50 transition-colors ${
                      isActive 
                        ? "bg-slate-800 border-l-2 border-l-indigo-500" 
                        : "hover:bg-slate-800/40 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-300 text-sm font-medium line-clamp-2 leading-snug">
                        {annotation.category_label}
                      </span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block w-max ${getPriorityBadge(annotation.priority_level)}`}>
                      {annotation.priority_level}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Section B: The Inspection Viewport (Detail) */}
      <div className="flex-1 flex flex-col bg-slate-950">
        
        {/* Detail Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col gap-1 bg-slate-900/40">
          <h2 className="text-white font-semibold text-lg">
            {activeAnnotation.category_label}
          </h2>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="font-mono text-indigo-400 text-xs bg-indigo-400/10 px-1.5 py-0.5 rounded">
              {activeAnnotation.location.function_name}
            </span>
            <span className="text-slate-500">
              (Lines {activeAnnotation.location.line_start} - {activeAnnotation.location.line_end})
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Code Sandbox */}
          <div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono">
                  {activeAnnotation.location.function_name}
                </span>
                <span className="text-slate-500 text-xs">
                  Lines {activeAnnotation.location.line_start}-{activeAnnotation.location.line_end}
                </span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-slate-300 font-mono text-sm leading-relaxed">
                  <code>{activeAnnotation.location.extracted_text_snippet}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Diagnostic Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Structural Analysis */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                Structural Analysis
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {activeAnnotation.structural_analysis}
              </p>
            </div>

            {/* Optimization Guidelines */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Optimization Guidelines
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                {activeAnnotation.optimization_guidelines}
              </p>
            </div>

          </div>

        </div>
      </div>
      
    </div>
  );
}
