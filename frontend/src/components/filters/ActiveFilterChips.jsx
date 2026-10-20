"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";

export function ActiveFilterChips({
  chips = [],
  onClearAll,
  className = "",
}) {
  if (!chips || chips.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 pt-3 pb-2 text-sm ${className}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 transition-all hover:bg-primary/15"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove filter ${chip.label}`}
            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover hover:underline ml-1 cursor-pointer transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear all</span>
      </button>
    </div>
  );
}

export default ActiveFilterChips;

