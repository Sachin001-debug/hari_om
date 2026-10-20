import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { formatPrice, formatLandArea } from "@/lib/formatPrice";
import { siteConfig } from "@/data/siteConfig";

export function ListingCard({ listing }) {
  if (!listing) return null;

  const isHouse = listing.type === "house";
  const propertyUrl = `/listings/${listing.slug}`;
  const whatsappText = encodeURIComponent(
    `Namaste Hari Om Real Estate! I am interested in "${listing.title}" (${listing.area}, ${listing.city}) listed at ${formatPrice(
      listing.price
    )}. Please share more details.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappText}`;

  return (
    <article className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors flex flex-col h-full">
      {/* Image */}
      <Link
        href={propertyUrl}
        className="relative aspect-16/10 w-full block bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label={`View full details of ${listing.title}`}
      >
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
              isHouse ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
            }`}
          >
            {isHouse ? "House" : "Land"}
          </span>
          {listing.featured && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-white text-orange-600">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <div className="text-lg font-semibold text-slate-900">
            {formatPrice(listing.price)}
          </div>
          {listing.priceNegotiable && (
            <span className="text-[11px] font-medium text-orange-600 shrink-0">
              Negotiable
            </span>
          )}
        </div>

        <Link
          href={propertyUrl}
          className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1.5"
        >
          {listing.title}
        </Link>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {listing.area}, {listing.city}
          </span>
        </div>

        {/* Minimal spec strip */}
        <div className="flex items-center gap-2 text-xs text-slate-600 pb-4 mb-4 border-b border-slate-100">
          <span>{formatLandArea(listing.landArea)}</span>
          {isHouse && (
            <>
              <span className="text-slate-300">·</span>
              <span>{listing.bedrooms} BHK</span>
              <span className="text-slate-300">·</span>
              <span>{listing.bathrooms} bath</span>
            </>
          )}
        </div>

        <p className="text-xs sm:text-[13px] text-slate-600 line-clamp-2 leading-relaxed mb-5">
          {listing.description}
        </p>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          <Link
            href={propertyUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2.5 transition-colors"
          >
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Inquire on WhatsApp"
            aria-label="Inquire on WhatsApp"
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;