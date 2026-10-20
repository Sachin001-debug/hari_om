# Hari Om Real Estate - Premium Frontend Demo

A clean, fast, boutique real estate website for **Hari Om Real Estate** (based in Tilotama-8, Manigram, Rupandehi, Nepal). Built with **Next.js (App Router)**, **JSX**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **Design System & Theme**
   - Palette: **Navy Blue** (primary trustworthy tone) + **Warm Orange** (accent CTAs & highlights) + **Emerald Green** (negotiable indicators & WhatsApp).
   - Dynamic CSS variables in `src/app/globals.css` mapped through `tailwind.config.js`.
   - Typography: **Playfair Display** (headings) and **Inter** (body) via `next/font/google`.
   - Responsive, accessible, rounded-2xl cards with soft shadows.

2. **Advanced Multi-Faceted Search & Filter Engine**
   - **Hero Search Bar**: Prominent city selector, smart area/keyword input, and property type selector.
   - **Grouped Autocomplete Suggestions**:
     - When empty: Displays **Recent Searches** (safe `localStorage`) and **Popular Local Areas**.
     - When typing: Real-time grouped suggestions for **Areas**, **Keywords & Tags**, and **Matching Properties**.
     - Keyboard navigation (`↑`, `↓`, `Enter`, `Escape`), bold highlight matching, ARIA combobox attributes.
   - **Synonym Normalization**:
     - Seamlessly resolves local Nepali variations: e.g. `"4 no"`, `"4no"`, `"4 number"`, `"charnumber"`, `"char number"` all match `"4 No." / "Charnumber"`.
     - Multi-word search with `AND` logic, prioritizing title/area/keyword matches above description matches.
   - **URL Synchronization**:
     - Filter state lives in URL query params (`?city=butwal&area=Charnumber&type=plot&sort=newest#listings`). Shareable, bookmarkable, and back-button friendly.
   - **Refinement Controls**:
     - Property type segmented tabs (`All`, `Houses & Villas`, `Land & Plots`, `Apartments`).
     - Nepali price range presets (`Under 50 Lakh`, `50L - 1Cr`, `1Cr - 2Cr`, `2Cr+`).
     - "Negotiable only" instant toggle.
     - "More Filters" slide-over drawer (bedrooms, facing directions, featured listings, multi-area selector).
     - Active filter chips with individual removal and "Clear all" link.
     - Smooth loading skeletons.

3. **12 Curated Hardcoded Listings**
   - Realistic mix of luxury houses and prime plots in Butwal, Tilottama (Manigram, Mauwari), and Bhairahawa.
   - Real Nepali land measurements (**Dhur**, **Katha**).
   - Formatted NPR prices (**Crore** / **Lakh**) with clear **"Negotiable"** or **"Fixed Price"** indicators.
   - Direct WhatsApp pre-filled inquiry buttons and telephone dialing.

4. **Animations & Micro-Interactions**
   - Custom `<FadeIn>` component using `IntersectionObserver`.
   - Respects `prefers-reduced-motion`.
   - Sticky navbar with smooth transition from transparent to solid white on scroll.
   - Floating WhatsApp button with a 5-second automatic welcome tooltip and gentle pulse.

5. **SEO & Structured Data**
   - Full Next.js Metadata API (OpenGraph, Twitter Cards, canonical links).
   - JSON-LD Structured Data for `RealEstateAgent` / `LocalBusiness` with coordinates and operating hours.
   - Native `sitemap.xml` and `robots.txt` generation.

---

