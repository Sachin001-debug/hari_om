import { cleanText, normalizeWithSynonyms, tokenizeQuery } from "./normalizeText";

/**
 * Computes a relevance score for a listing based on a query.
 * Higher score = higher ranking.
 * Area & keyword matches rank above description matches.
 */
function scoreListing(listing, tokens, rawQuery) {
  if (!tokens || tokens.length === 0) return 0;

  const titleNorm = normalizeWithSynonyms(listing.title);
  const areaNorm = normalizeWithSynonyms(listing.area);
  const cityNorm = normalizeWithSynonyms(listing.city);
  const keywordsNorm = (listing.keywords || []).map((k) => normalizeWithSynonyms(k)).join(" ");
  const descNorm = normalizeWithSynonyms(listing.description);
  const typeNorm = normalizeWithSynonyms(listing.type);

  const combinedSearchable = `${titleNorm} ${areaNorm} ${cityNorm} ${keywordsNorm} ${descNorm} ${typeNorm}`;

  // Multi-word AND logic: ALL tokens must be present in the listing's searchable text
  const allMatch = tokens.every((token) => combinedSearchable.includes(token));
  if (!allMatch) {
    return -1; // Excluded from search results
  }

  let score = 0;
  const rawClean = cleanText(rawQuery);

  // Exact area match is king
  if (areaNorm.includes(rawClean)) score += 50;
  if (titleNorm.includes(rawClean)) score += 40;
  if (keywordsNorm.includes(rawClean)) score += 30;
  if (cityNorm.includes(rawClean)) score += 20;

  // Individual token matches
  for (const token of tokens) {
    if (areaNorm.includes(token)) score += 20;
    if (keywordsNorm.includes(token)) score += 15;
    if (titleNorm.includes(token)) score += 10;
    if (descNorm.includes(token)) score += 2; // Description gets lower weight
  }

  return score;
}

/**
 * Pure function to filter and sort listings.
 * Compatible with future backend query parameters.
 *
 * @param {Array} listings - Array of listing objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered and sorted listings
 */
export function filterListings(listings, filters = {}) {
  if (!Array.isArray(listings)) return [];

  const {
    q = "",
    city = "all",
    areas = [], // array or comma-delimited string
    type = "all",
    minPrice,
    maxPrice,
    negotiableOnly = false,
    bedrooms,
    facing,
    featured = false,
    sortBy = "newest",
  } = filters;

  const normalizedAreas = Array.isArray(areas)
    ? areas.map((a) => cleanText(a)).filter(Boolean)
    : typeof areas === "string" && areas.length > 0
    ? areas.split(",").map((a) => cleanText(a)).filter(Boolean)
    : [];

  const tokens = q ? tokenizeQuery(q) : [];

  // Filter pass
  const scoredItems = [];

  for (const item of listings) {
    // 1. City filter
    if (city && city !== "all") {
      const itemCity = cleanText(item.city);
      const targetCity = cleanText(city);
      if (itemCity !== targetCity) continue;
    }

    // 2. Areas multi-select filter
    if (normalizedAreas.length > 0) {
      const itemArea = cleanText(item.area);
      const matchesAnyArea = normalizedAreas.some((targetArea) => {
        return (
          itemArea.includes(targetArea) ||
          targetArea.includes(itemArea) ||
          normalizeWithSynonyms(itemArea) === normalizeWithSynonyms(targetArea)
        );
      });
      if (!matchesAnyArea) continue;
    }

    // 3. Property type filter
    if (type && type !== "all") {
      if (item.type.toLowerCase() !== type.toLowerCase()) continue;
    }

    // 4. Price range filter
    if (minPrice !== undefined && minPrice !== "" && Number(minPrice) > 0) {
      if (item.price < Number(minPrice)) continue;
    }
    if (maxPrice !== undefined && maxPrice !== "" && Number(maxPrice) > 0) {
      if (item.price > Number(maxPrice)) continue;
    }

    // 5. Negotiable only filter
    if (negotiableOnly && !item.priceNegotiable) {
      continue;
    }

    // 6. Minimum bedrooms (for houses)
    if (bedrooms && Number(bedrooms) > 0) {
      if (!item.bedrooms || item.bedrooms < Number(bedrooms)) continue;
    }

    // 7. Facing direction
    if (facing && facing !== "all" && facing !== "") {
      const itemFacing = cleanText(item.facing || "");
      const targetFacing = cleanText(facing);
      if (!itemFacing.includes(targetFacing)) continue;
    }

    // 8. Featured only
    if (featured && !item.featured) {
      continue;
    }

    // 9. Keyword / free text search score
    let relevanceScore = 0;
    if (tokens.length > 0) {
      relevanceScore = scoreListing(item, tokens, q);
      if (relevanceScore < 0) continue; // Failed multi-word AND match
    }

    scoredItems.push({
      item,
      score: relevanceScore,
    });
  }

  // Sorting pass
  scoredItems.sort((a, b) => {
    // If a free text search query is present and sortBy is default/newest, prioritize relevance
    if (tokens.length > 0 && (!sortBy || sortBy === "newest" || sortBy === "relevance")) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
    }

    switch (sortBy) {
      case "price_asc":
        return a.item.price - b.item.price;
      case "price_desc":
        return b.item.price - a.item.price;
      case "featured":
        if (a.item.featured === b.item.featured) return 0;
        return a.item.featured ? -1 : 1;
      case "newest":
      default:
        return new Date(b.item.createdAt) - new Date(a.item.createdAt);
    }
  });

  return scoredItems.map((entry) => entry.item);
}

