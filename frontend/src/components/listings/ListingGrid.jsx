import React from "react";
import { ListingCard } from "./ListingCard";
import { FadeIn } from "@/components/ui/FadeIn";

export function ListingGrid({ listings = [] }) {
  if (!listings || listings.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {listings.map((listing, index) => {
        // Slight stagger calculation (max 300ms so it stays snappy)
        const delay = (index % 6) * 50;

        return (
          <FadeIn key={listing.id} delay={delay} direction="up">
            <ListingCard listing={listing} />
          </FadeIn>
        );
      })}
    </div>
  );
}

export default ListingGrid;

