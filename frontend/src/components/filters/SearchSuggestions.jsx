"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapPin, Search, Tag, Building2, Clock, Trash2 } from "lucide-react";
import { POPULAR_AREAS, POPULAR_KEYWORDS, AREAS_BY_CITY } from "@/data/locations";
import { cleanText } from "@/lib/normalizeText";

const RECENT_SEARCHES_KEY = "hariom_recent_searches";

export function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(term) {
  if (typeof window === "undefined" || !term || !term.trim()) return;
  try {
    const existing = getRecentSearches();
    const clean = term.trim();
    const updated = [clean, ...existing.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (e) {
    // ignore
  }
}

export function SearchSuggestions({
  query = "",
  city = "all",
  listings = [],
  isOpen = false,
  onClose,
  onSelectArea,
  onSelectKeyword,
  onSelectProperty,
  onSelectRecent,
}) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setActiveIndex(-1);
    }
  }, [isOpen, query]);

  if (!isOpen) return null;

  const rawClean = cleanText(query);
  const isQueryEmpty = rawClean.length === 0;

  // 1. Available areas for current city
  const cityAreas = AREAS_BY_CITY[city] || AREAS_BY_CITY.all;

  // Filter matching areas
  const matchingAreas = isQueryEmpty
    ? []
    : cityAreas
        .filter((area) => cleanText(area).includes(rawClean))
        .slice(0, 4);

  // Filter matching keywords
  const matchingKeywords = isQueryEmpty
    ? []
    : POPULAR_KEYWORDS.filter((k) => cleanText(k).includes(rawClean)).slice(0, 4);

  // Filter matching properties
  const matchingProperties = isQueryEmpty
    ? []
    : (listings || [])
        .filter((item) => cleanText(item.title).includes(rawClean) || cleanText(item.area).includes(rawClean))
        .slice(0, 3);

  // Compile flat items list for keyboard navigation
  const flatItems = [];

  if (isQueryEmpty) {
    recentSearches.forEach((s) => {
      flatItems.push({ type: "recent", label: s, action: () => onSelectRecent(s) });
    });
    POPULAR_AREAS.slice(0, 6).forEach((area) => {
      flatItems.push({ type: "popularArea", label: area, action: () => onSelectArea(area) });
    });
  } else {
    matchingAreas.forEach((area) => {
      flatItems.push({ type: "area", label: area, action: () => onSelectArea(area) });
    });
    matchingKeywords.forEach((k) => {
      flatItems.push({ type: "keyword", label: k, action: () => onSelectKeyword(k) });
    });
    matchingProperties.forEach((p) => {
      flatItems.push({ type: "property", label: p.title, item: p, action: () => onSelectProperty(p) });
    });
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        e.preventDefault();
        flatItems[activeIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Helper to highlight matching text in bold
  const renderHighlightedText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <strong key={i} className="font-semibold text-primary underline underline-offset-2">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="listbox"
      id="search-suggestions-dropdown"
      className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-xl border border-border/80 overflow-hidden z-50 text-left transition-all animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {isQueryEmpty ? (
        <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-muted hover:text-accent flex items-center gap-1 font-normal lowercase cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectRecent(term)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-bg hover:bg-primary/10 text-text hover:text-primary transition-colors border border-border"
                  >
                    <Clock className="w-3 h-3 text-muted" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Popular Local Areas
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_AREAS.map((area, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectArea(area)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg hover:bg-accent-light hover:text-accent-hover text-text transition-colors border border-border"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> Popular Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_KEYWORDS.map((k, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectKeyword(k)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg hover:bg-primary/10 hover:text-primary text-text transition-colors border border-border"
                >
                  #{k}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border/60">
          {matchingAreas.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" /> Areas in {city === "all" ? "Region" : city}
              </div>
              {matchingAreas.map((area, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectArea(area)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-sm text-text hover:bg-bg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent/80" />
                    <span>{renderHighlightedText(area, rawClean)}</span>
                  </span>
                  <span className="text-xs text-muted bg-bg px-2 py-0.5 rounded-md border border-border">
                    Area
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchingKeywords.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Keywords & Tags
              </div>
              {matchingKeywords.map((kw, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectKeyword(kw)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-sm text-text hover:bg-bg transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary/70" />
                    <span>{renderHighlightedText(kw, rawClean)}</span>
                  </span>
                  <span className="text-xs text-muted bg-bg px-2 py-0.5 rounded-md border border-border">
                    Feature
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchingProperties.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Matching Properties
              </div>
              {matchingProperties.map((prop) => (
                <button
                  key={prop.id}
                  type="button"
                  onClick={() => onSelectProperty(prop)}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-sm text-text hover:bg-bg transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="truncate font-medium text-text">
                      {renderHighlightedText(prop.title, rawClean)}
                    </div>
                    <div className="text-xs text-muted flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted" />
                      <span>{prop.area}, {prop.city}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded-md">
                    {prop.type === "house" ? "House" : "Plot"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchingAreas.length === 0 && matchingKeywords.length === 0 && matchingProperties.length === 0 && (
            <div className="p-6 text-center text-sm text-muted">
              Press <span className="font-semibold text-primary">Enter</span> or click Search to find all properties containing &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;

