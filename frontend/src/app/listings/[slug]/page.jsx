import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  ArrowLeft,
  Check,
  Clock,
} from "lucide-react";
import { listings } from "@/data/listings";
import { getListingBySlug } from "@/lib/listingService";
import { formatPrice, formatLandArea } from "@/lib/formatPrice";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";
import { ListingCard } from "@/components/listings/ListingCard";

// Pre-render all listing slugs for instant page delivery
export async function generateStaticParams() {
  return listings.map((listing) => ({
    slug: listing.slug,
  }));
}

// Dynamic SEO metadata for each property
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return {
      title: "Property Not Found | Hari Om Real Estate",
    };
  }

  const formattedPrice = formatPrice(listing.price);
  const title = `${listing.title} for Sale in ${listing.area}, ${listing.city} (${formattedPrice})`;
  const description = `${listing.description} Located at ${listing.area}, ${listing.city}. Land area: ${formatLandArea(listing.landArea)}. Verified title by Hari Om Real Estate.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/listings/${listing.slug}`,
      images: [
        {
          url: listing.image,
          width: 1200,
          height: 800,
          alt: listing.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailsPage({ params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const isHouse = listing.type === "house";
  const whatsappText = encodeURIComponent(
    `Namaste Hari Om Real Estate! I am inquiring about the property "${listing.title}" (${listing.area}, ${listing.city}) listed at ${formatPrice(
      listing.price
    )}. Please share full papers and schedule a spot visit.`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappText}`;

  // Find 3 similar properties in the same city or category
  const relatedListings = listings
    .filter(
      (item) =>
        item.id !== listing.id &&
        (item.city === listing.city || item.type === listing.type)
    )
    .slice(0, 3);

  // Flat specification list for a clean definition table
  const specs = [
    { label: "Land Area", value: formatLandArea(listing.landArea) },
    { label: "Facing", value: `${listing.facing || "East"} (Vastu friendly)` },
    { label: "Road Access", value: listing.roadWidth || "20 ft pitched" },
    { label: "Legal Status", value: "Freehold (Lalpurja verified)" },
    { label: "Water Supply", value: "Deep boring & municipal line" },
    { label: "Electricity", value: "NEA 3-phase connection" },
    ...(isHouse
      ? [
          { label: "Bedrooms", value: `${listing.bedrooms} BHK` },
          { label: "Bathrooms", value: `${listing.bathrooms}` },
          { label: "Parking", value: "Covered garage (2 cars)" },
          { label: "Construction", value: "Earthquake-resistant RCC frame" },
        ]
      : []),
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. Breadcrumb bar */}
      <div className="border-b border-slate-100">
        <Container>
          <div className="flex items-center justify-between py-3 text-xs text-slate-500">
            <nav className="flex items-center gap-1.5 min-w-0">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/#listings"
                className="hover:text-blue-600 transition-colors"
              >
                Listings
              </Link>
              <span>/</span>
              <Link
                href={`/?city=${listing.city.toLowerCase()}#listings`}
                className="hover:text-blue-600 transition-colors"
              >
                {listing.city}
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-medium truncate">
                {listing.title}
              </span>
            </nav>

            <Link
              href="/#listings"
              className="hidden sm:inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors shrink-0 ml-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all listings</span>
            </Link>
          </div>
        </Container>
      </div>

      <Container className="pt-10">
        {/* 2. Header — title, location, price */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-semibold text-blue-600 uppercase tracking-wider">
                {isHouse ? "House / Villa" : "Land / Plot"}
              </span>
              {listing.featured && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-orange-600 font-medium">Featured</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {listing.area}, {listing.city}, Rupandehi
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                Listed {listing.createdAt}
              </span>
              <span className="font-mono text-xs uppercase">
                ID: {listing.id}
              </span>
            </div>
          </div>

          <div className="md:text-right shrink-0">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
              Asking price
            </div>
            <div className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
              {formatPrice(listing.price)}
            </div>
            <div className="text-xs mt-1 font-medium">
              {listing.priceNegotiable ? (
                <span className="text-orange-600">Negotiable</span>
              ) : (
                <span className="text-slate-500">Fixed price</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mt-8">
          {/* LEFT — media, specs, description */}
          <div className="lg:col-span-2 space-y-10">
            {/* Primary image */}
            <div className="relative aspect-16/10 w-full rounded-lg overflow-hidden bg-slate-100">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            {/* Key specs strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-white p-4">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Land Area
                </div>
                <div className="text-base font-semibold text-slate-900 mt-1">
                  {formatLandArea(listing.landArea)}
                </div>
              </div>

              {isHouse ? (
                <>
                  <div className="bg-white p-4">
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Bedrooms
                    </div>
                    <div className="text-base font-semibold text-slate-900 mt-1">
                      {listing.bedrooms} BHK
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Bathrooms
                    </div>
                    <div className="text-base font-semibold text-slate-900 mt-1">
                      {listing.bathrooms}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-4">
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Property Type
                    </div>
                    <div className="text-base font-semibold text-slate-900 mt-1">
                      Plot / Land
                    </div>
                  </div>
                  <div className="bg-white p-4">
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      Facing
                    </div>
                    <div className="text-base font-semibold text-slate-900 mt-1">
                      {listing.facing || "East"}
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white p-4">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Road Access
                </div>
                <div className="text-base font-semibold text-slate-900 mt-1">
                  {listing.roadWidth || "20 ft"}
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                About this property
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                {listing.description}
              </p>
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mt-3">
                Positioned in a premier pocket of {listing.area},{" "}
                {listing.city}, this property offers excellent connectivity and
                long-term appreciation potential. All boundaries are clearly
                demarcated and registered with zero legal encumbrances.
              </p>

              {listing.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {listing.keywords.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Specifications */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Specifications
              </h2>
              <dl className="border-t border-slate-100">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-3 border-b border-slate-100 text-sm"
                  >
                    <dt className="text-slate-500">{s.label}</dt>
                    <dd className="font-medium text-slate-900 text-right">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* RIGHT — sticky inquiry card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Price + CTA */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                  Total price
                </div>
                <div className="text-2xl font-semibold text-slate-900 mt-1">
                  {formatPrice(listing.price)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {formatLandArea(listing.landArea)} ·{" "}
                  {formatPrice(
                    Math.round(listing.price / (listing.landArea?.value || 1))
                  )}{" "}
                  / {listing.landArea?.unit || "unit"}
                </div>

                <div className="space-y-2 mt-6">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <a
                    href={siteConfig.telephoneLink}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium py-3 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {siteConfig.phoneFormatted}</span>
                  </a>
                </div>

                <ul className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  {[
                    "Malpot verified registry deed",
                    "Direct owner negotiation guarantee",
                    "On-site visit with local advisor",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Agency card */}
              <div className="rounded-lg p-6 bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    HO
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Hari Om Real Estate
                    </div>
                    <div className="text-xs text-slate-500">
                      Tilotama-8, Manigram, Rupandehi
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Sun–Fri · 9am–6pm
                  </span>
                  <Link
                    href="/about"
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    About →
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 4. Related properties */}
        {relatedListings.length > 0 && (
          <section className="mt-20 pt-10 border-t border-slate-100">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
                  Similar properties
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                  More in {listing.city}
                </h2>
              </div>
              <Link
                href={`/?city=${listing.city.toLowerCase()}#listings`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedListings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}