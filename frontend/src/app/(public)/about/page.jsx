import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/siteConfig";

export const metadata = {
  title: "About Us | Hari Om Real Estate",
  description:
    "Learn about Hari Om Real Estate's 15-year legacy of delivering verified land titles, luxury homes, and transparent property services in Tilotama-8, Manigram and Butwal.",
};

const TEAM_MEMBERS = [
  {
    name: "Hari Om Tiwari",
    role: "Founder & Managing Director",
    bio: "Over 20 years pioneering legal title clearance and land development across the Siddhartha highway belt in Rupandehi.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Anita Thapa",
    role: "Head of Valuation & Cadastral Mapping",
    bio: "Expert in municipal land regulations, zoning laws, and boundary demarcation across Butwal and Tilottama wards.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rajesh Sharma",
    role: "Senior Client Relations & Registry Specialist",
    bio: "Dedicated to smooth ownership transfer (Malpot), bank loan facilitation, and bespoke site visits for buyers.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
];

const VALUES = [
  {
    title: "100% Title Certainty",
    description:
      "Every parcel undergoes rigorous Malpot (Land Revenue) cross-examination so our buyers never face land disputes.",
  },
  {
    title: "Zero Hidden Margins",
    description:
      "Direct-to-owner consultations with honest market valuations and transparent brokerage agreements.",
  },
  {
    title: "Local Community Commitment",
    description:
      "Rooted in Manigram and Butwal, we help shape sustainable residential colonies that appreciate over time.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero */}
      <section className="border-b border-slate-100 pt-32 pb-16 sm:pt-36 sm:pb-20">
        <Container>
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-3">
              About Us
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
              Building trust in every katha &amp; dhur.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              From our headquarters at Tilotama-8, Manigram, we have spent over
              15 years simplifying property ownership with integrity, clarity,
              and deep local insight.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden mt-12">
            {siteConfig.stats.map((stat, i) => (
              <div key={i} className="bg-white p-5 sm:p-6">
                <div className="text-2xl sm:text-3xl font-semibold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Company story */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-3">
                Who We Are
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight mb-6">
                A boutique estate agency built on legal clarity and honest
                values.
              </h2>

              <div className="space-y-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                <p>
                  Founded in the heart of Tilottama Municipality, Hari Om Real
                  Estate was established with a singular mission: to remove the
                  obscurity, speculation, and dispute risks often associated with
                  land and home acquisition in Rupandehi.
                </p>
                <p>
                  Whether you are seeking a peaceful 10-Dhur plot in Mauwari, a
                  prime commercial frontage at 4 No. Charnumber, or an
                  architectural villa in Manigram, our team handles every aspect
                  from official cadastral mapping to final deed transfer.
                </p>
                <p>
                  We believe buying a home or investing in land is the single
                  most important financial milestone for a family. We honor that
                  responsibility by treating every transaction as if it were our
                  own.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#listings"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  <span>View listings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={siteConfig.telephoneLink}
                  className="inline-flex items-center rounded-md border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium px-5 py-2.5 transition-colors"
                >
                  Speak with our founder
                </a>
              </div>
            </div>

            <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Hari Om Real Estate client consultation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Values */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <Container>
          <div className="max-w-2xl mb-10">
            <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-3">
              Our Principles
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              What sets Hari Om apart
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Transparent commitments that make us the first choice for families
              and investors in Rupandehi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-lg border border-slate-200 p-6"
              >
                <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Team */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl mb-10">
            <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-3">
              Leadership Team
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Meet your local advisors
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Experienced professionals dedicated to guiding your real estate
              journey with complete legal rigor and market honesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="rounded-lg overflow-hidden border border-slate-200 bg-white"
              >
                <div className="relative aspect-4/3 bg-slate-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    {member.name}
                  </h3>
                  <div className="text-xs font-medium text-orange-600 mt-0.5 mb-3">
                    {member.role}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Office & map */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <Container>
          <div className="max-w-2xl mb-10">
            <div className="text-[11px] font-semibold text-orange-600 uppercase tracking-wider mb-3">
              Headquarters
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Visit our office in Manigram
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Conveniently situated along the Siddhartha Highway corridor in
              Tilotama-8.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Contact card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-semibold mb-5">
                  HO
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Hari Om Real Estate
                </h3>
                <p className="text-sm text-slate-500 mb-6 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{siteConfig.address.full}</span>
                </p>

                <div className="space-y-3 text-sm border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={siteConfig.telephoneLink}
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      {siteConfig.phoneFormatted}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{siteConfig.openingHours}</span>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  siteConfig.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 transition-colors"
              >
                <span>Book an appointment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 relative min-h-[350px] rounded-lg overflow-hidden border border-slate-200">
              <iframe
                title="Hari Om Real Estate Location Map"
                src="https://maps.google.com/maps?q=Manigram,Tilottama,Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[350px] border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 6. CTA */}
      <section className="py-16 sm:py-20 border-t border-slate-100">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Looking to buy or sell property in Butwal?
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-8">
              Contact our advisors today for a confidential, no-obligation
              valuation and consultation.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                  siteConfig.whatsappDefaultMessage
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Inquire on WhatsApp
              </a>
              <Link
                href="/#listings"
                className="inline-flex items-center rounded-md border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium px-5 py-2.5 transition-colors"
              >
                Browse all listings
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}