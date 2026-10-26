import { listings as demoListings } from "@/data/listings";
import { CITIES, AREAS_BY_CITY, POPULAR_AREAS, POPULAR_KEYWORDS } from "@/data/locations";
import { filterListings } from "./filterListings";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Service Layer for Listings.
 * Fetches database-driven property listings from backend API with demo fallback.
 */

/**
 * Fetches listings with optional query filtering and pagination.
 *
 * @param {Object} filters - Query filters (q, city, areas, type, minPrice, maxPrice, etc.)
 * @param {Object} options - Service options (simulateDelayMs, page, limit)
 * @returns {Promise<{ listings: Array, total: number, availableCount: number, page: number, limit: number, totalPages: number }>}
 */
export async function getListings(filters = {}, options = {}) {
  const { simulateDelayMs = 0, page = 1, limit = 50 } = options;

  if (simulateDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, simulateDelayMs));
  }

  let propertyList = [];
  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      propertyList = data.properties || [];
    } else {
      propertyList = demoListings;
    }
  } catch {
    propertyList = demoListings;
  }

  const filtered = filterListings(propertyList, filters);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    listings: paginated,
    total: filtered.length,
    availableCount: propertyList.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

/**
 * Fetches a single listing by its unique ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getListingById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.property || null;
    }
  } catch {
    // fallback
  }
  return demoListings.find((item) => item.id === id) || null;
}

/**
 * Fetches a single listing by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getListingBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.property || null;
    }
  } catch {
    // fallback
  }
  return demoListings.find((item) => item.slug === slug) || null;
}

/**
 * Fetches location metadata: cities, areas, and search presets.
 * @returns {Promise<Object>}
 */
export async function getLocations() {
  return {
    cities: CITIES,
    areasByCity: AREAS_BY_CITY,
    popularAreas: POPULAR_AREAS,
    popularKeywords: POPULAR_KEYWORDS,
  };
}

/**
 * Fetches top featured listings.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getFeaturedListings(limit = 4) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/featured?limit=${limit}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.properties || [];
    }
  } catch {
    // fallback
  }
  return demoListings.filter((item) => item.featured).slice(0, limit);
}
