"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TokenOption {
  symbol: string;
  name: string;
  address?: string;
}

export const POPULAR_TOKENS: TokenOption[] = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana", address: "So11111111111111111111111111111111111111112" },
  { symbol: "PEPE", name: "Pepe" },
  { symbol: "WIF", name: "dogwifhat" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "SHIB", name: "Shiba Inu" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "LINK", name: "Chainlink" },
];

interface TokenSearchProps {
  tokens: TokenOption[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  onScan: () => void;
  placeholder?: string;
  className?: string;
}

export default function TokenSearch({
  tokens,
  value,
  onChange,
  onSelect,
  onScan,
  placeholder,
  className,
}: TokenSearchProps) {
  const [query, setQuery] = useState(value);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal state with prop
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounce the query for filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter tokens based on debounced query
  const filteredTokens = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const lowerQuery = debouncedQuery.toLowerCase();
    return tokens
      .filter(
        (token) =>
          token.symbol.toLowerCase().includes(lowerQuery) ||
          token.name.toLowerCase().includes(lowerQuery) ||
          (token.address && token.address.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 5);
  }, [debouncedQuery, tokens]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredTokens.length === 0) {
      if (e.key === "Enter") {
        onScan();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredTokens.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredTokens.length) % filteredTokens.length
        );
        break;
      case "Enter":
        e.preventDefault();
        const selected = filteredTokens[selectedIndex];
        handleSelect(selected.symbol);
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setSelectedIndex(0);
  };

  const handleSelect = (val: string) => {
    setQuery(val);
    onChange(val);
    onSelect(val);
    setIsOpen(false);
  };

  return (
    <div
      className="w-full relative flex items-center"
      ref={containerRef}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
      <Input
        id="hero-token-input"
        placeholder={placeholder || "Enter token ticker or contract address (e.g., PEPE, WIF, or 0x...)"}
        value={query}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className={className || "pl-12 pr-24 h-14 text-base font-semibold text-gray-900 bg-white border-gray-200 placeholder:text-gray-400 focus-visible:ring-[#42705e]/30 rounded-xl w-full shadow-sm"}
        autoComplete="off"
      />

      {/* Dropdown Menu */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {filteredTokens.length > 0 ? (
            <ul className="py-1 m-0">
              {filteredTokens.map((token, index) => (
                <li
                  key={token.symbol + token.name}
                  onClick={() => handleSelect(token.symbol)}
                  className={`px-4 py-3 cursor-pointer flex flex-col ${
                    index === selectedIndex
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {token.symbol}{" "}
                    <span className="font-normal text-gray-500">
                      ({token.name})
                    </span>
                  </span>
                  {token.address && (
                    <span className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {token.address}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            debouncedQuery && (
              <div className="px-4 py-4 text-sm text-gray-500 text-center">
                No tokens found
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
