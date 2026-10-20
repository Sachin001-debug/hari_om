import React from "react";

export function ListingSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden border border-border/80 shadow-xs animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-16/10 w-full bg-slate-200" />

      {/* Content Skeleton */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price line */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-6 w-32 bg-slate-200 rounded-md" />
            <div className="h-5 w-16 bg-slate-200 rounded-full" />
          </div>

          {/* Title */}
          <div className="h-5 w-4/5 bg-slate-200 rounded-md mb-2" />

          {/* Location */}
          <div className="h-4 w-1/2 bg-slate-200 rounded-md mb-3" />

          {/* Chips */}
          <div className="flex gap-1.5 mb-3">
            <div className="h-4 w-16 bg-slate-200 rounded-md" />
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-1.5 mb-4">
            <div className="h-3 w-full bg-slate-200 rounded-md" />
            <div className="h-3 w-3/4 bg-slate-200 rounded-md" />
          </div>
        </div>

        <div className="pt-2 border-t border-border/60">
          {/* Button */}
          <div className="h-10 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  );
}

export default ListingSkeleton;

