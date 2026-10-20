export const CITIES = [
  { id: "all", name: "All Cities", label: "All Cities" },
  { id: "butwal", name: "Butwal", label: "Butwal" },
  { id: "tilottama", name: "Tilottama", label: "Tilottama" },
  { id: "bhairahawa", name: "Bhairahawa", label: "Bhairahawa" },
];

export const AREAS_BY_CITY = {
  all: [
    "4 No.",
    "Charnumber",
    "Manigram",
    "Sukhanagar",
    "Kalikanagar",
    "Mauwari",
    "Golpark",
    "Deepnagar",
    "Drivertole",
    "Bhalwari",
    "Tilotama-8",
    "Devinagar",
    "Haatbazar",
    "Milan Chowk",
    "Airport Area",
    "Bank Road",
  ],
  butwal: [
    "4 No.",
    "Charnumber",
    "Sukhanagar",
    "Kalikanagar",
    "Golpark",
    "Deepnagar",
    "Devinagar",
    "Haatbazar",
    "Traffic Chowk",
    "Nayagaon",
  ],
  tilottama: [
    "Manigram",
    "Tilotama-8",
    "Mauwari",
    "Drivertole",
    "Bhalwari",
    "Kotihawa",
    "Yogikuti",
    "Janakinagar",
    "Shankarnagar",
  ],
  bhairahawa: [
    "Milan Chowk",
    "Airport Area",
    "Bank Road",
    "Buddha Chowk",
    "Barmeli Tole",
    "Devkota Chowk",
  ],
};

export const POPULAR_AREAS = [
  "4 No.",
  "Charnumber",
  "Manigram",
  "Mauwari",
  "Sukhanagar",
  "Kalikanagar",
  "Tilotama-8",
];

export const POPULAR_KEYWORDS = [
  "Road facing",
  "Corner plot",
  "Near school",
  "Near highway",
  "Commercial",
  "Peaceful area",
  "Parking space",
  "Rooftop garden",
];

/**
 * Normalization & Synonym mapping:
 * Maps common variations to canonical tokens for uniform matching.
 */
export const SYNONYM_MAP = {
  // 4 No. / Charnumber variations
  "4 no": "4 no.",
  "4no": "4 no.",
  "4 number": "4 no.",
  "4 num": "4 no.",
  "char number": "4 no.",
  "charnumber": "4 no.",
  "chaar number": "4 no.",
  "char no": "4 no.",
  "four number": "4 no.",

  // Tilottama variations
  "tilotama": "tilottama",
  "tilotama-8": "tilotama-8",
  "tilottama-8": "tilotama-8",
  "tilottama 8": "tilotama-8",
  "tilotama 8": "tilotama-8",

  // Manigram
  "manigram chowk": "manigram",

  // Road facing
  "road access": "road facing",
  "pitched road": "road facing",
  "main road": "road facing",
  "front road": "road facing",

  // Corner
  "corner": "corner plot",
  "two way road": "corner plot",
  "double road": "corner plot",

  // Highway
  "highway touch": "near highway",
  "highway side": "near highway",
};

export const PROPERTY_TYPES = [
  { id: "all", label: "All Properties" },
  { id: "house", label: "Houses & Villas" },
  { id: "plot", label: "Land & Plots" },
  { id: "apartment", label: "Apartments" },
];

export const PRICE_PRESETS = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under 50 Lakh", min: 0, max: 5000000 },
  { label: "50 Lakh - 1 Crore", min: 5000000, max: 10000000 },
  { label: "1 Crore - 2 Crore", min: 10000000, max: 20000000 },
  { label: "2 Crore+", min: 20000000, max: "" },
];

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "featured", label: "Featured First" },
];

