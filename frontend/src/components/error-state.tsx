"use client";

import { AlertOctagon } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20">
      <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
        <AlertOctagon className="h-10 w-10 text-rose-400" strokeWidth={1.2} />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-2 tracking-tight">
        Analysis Failed
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-md mb-4">
        {message}
      </p>
      <p className="text-xs text-gray-400 text-center max-w-sm">
        Try a different ticker symbol or paste a direct contract address (e.g., 0x…).
      </p>
    </div>
  );
}
