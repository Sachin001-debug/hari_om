"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AREAS_BY_CITY } from "@/data/locations";

const FACING_OPTIONS = ["All", "East", "West", "North", "South", "North-East", "South-East"];
const BEDROOM_OPTIONS = [
  { label: "Any", value: "" },
  { label: "2+ Beds", value: "2" },
  { label: "3+ Beds", value: "3" },
  { label: "4+ Beds", value: "4" },
  { label: "5+ Beds", value: "5" },
];

export function FilterDrawer({
  isOpen = false,
  onClose,
  city = "all",
  selectedAreas = [],
  bedrooms = "",
  facing = "",
  featured = false,
  negotiableOnly = false,
  resultCount = 0,
  onToggleArea,
  onBedroomsChange,
  onFacingChange,
  onFeaturedChange,
  onNegotiableChange,
  onReset,
}) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const availableAreas = AREAS_BY_CITY[city] || AREAS_BY_CITY.all;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary-dark/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer content (Right side on desktop, bottom sheet on mobile) */}
      <div className="relative w-full max-w-md bg-surface h-full sm:h-auto sm:max-h-[92vh] sm:my-auto sm:mr-4 sm:rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-accent" />
            <h3 className="font-serif font-bold text-lg text-primary">
              All Filters
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:text-text rounded-full hover:bg-bg transition-colors cursor-pointer"
            aria-label="Close filters drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* 1. Specific Local Areas */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Select Local Areas ({city === "all" ? "All Cities" : city})
            </label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {availableAreas.map((areaName) => {
                const isSelected = selectedAreas.some(
                  (a) => a.toLowerCase() === areaName.toLowerCase()
                );
                return (
                  <button
                    key={areaName}
                    type="button"
                    onClick={() => onToggleArea(areaName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-bg text-text border-border hover:border-muted"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{areaName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Bedrooms for Houses */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Bedrooms (for Houses)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BEDROOM_OPTIONS.map((opt) => {
                const isSelected = String(bedrooms) === String(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onBedroomsChange(opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface text-text border-border hover:bg-bg"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Facing Direction */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Facing Direction
            </label>
            <div className="flex flex-wrap gap-2">
              {FACING_OPTIONS.map((f) => {
                const val = f === "All" ? "" : f;
                const isSelected = facing.toLowerCase() === val.toLowerCase();
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onFacingChange(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-accent text-white border-accent"
                        : "bg-surface text-text border-border hover:bg-bg"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Special Toggles */}
          <div className="pt-2 border-t border-border space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-bg border border-border cursor-pointer hover:border-muted/50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-text block">
                  Price Negotiable Only
                </span>
                <span className="text-xs text-muted block">
                  Show listings with flexible asking price
                </span>
              </div>
              <input
                type="checkbox"
                checked={negotiableOnly}
                onChange={(e) => onNegotiableChange(e.target.checked)}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-bg border border-border cursor-pointer hover:border-muted/50 transition-colors">
              <div>
                <span className="text-sm font-semibold text-text block">
                  Featured Properties
                </span>
                <span className="text-xs text-muted block">
                  Curated premium and exclusive listings
                </span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => onFeaturedChange(e.target.checked)}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-border bg-surface flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-medium text-muted hover:text-text px-3 py-2 cursor-pointer"
          >
            Reset All
          </button>

          <Button
            variant="accent"
            size="md"
            onClick={onClose}
            className="flex-1 font-semibold"
          >
            Show {resultCount} Properties
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FilterDrawer;

