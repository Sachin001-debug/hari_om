"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Tag, Check } from "lucide-react";
import { PRICE_PRESETS } from "@/data/locations";
import { formatPrice } from "@/lib/formatPrice";

export function PriceRangeFilter({
  minPrice = "",
  maxPrice = "",
  onPriceChange,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasActivePrice = Boolean(minPrice || maxPrice);

  const getLabel = () => {
    if (minPrice && maxPrice) {
      return `${formatPrice(minPrice, { prefix: "" })} - ${formatPrice(maxPrice, { prefix: "" })}`;
    }
    if (minPrice) return `> ${formatPrice(minPrice, { prefix: "" })}`;
    if (maxPrice) return `< ${formatPrice(maxPrice, { prefix: "" })}`;
    return "Price Range";
  };

  const handleSelectPreset = (preset) => {
    onPriceChange(preset.min, preset.max);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
          hasActivePrice
            ? "bg-accent-light border-accent text-accent-hover font-semibold shadow-xs"
            : "bg-surface border-border text-text hover:bg-bg hover:border-muted/40"
        }`}
      >
        <Tag className="w-3.5 h-3.5 shrink-0" />
        <span>{getLabel()}</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-surface rounded-2xl shadow-xl border border-border p-3 z-40 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
            Budget Presets
          </div>

          <div className="space-y-1">
            {PRICE_PRESETS.map((preset, idx) => {
              const isSelected =
                String(preset.min) === String(minPrice || "") &&
                String(preset.max) === String(maxPrice || "");

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-primary text-white font-medium"
                      : "text-text hover:bg-bg"
                  }`}
                >
                  <span>{preset.label}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          {hasActivePrice && (
            <div className="mt-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  onPriceChange("", "");
                  setIsOpen(false);
                }}
                className="w-full text-center py-1.5 text-xs text-muted hover:text-accent font-medium cursor-pointer"
              >
                Reset Price
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PriceRangeFilter;