## 📁 Scalable Folder Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.jsx          # About page (Heritage, stats, team, office map)
│   │   ├── globals.css           # Root CSS theme variables & animations
│   │   ├── layout.jsx            # Fonts, metadata, JSON-LD, Navbar, Footer, WhatsAppFloat
│   │   ├── page.jsx              # Home page with Suspense boundary
│   │   ├── robots.js             # Automated robots.txt generator
│   │   └── sitemap.js            # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── filters/
│   │   │   ├── ActiveFilterChips.jsx  # Removable active filter tags
│   │   │   ├── FilterBar.jsx          # Primary filter toolbar with count & controls
│   │   │   ├── FilterDrawer.jsx       # Slide-over "More filters" drawer
│   │   │   ├── PriceRangeFilter.jsx   # Budget dropdown presets
│   │   │   ├── SearchBar.jsx          # Overlapping hero search bar
│   │   │   ├── SearchSuggestions.jsx  # Autocomplete dropdown with recent searches
│   │   │   └── SortSelect.jsx         # Accessible sort select
│   │   ├── home/
│   │   │   ├── Hero.jsx               # High-contrast hero with background image
│   │   │   ├── HomePageClient.jsx     # Main home controller wiring filters & state
│   │   │   ├── ListingsSection.jsx    # Target for smooth scroll & listings container
│   │   │   └── WhyChooseUs.jsx        # 3-item boutique value proposition strip
│   │   ├── layout/
│   │   │   ├── Footer.jsx             # Dark navy footer with office details
│   │   │   ├── Navbar.jsx             # Scroll-reactive sticky navigation
│   │   │   └── WhatsAppFloat.jsx      # Bottom-right WhatsApp CTA with tooltip
│   │   ├── listings/
│   │   │   ├── EmptyState.jsx         # Helpful fallback with search suggestions
│   │   │   ├── ListingCard.jsx        # Rich listing card with image, price & specs
│   │   │   ├── ListingGrid.jsx        # Staggered responsive grid (1 / 2 / 3 cols)
│   │   │   └── ListingSkeleton.jsx    # Shimmer loading skeleton
│   │   └── ui/
│   │       ├── Badge.jsx              # Status badges (Negotiable, Featured, etc.)
│   │       ├── Button.jsx             # Theme buttons (primary, accent, outline)
│   │       ├── Container.jsx          # Standardized max-width container
│   │       ├── FadeIn.jsx             # IntersectionObserver animation wrapper
│   │       └── SectionHeading.jsx     # Playfair Display serif headings
│   ├── data/
│   │   ├── listings.js           # 12 demo listings data shape
│   │   ├── locations.js          # Cities, areas, synonym map, search presets
│   │   └── siteConfig.js         # Phone, WhatsApp, address, office hours, socials
│   ├── hooks/
│   │   ├── useDebounce.js        # Debounce utility hook (250-280ms)
│   │   └── useListingFilters.js  # Filter state, URL query sync & computation
│   └── lib/
│       ├── filterListings.js     # Pure filtering & relevance ranking algorithm
│       ├── formatPrice.js        # Nepali currency (Crore/Lakh) & land area formatters
│       ├── listingService.js     # Decoupled async service layer (backend-ready)
│       └── normalizeText.js      # Synonym expansion & text normalization
├── jsconfig.json                 # Path aliases (@/* -> ./src/*)
├── next.config.mjs               # Unsplash image domains configuration
├── package.json
└── tailwind.config.js            # Theme mappings for CSS variables
```

---

## 🚀 Getting Started

### 1. Installation
Navigate into the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🎨 How to Customize the Theme

All theme colors are centralized in `src/app/globals.css` and mapped to Tailwind in `tailwind.config.js`.

To adjust the colors across the **entire website**, edit the CSS variables in `src/app/globals.css`:

```css
:root {
  /* Primary Navy Palette */
  --color-primary: #0e2946;        /* Main headings, brand elements, navbar */
  --color-primary-dark: #071729;   /* Hero overlay, footer background */
  --color-primary-light: #1b436c;  /* Subtle backgrounds & borders */

  /* Accent Orange Palette */
  --color-accent: #f97316;         /* Primary CTAs, search buttons, highlights */
  --color-accent-hover: #ea580c;   /* Button hover states */
  --color-accent-light: #ffedd5;   /* Badge backgrounds, light pills */

  /* Neutrals & Surfaces */
  --color-bg: #f8fafc;            /* Page background */
  --color-surface: #ffffff;       /* Card backgrounds */
  --color-text: #0f172a;          /* Body typography */
  --color-muted: #64748b;         /* Subtitles & metadata labels */
  --color-border: #e2e8f0;        /* Subtle card & input borders */
}
```

---

## 🔌 How to Connect to a Real Backend Later

The frontend is built with a decoupled Service Pattern in `src/lib/listingService.js`.

### Step 1: Update `src/lib/listingService.js`
Replace the local array functions with calls to your backend REST API or GraphQL endpoint:

```javascript
// Example: src/lib/listingService.js
export async function getListings(filters = {}, options = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.city) queryParams.set("city", filters.city);
  if (filters.q) queryParams.set("q", filters.q);
  if (filters.type) queryParams.set("type", filters.type);
  if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
  if (filters.negotiableOnly) queryParams.set("negotiable", "true");
  if (filters.sortBy) queryParams.set("sort", filters.sortBy);
  if (filters.areas?.length) queryParams.set("area", filters.areas.join(","));

  const response = await fetch(`/api/properties?${queryParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch listings");
  
  return await response.json();
}
```

### Step 2: Keep the Existing Data Contract
The UI components expect the data shape specified in `src/data/listings.js`:
- `id`: Unique string
- `title`: String
- `type`: `"house"` | `"plot"`
- `price`: Number (in NPR)
- `priceNegotiable`: Boolean
- `city`: String (e.g. `"Butwal"`)
- `area`: String (e.g. `"Sukhanagar"`)
- `keywords`: Array of strings
- `description`: String
- `landArea`: `{ value: number, unit: "Dhur" | "Katha" }`
- `bedrooms`: Number or null
- `bathrooms`: Number or null
- `roadWidth`: String
- `facing`: String
- `image`: URL string
- `featured`: Boolean
#   h a r i _ o m  
 