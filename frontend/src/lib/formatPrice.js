/**
 * Formats a numeric price into Nepali Currency representation (Crore / Lakh)
 * 1 Crore = 10,000,000 NPR
 * 1 Lakh  = 100,000 NPR
 *
 * @param {number|string} amount - Price in NPR
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string, e.g. "Rs. 1.25 Crore"
 */
export function formatPrice(amount, options = {}) {
  const { prefix = "Rs. ", compact = true } = options;

  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "Price on Request";
  }

  const num = Number(amount);

  if (num === 0) return "Free / Negotiable";

  if (num >= 10000000) {
    const crores = num / 10000000;
    const formatted =
      crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2).replace(/\.?0+$/, "");
    return `${prefix}${formatted} Crore`;
  }

  if (num >= 100000) {
    const lakhs = num / 100000;
    const formatted =
      lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/\.?0+$/, "");
    return `${prefix}${formatted} Lakh`;
  }

  return `${prefix}${num.toLocaleString("en-IN")}`;
}

/**
 * Returns a display string for a land area
 * @param {Object} landArea - { value, unit }
 * @returns {string} e.g. "12 Dhur" or "1 Katha"
 */
export function formatLandArea(landArea) {
  if (!landArea || landArea.value === undefined || landArea.value === null) {
    return "N/A";
  }
  return `${landArea.value} ${landArea.unit || "Dhur"}`;
}

