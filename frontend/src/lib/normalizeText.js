import { SYNONYM_MAP } from "@/data/locations";

/**
 * Strips punctuation, trims whitespace, and converts to lowercase.
 * @param {string} text
 * @returns {string} Normalized string
 */
export function cleanText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s\.-]/g, " ") // keep alphanumeric and period/hyphen
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolves synonyms and shorthand representations.
 * For example, "4no", "4 number", "char number", "charnumber" all resolve to "4 no."
 * @param {string} text
 * @returns {string} Text with mapped synonyms
 */
export function normalizeWithSynonyms(text) {
  let cleaned = cleanText(text);
  if (!cleaned) return "";

  // Check direct full match in synonym map
  if (SYNONYM_MAP[cleaned]) {
    return SYNONYM_MAP[cleaned];
  }

  // Check phrase replacements
  for (const [key, replacement] of Object.entries(SYNONYM_MAP)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    cleaned = cleaned.replace(regex, replacement);
  }

  return cleaned.trim();
}

/**
 * Breaks a query into distinct normalized search tokens.
 * @param {string} query
 * @returns {string[]} Array of non-empty tokens
 */
export function tokenizeQuery(query) {
  const normalized = normalizeWithSynonyms(query);
  if (!normalized) return [];

  // Remove common stop words for real estate search
  const stopWords = new Set(["in", "at", "the", "and", "or", "for", "near", "with", "a", "an"]);
  return normalized
    .split(/\s+/)
    .filter((token) => token.length > 0 && !stopWords.has(token));
}

