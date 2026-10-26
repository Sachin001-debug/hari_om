"use client";

import { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { listings as allListings } from "@/data/listings";
import { getListings } from "@/lib/listingService";
import { filterListings } from "@/lib/filterListings";
import { useDebounce } from "./useDebounce";
import { formatPrice } from "@/lib/formatPrice";

/**
 * Primary hook managing real estate listing filters, URL query synchronization,
 * debounced search inputs, and results computation.
 */
export function useListingFilters(initialListings = null) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
  const [dataListings, setDataListings] = useState(initialListings || allListings);

  // Load fresh properties from real database API
  useEffect(() => {
    let isMounted = true;
    async function loadFreshListings() {
      try {
        const result = await getListings();
        if (isMounted && result?.listings?.length) {
          setDataListings(result.listings);
        }
      } catch {
        // preserve fallback
      }
    }
    loadFreshListings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Parse state from URL search params
  const currentCity = searchParams.get("city") || "all";
  const currentQ = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentNegotiable = searchParams.get("negotiable") === "true";
  const currentBedrooms = searchParams.get("bedrooms") || "";
  const currentFacing = searchParams.get("facing") || "";
  const currentFeatured = searchParams.get("featured") === "true";

  // Support comma-separated areas or multiple "area" params
  const currentAreas = useMemo(() => {
    const raw = searchParams.get("area") || searchParams.get("areas");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [searchParams]);

  // Local state for immediate input feedback in text search
  const [searchInput, setSearchInput] = useState(currentQ);
  const debouncedSearchInput = useDebounce(searchInput, 280);

  // Keep local search input in sync if URL changes externally (e.g. back button, chip remove)
  useEffect(() => {
    setSearchInput(currentQ);
  }, [currentQ]);

  /**
   * Pushes updated filter parameters to the URL
   */
  const updateUrlParams = useCallback(
    (updates = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      // If updates specify null, undefined, or empty string, delete that key
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "" || value === "all" || value === false) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            params.delete(key);
          } else {
            params.set(key, value.join(","));
          }
        } else {
          params.set(key, String(value));
        }
      }

      // Preserve hash if user is already at #listings
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}#listings` : `${pathname}#listings`;

      setIsSimulatingLoad(true);
      startTransition(() => {
        router.push(newUrl, { scroll: false });
      });

      // Brief simulated fetch delay for premium UI feel
      const timer = setTimeout(() => {
        setIsSimulatingLoad(false);
      }, 200);

      return () => clearTimeout(timer);
    },
    [searchParams, pathname, router]
  );

  // Sync debounced search input to URL if it differs from currentQ
  useEffect(() => {
    if (debouncedSearchInput !== currentQ) {
      updateUrlParams({ q: debouncedSearchInput });
    }
  }, [debouncedSearchInput, currentQ, updateUrlParams]);

  // Actions
  const setCity = useCallback(
    (city) => {
      // If city changes, reset area chips belonging to previous city unless "all"
      updateUrlParams({ city, area: [] });
    },
    [updateUrlParams]
  );

  const setPropertyType = useCallback(
    (type) => {
      updateUrlParams({ type });
    },
    [updateUrlParams]
  );

  const setSortBy = useCallback(
    (sort) => {
      updateUrlParams({ sort });
    },
    [updateUrlParams]
  );

  const toggleNegotiableOnly = useCallback(() => {
    updateUrlParams({ negotiable: !currentNegotiable });
  }, [currentNegotiable, updateUrlParams]);

  const setPriceRange = useCallback(
    (min, max) => {
      updateUrlParams({ minPrice: min, maxPrice: max });
    },
    [updateUrlParams]
  );

  const toggleArea = useCallback(
    (area) => {
      const exists = currentAreas.some(
        (a) => a.toLowerCase() === area.toLowerCase()
      );
      const nextAreas = exists
        ? currentAreas.filter((a) => a.toLowerCase() !== area.toLowerCase())
        : [...currentAreas, area];
      updateUrlParams({ area: nextAreas });
    },
    [currentAreas, updateUrlParams]
  );

  const removeArea = useCallback(
    (area) => {
      const nextAreas = currentAreas.filter(
        (a) => a.toLowerCase() !== area.toLowerCase()
      );
      updateUrlParams({ area: nextAreas });
    },
    [currentAreas, updateUrlParams]
  );

  const clearFilter = useCallback(
    (key) => {
      if (key === "q") {
        setSearchInput("");
      }
      updateUrlParams({ [key]: null });
    },
    [updateUrlParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchInput("");
    setIsSimulatingLoad(true);
    startTransition(() => {
      router.push(`${pathname}#listings`, { scroll: false });
    });
    setTimeout(() => setIsSimulatingLoad(false), 180);
  }, [pathname, router]);

  // Consolidated active filters object for query execution
  const activeFilters = useMemo(
    () => ({
      q: currentQ,
      city: currentCity,
      areas: currentAreas,
      type: currentType,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      negotiableOnly: currentNegotiable,
      bedrooms: currentBedrooms,
      facing: currentFacing,
      featured: currentFeatured,
      sortBy: currentSort,
    }),
    [
      currentQ,
      currentCity,
      currentAreas,
      currentType,
      currentMinPrice,
      currentMaxPrice,
      currentNegotiable,
      currentBedrooms,
      currentFacing,
      currentFeatured,
      currentSort,
    ]
  );

  // Compute filtered results
  const filteredListings = useMemo(() => {
    return filterListings(dataListings, activeFilters);
  }, [dataListings, activeFilters]);

  // Compute active chips list for UI representation
  const activeChips = useMemo(() => {
    const chips = [];

    if (currentCity && currentCity !== "all") {
      chips.push({
        key: "city",
        label: `City: ${currentCity.charAt(0).toUpperCase() + currentCity.slice(1)}`,
        onRemove: () => clearFilter("city"),
      });
    }

    currentAreas.forEach((area) => {
      chips.push({
        key: `area-${area}`,
        label: `Area: ${area}`,
        onRemove: () => removeArea(area),
      });
    });

    if (currentQ) {
      chips.push({
        key: "q",
        label: `Keyword: "${currentQ}"`,
        onRemove: () => clearFilter("q"),
      });
    }

    if (currentType && currentType !== "all") {
      const typeLabel =
        currentType === "house"
          ? "Houses"
          : currentType === "plot"
          ? "Land & Plots"
          : currentType;
      chips.push({
        key: "type",
        label: `Type: ${typeLabel}`,
        onRemove: () => clearFilter("type"),
      });
    }

    if (currentMinPrice || currentMaxPrice) {
      let priceLabel = "Price: ";
      if (currentMinPrice && currentMaxPrice) {
        priceLabel += `${formatPrice(currentMinPrice)} - ${formatPrice(currentMaxPrice)}`;
      } else if (currentMinPrice) {
        priceLabel += `Above ${formatPrice(currentMinPrice)}`;
      } else if (currentMaxPrice) {
        priceLabel += `Under ${formatPrice(currentMaxPrice)}`;
      }
      chips.push({
        key: "price",
        label: priceLabel,
        onRemove: () => {
          updateUrlParams({ minPrice: null, maxPrice: null });
        },
      });
    }

    if (currentNegotiable) {
      chips.push({
        key: "negotiable",
        label: "Negotiable Only",
        onRemove: () => clearFilter("negotiable"),
      });
    }

    if (currentBedrooms) {
      chips.push({
        key: "bedrooms",
        label: `${currentBedrooms}+ Bedrooms`,
        onRemove: () => clearFilter("bedrooms"),
      });
    }

    if (currentFacing) {
      chips.push({
        key: "facing",
        label: `Facing: ${currentFacing}`,
        onRemove: () => clearFilter("facing"),
      });
    }

    if (currentFeatured) {
      chips.push({
        key: "featured",
        label: "Featured Only",
        onRemove: () => clearFilter("featured"),
      });
    }

    return chips;
  }, [
    currentCity,
    currentAreas,
    currentQ,
    currentType,
    currentMinPrice,
    currentMaxPrice,
    currentNegotiable,
    currentBedrooms,
    currentFacing,
    currentFeatured,
    clearFilter,
    removeArea,
    updateUrlParams,
  ]);

  const activeCount = activeChips.length;
  const isLoading = isPending || isSimulatingLoad;

  return {
    // Current state values
    city: currentCity,
    selectedAreas: currentAreas,
    searchQuery: currentQ,
    searchInput,
    propertyType: currentType,
    sortBy: currentSort,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    negotiableOnly: currentNegotiable,
    bedrooms: currentBedrooms,
    facing: currentFacing,
    featured: currentFeatured,

    // Data results
    listings: filteredListings,
    totalCount: filteredListings.length,
    availableCount: dataListings.length,
    isLoading,

    // Chips & active states
    activeChips,
    activeFilterCount: activeCount,
    hasActiveFilters: activeCount > 0,

    // Methods
    setSearchInput,
    setCity,
    setPropertyType,
    setSortBy,
    toggleNegotiableOnly,
    setPriceRange,
    toggleArea,
    removeArea,
    clearFilter,
    clearAllFilters,
    updateUrlParams,
  };
}

