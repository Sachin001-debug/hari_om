"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building, ChevronDown, X } from "lucide-react";
import { CITIES, PROPERTY_TYPES } from "@/data/locations";
import { SearchSuggestions, saveRecentSearch } from "./SearchSuggestions";

export function SearchBar({
  city = "all",
  searchQuery = "",
  searchInput = "",
  propertyType = "all",
  listings = [],
  onCityChange,
  onSearchInputChange,
  onTypeChange,
  onAddArea,
  onSubmitSearch,
  className = "",
}) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      saveRecentSearch(searchInput.trim());
    }
    setIsFocused(false);
    if (onSubmitSearch) {
      onSubmitSearch();
    }
    // Smooth scroll to listings
    const listingsElement = document.getElementById("listings");
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectArea = (area) => {
    if (onAddArea) onAddArea(area);
    saveRecentSearch(area);
    setIsFocused(false);
    const listingsElement = document.getElementById("listings");
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectKeyword = (keyword) => {
    if (onSearchInputChange) onSearchInputChange(keyword);
    saveRecentSearch(keyword);
    setIsFocused(false);
    const listingsElement = document.getElementById("listings");
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectProperty = (prop) => {
    saveRecentSearch(prop.title);
    setIsFocused(false);
    if (prop.slug) {
      router.push(`/listings/${prop.slug}`);
    } else {
      if (onSearchInputChange) onSearchInputChange(prop.title);
      const listingsElement = document.getElementById("listings");
      if (listingsElement) {
        listingsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSelectRecent = (term) => {
    if (onSearchInputChange) onSearchInputChange(term);
    setIsFocused(false);
    const listingsElement = document.getElementById("listings");
    if (listingsElement) {
      listingsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleFormSubmit}
        className="bg-surface rounded-2xl md:rounded-full p-2.5 sm:p-3 shadow-2xl border border-white/40 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 transition-all focus-within:ring-2 focus-within:ring-primary/20"
      >
        {/* 1. City Select Dropdown */}
        <div className="relative flex items-center shrink-0 border-b md:border-b-0 md:border-r border-border/80 px-3 py-2 md:py-1">
          <MapPin className="w-4 h-4 text-accent shrink-0 mr-2" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
              Location
            </span>
            <div className="relative flex items-center">
              <select
                id="city-select"
                aria-label="Filter properties by city"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="bg-transparent font-semibold text-sm text-text pr-6 focus:outline-none cursor-pointer appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-0" />
            </div>
          </div>
        </div>

        {/* 2. Main Search Input */}
        <div className="relative flex-1 flex items-center px-3 py-2 md:py-1 min-w-0">
          <Search className="w-4 h-4 text-muted shrink-0 mr-2.5 hidden sm:block" />
          <div className="flex-1 flex flex-col text-left min-w-0">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
              Keyword, Area or Landmark
            </span>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={isFocused}
                aria-autocomplete="list"
                aria-controls="search-suggestions-dropdown"
                placeholder="Try 4 No., Charnumber, Mauwari, or Road facing..."
                value={searchInput}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => onSearchInputChange(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-medium text-text placeholder:text-muted/60 focus:outline-none truncate"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearchInputChange("")}
                  className="p-1 text-muted hover:text-text rounded-full hover:bg-bg ml-1"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Property Type Select Dropdown */}
        <div className="relative flex items-center shrink-0 border-t md:border-t-0 md:border-l border-border/80 px-3 py-2 md:py-1">
          <Building className="w-4 h-4 text-primary shrink-0 mr-2" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">
              Property Type
            </span>
            <div className="relative flex items-center">
              <select
                id="type-select"
                aria-label="Filter properties by type"
                value={propertyType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="bg-transparent font-semibold text-sm text-text pr-6 focus:outline-none cursor-pointer appearance-none"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted pointer-events-none absolute right-0" />
            </div>
          </div>
        </div>

        {/* 4. Action Button */}
        <div className="p-1 md:pl-2 shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 md:py-3.5 rounded-xl md:rounded-full font-semibold text-sm bg-accent hover:bg-accent-hover text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      <SearchSuggestions
        query={searchInput}
        city={city}
        listings={listings}
        isOpen={isFocused}
        onClose={() => setIsFocused(false)}
        onSelectArea={handleSelectArea}
        onSelectKeyword={handleSelectKeyword}
        onSelectProperty={handleSelectProperty}
        onSelectRecent={handleSelectRecent}
      />
    </div>
  );
}

export default SearchBar;

