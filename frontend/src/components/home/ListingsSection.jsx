"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FilterBar } from "@/components/filters/FilterBar";
import { ActiveFilterChips } from "@/components/filters/ActiveFilterChips";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { ListingGridSkeleton } from "@/components/listings/ListingSkeleton";
import { EmptyState } from "@/components/listings/EmptyState";
import { FadeIn } from "@/components/ui/FadeIn";

export function ListingsSection({ filterState }) {
  const {
    city,
    selectedAreas,
    searchQuery,
    propertyType,
    sortBy,
    minPrice,
    maxPrice,
    negotiableOnly,
    bedrooms,
    facing,
    featured,
    listings,
    totalCount,
    availableCount,
    isLoading,
    activeChips,
    activeFilterCount,
    setPropertyType,
    setSortBy,
    toggleNegotiableOnly,
    setPriceRange,
    toggleArea,
    clearAllFilters,
    updateUrlParams,
    setSearchInput,
  } = filterState;

  const handleSuggestionClick = (tag) => {
    if (tag.toLowerCase() === "all butwal") {
      updateUrlParams({ city: "butwal", q: null, area: null });
    } else if (tag.toLowerCase() === "houses") {
      updateUrlParams({ type: "house" });
    } else if (tag.toLowerCase() === "plots") {
      updateUrlParams({ type: "plot" });
    } else {
      updateUrlParams({ q: tag });
      setSearchInput(tag);
    }
  };

  return (
    <section id="listings" className="py-16 sm:py-24 bg-bg scroll-mt-12">
      <Container>
        {/* Section Heading */}
        <FadeIn direction="up">
          <SectionHeading
            eyebrow="Explore Portfolio"
            title="Featured Properties & Plots"
            subtitle="Browse verified residential plots, commercial properties, and boutique homes across Butwal, Tilottama, and Bhairahawa."
          />
        </FadeIn>

        {/* Filter Controls Bar */}
        <div className="mb-6">
          <FilterBar
            city={city}
            selectedAreas={selectedAreas}
            propertyType={propertyType}
            minPrice={minPrice}
            maxPrice={maxPrice}
            negotiableOnly={negotiableOnly}
            bedrooms={bedrooms}
            facing={facing}
            featured={featured}
            sortBy={sortBy}
            totalResults={totalCount}
            availableTotal={availableCount}
            activeFilterCount={activeFilterCount}
            onTypeChange={setPropertyType}
            onPriceChange={setPriceRange}
            onNegotiableToggle={toggleNegotiableOnly}
            onSortChange={setSortBy}
            onToggleArea={toggleArea}
            onBedroomsChange={(beds) => updateUrlParams({ bedrooms: beds })}
            onFacingChange={(face) => updateUrlParams({ facing: face })}
            onFeaturedChange={(feat) => updateUrlParams({ featured: feat })}
            onResetAll={clearAllFilters}
          />

          {/* Active Chips */}
          <ActiveFilterChips chips={activeChips} onClearAll={clearAllFilters} />
        </div>

        {/* Listing Grid / Skeleton / Empty State */}
        <div className="mt-8">
          {isLoading ? (
            <ListingGridSkeleton count={6} />
          ) : totalCount > 0 ? (
            <ListingGrid listings={listings} />
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              onClearFilters={clearAllFilters}
              onSelectSuggestion={handleSuggestionClick}
            />
          )}
        </div>
      </Container>
    </section>
  );
}

export default ListingsSection;

