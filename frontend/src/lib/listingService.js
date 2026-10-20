import { listings } from "@/data/listings";
import { CITIES, AREAS_BY_CITY, POPULAR_AREAS, POPULAR_KEYWORDS } from "@/data/locations";
import { filterListings } from "./filterListings";

/**
 * Service Layer for Listings.
 *
 * NOTE FOR BACKEND INTEGRATION:
 * When migrating to a real backend API, only modify the implementation inside
 * these functions (e.g. swap with `fetch('/api/listings?...')`).
 * The interface, arguments, and returned structures are intentionally designed
 * to match production REST/GraphQL conventions.
 */

/**
 * Fetches listings with optional query filtering and pagination.
 *
 * @param {Object} filters - Query filters (q, city, areas, type, minPrice, maxPrice, etc.)
 * @param {Object} options - Service options (simulateDelayMs, page, limit)
 * @returns {Promise<{ listings: Array, total: number, availableCount: number }>}
 */
export async function getListings(filters = {}, options = {}) {
  const { simulateDelayMs = 0, page = 1, limit = 50 } = options;

  if (simulateDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, simulateDelayMs));
  }

  const filtered = filterListings(listings, filters);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    listings: paginated,
    total: filtered.length,
    availableCount: listings.length,
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
  const listing = listings.find((item) => item.id === id);
  return listing || null;
}

/**
 * Fetches a single listing by slug.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getListingBySlug(slug) {
  const listing = listings.find((item) => item.slug === slug);
  return listing || null;
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
  return listings.filter((item) => item.featured).slice(0, limit);
}

