"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PROPERTY_TYPES } from "@/data/locations";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SortSelect } from "./SortSelect";
import { FilterDrawer } from "./FilterDrawer";

export function FilterBar({
  city = "all",
  selectedAreas = [],
  propertyType = "all",
  minPrice = "",
  maxPrice = "",
  negotiableOnly = false,
  bedrooms = "",
  facing = "",
  featured = false,
  sortBy = "newest",
  totalResults = 0,
  availableTotal = 0,
  activeFilterCount = 0,
  onTypeChange,
  onPriceChange,
  onNegotiableToggle,
  onSortChange,
  onToggleArea,
  onBedroomsChange,
  onFacingChange,
  onFeaturedChange,
  onResetAll,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        {/* Property type tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = propertyType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeChange(type.id)}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white font-medium"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Secondary controls */}
        <div className="flex flex-wrap items-center gap-2">
          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
          />

          <button
            type="button"
            onClick={onNegotiableToggle}
            aria-pressed={negotiableOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
              negotiableOnly
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                negotiableOnly ? "bg-orange-500" : "bg-slate-300"
              }`}
            />
            <span>Negotiable</span>
            {negotiableOnly && <X className="w-3 h-3" />}
          </button>

          <SortSelect sortBy={sortBy} onSortChange={onSortChange} />

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs sm:text-sm text-slate-500 px-1">
        Showing <span className="font-medium text-slate-900">{totalResults}</span>{" "}
        of{" "}
        <span className="font-medium text-slate-900">{availableTotal}</span>{" "}
        properties
      </div>

      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        city={city}
        selectedAreas={selectedAreas}
        bedrooms={bedrooms}
        facing={facing}
        featured={featured}
        negotiableOnly={negotiableOnly}
        resultCount={totalResults}
        onToggleArea={onToggleArea}
        onBedroomsChange={onBedroomsChange}
        onFacingChange={onFacingChange}
        onFeaturedChange={onFeaturedChange}
        onNegotiableChange={onNegotiableToggle}
        onReset={onResetAll}
      />
    </div>
  );
}

export default FilterBar;