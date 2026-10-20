"use client";

import React from "react";
import { useListingFilters } from "@/hooks/useListingFilters";
import { Hero } from "@/components/home/Hero";
import { ListingsSection } from "@/components/home/ListingsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export function HomePageClient() {
  const filterState = useListingFilters();

  return (
    <>
      {/* 1. Hero with overlapping search bar */}
      <Hero
        city={filterState.city}
        searchQuery={filterState.searchQuery}
        searchInput={filterState.searchInput}
        propertyType={filterState.propertyType}
        listings={filterState.listings}
        onCityChange={filterState.setCity}
        onSearchInputChange={filterState.setSearchInput}
        onTypeChange={filterState.setPropertyType}
        onAddArea={filterState.toggleArea}
        onSubmitSearch={() => {
          if (filterState.searchInput) {
            filterState.updateUrlParams({ q: filterState.searchInput });
          }
        }}
      />

      {/* 2. Primary Listings Section with Interactive Filter Systems */}
      <ListingsSection filterState={filterState} />

      {/* 3. Short boutique "Why choose us" strip */}
      <WhyChooseUs />
    </>
  );
}

export default HomePageClient;

