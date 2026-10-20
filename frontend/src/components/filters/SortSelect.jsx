"use client";

import React from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "@/data/locations";

export function SortSelect({
  sortBy = "newest",
  onSortChange,
  className = "",
}) {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="relative flex items-center bg-surface border border-border rounded-xl px-3 py-2 text-xs sm:text-sm hover:border-muted/40 transition-colors">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted mr-1.5 shrink-0" />
        <span className="text-muted mr-1.5 hidden md:inline text-xs">Sort:</span>
        <select
          aria-label="Sort listings"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-transparent font-medium text-text pr-5 focus:outline-none cursor-pointer appearance-none text-xs sm:text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-2.5" />
      </div>
    </div>
  );
}

export default SortSelect;

