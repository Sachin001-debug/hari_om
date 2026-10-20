import React from "react";
import Image from "next/image";
import { ShieldCheck, Award, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "@/components/filters/SearchBar";
import { FadeIn } from "@/components/ui/FadeIn";

export function Hero({
  city,
  searchQuery,
  searchInput,
  propertyType,
  listings,
  onCityChange,
  onSearchInputChange,
  onTypeChange,
  onAddArea,
  onSubmitSearch,
}) {
  return (
    <section className="relative w-full pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 bg-primary-dark overflow-visible">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury modern home in Butwal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.45]"
        />
        {/* Navy Gradient Overlay for high text readability & calm mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/65 to-primary-dark/95" />
      </div>

      <Container className="relative z-10 text-center">
        <FadeIn direction="up" delay={100}>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 bg-white/10 text-accent-light border border-white/15 backdrop-blur-md">
            Boutique Real Estate in Lumbini Province
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-sm">
            Hari Om Real Estate
          </h1>

          {/* Tagline */}
          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Find your home in Butwal and beyond. Verified residential lands, prime commercial plots, and contemporary family residences.
          </p>

          {/* Trust Highlights Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>100% Legal Title Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Prime Locations in Butwal & Tilottama</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" />
              <span>Transparent & Direct Dealing</span>
            </div>
          </div>
        </FadeIn>

        {/* Overlapping Search Bar */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <FadeIn direction="up" delay={200}>
            <SearchBar
              city={city}
              searchQuery={searchQuery}
              searchInput={searchInput}
              propertyType={propertyType}
              listings={listings}
              onCityChange={onCityChange}
              onSearchInputChange={onSearchInputChange}
              onTypeChange={onTypeChange}
              onAddArea={onAddArea}
              onSubmitSearch={onSubmitSearch}
            />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

export default Hero;

