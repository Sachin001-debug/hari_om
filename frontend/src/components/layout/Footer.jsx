import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary-dark text-slate-300 pt-16 pb-12 border-t border-white/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-white tracking-tight leading-none">
                  Hari Om
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-accent-light mt-0.5">
                  Real Estate
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Boutique real estate agency offering legal title assurance, transparent pricing, and handpicked residential and commercial lands across Butwal and Tilottama.
            </p>

        
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-base text-white tracking-wide mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#listings"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>All Properties</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?type=house#listings"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>Houses & Villas</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?type=plot#listings"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>Land & Plots</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?city=butwal#listings"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>Properties in Butwal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/?city=tilottama#listings"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>Properties in Tilottama</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span>About Our Agency</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-serif font-bold text-base text-white tracking-wide mb-4">
              Visit Our Office
            </h4>
            <div className="space-y-3.5 text-sm font-light">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-1" />
                <span>
                  {siteConfig.address.full}
                  <span className="block text-xs text-slate-400 mt-0.5">
                    (Next to Siddhartha Highway)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={siteConfig.telephoneLink}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.phoneFormatted}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {siteConfig.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{siteConfig.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Column 4: WhatsApp Direct & Assistance */}
          <div>
            <h4 className="font-serif font-bold text-base text-white tracking-wide mb-4">
              Need Instant Help?
            </h4>
            <p className="text-sm text-slate-300 font-light mb-4">
              Speak directly with our senior property consultant for valuation, spot visits, and paper clearance.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                siteConfig.whatsappDefaultMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Boutique Estate Experience</span>
            <span>•</span>
            <span>Rupandehi, Nepal</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

