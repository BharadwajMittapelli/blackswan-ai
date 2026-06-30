"use client";

import * as React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { AlertTriangle } from "lucide-react";
import type { HistoricalData, Anomaly } from "@/lib/types";

interface HistoricalActivityChartProps {
  data: HistoricalData[];
  anomalies: Anomaly[];
}

const chartConfig = {
  volume: {
    label: "Transfer Volume",
    color: "#047857", // Deep Emerald
  },
  txCount: {
    label: "Transfer Count",
    color: "#d946ef", // Fuchsia
  },
};

// Custom Tooltip Renderer
const CustomTooltip = ({ active, payload, label, anomalies }: { active?: boolean; payload?: { name: string; color: string; value: number }[]; label?: string; anomalies: Anomaly[] }) => {
  if (active && payload && payload.length) {
    const currentAnomaly = anomalies.find((a) => a.date === label);
    
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md max-w-[240px]">
        <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
        
        <div className="flex flex-col gap-1.5 mb-3">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-[10px] uppercase font-semibold text-gray-500">
                  {entry.name === "volume" ? "Volume" : "Tx Count"}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-800 tabular-nums">
                {entry.name === "volume" 
                  ? `$${(entry.value / 1000).toFixed(0)}k` 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>

        {currentAnomaly && (
          <div className="mt-2 rounded-md bg-rose-50 border border-rose-200 p-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="h-3 w-3 text-rose-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                {currentAnomaly.type}
              </span>
            </div>
            <p className="text-[10px] leading-tight text-rose-600">
              {currentAnomaly.description}
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function HistoricalActivityChart({ data, anomalies }: HistoricalActivityChartProps) {

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col w-full h-full">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-700">
          Historical Activity & AI Anomalies
        </h3>
        <p className="text-[10px] text-gray-400 mt-0.5">30-day transfer volume vs transaction frequency</p>
      </div>

      <ChartContainer config={chartConfig} className="w-full min-h-[300px] flex-1">
        <ComposedChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            dy={10}
            minTickGap={30}
          />
          
          {/* Left Axis: Volume */}
          <YAxis 
            yAxisId="volume" 
            orientation="left" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            width={45}
          />
          
          {/* Right Axis: Transaction Count */}
          <YAxis 
            yAxisId="txCount" 
            orientation="right" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            width={35}
          />
          
          <Tooltip content={<CustomTooltip anomalies={anomalies} />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          
          {/* Anomalies Reference Lines */}
          {anomalies.map((anomaly, idx) => (
            <ReferenceLine 
              key={`anomaly-${idx}`}
              x={anomaly.date} 
              yAxisId="volume"
              stroke="#e11d48" // Rose-600
              strokeDasharray="3 3" 
              strokeWidth={1.5}
            />
          ))}

          {/* Volume Bars */}
          <Bar 
            yAxisId="volume" 
            dataKey="volume" 
            fill="#047857" 
            radius={[2, 2, 0, 0]}
            maxBarSize={40}
          />
          
          {/* Count Line */}
          <Line 
            yAxisId="txCount" 
            type="monotone" 
            dataKey="tx_count" 
            stroke="#d946ef" 
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#d946ef", strokeWidth: 0 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
