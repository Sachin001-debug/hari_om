import React from "react";
import { SearchX, RotateCcw, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  searchQuery,
  onClearFilters,
  onSelectSuggestion,
}) {
  return (
    <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto mb-5">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="font-serif font-bold text-xl sm:text-2xl text-primary mb-2">
        No Matching Properties Found
      </h3>

      <p className="text-sm text-muted leading-relaxed mb-6">
        {searchQuery ? (
          <>
            We couldn’t find any listings matching &ldquo;
            <span className="font-semibold text-text">{searchQuery}</span>
            &rdquo;. Try searching by nearby areas or loosening your price and filter criteria.
          </>
        ) : (
          "No properties match your current combination of filters. Try clearing some filters to see available listings."
        )}
      </p>

      {/* Suggested Quick Searches */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 flex items-center justify-center gap-1">
          <Compass className="w-3.5 h-3.5 text-accent" />
          <span>Recommended Searches</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["All Butwal", "Charnumber", "Road facing", "Houses", "Plots"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectSuggestion && onSelectSuggestion(tag)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg hover:bg-primary/10 text-text hover:text-primary transition-colors border border-border cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Button
          variant="primary"
          size="md"
          icon={RotateCcw}
          onClick={onClearFilters}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );
}

export default EmptyState;

