"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Building2 } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navbar styles based on page and scroll position
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent py-5 text-white"
          : "bg-surface/95 backdrop-blur-md py-3.5 shadow-sm border-b border-border text-text"
      }`}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isTransparent
                ? "bg-white/15 text-accent-light group-hover:bg-white/25"
                : "bg-primary text-white shadow-xs group-hover:bg-primary-dark"
            }`}
          >
            <Building2 className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif font-bold text-lg sm:text-xl tracking-tight leading-none ${
                isTransparent ? "text-white" : "text-primary"
              }`}
            >
              Hari Om
            </span>
            <span
              className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
                isTransparent ? "text-slate-300" : "text-muted"
              }`}
            >
              Real Estate
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {siteConfig.navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace("/#", ""));

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors relative py-1 hover:text-accent ${
                  isTransparent
                    ? isActive
                      ? "text-white font-semibold"
                      : "text-slate-200 hover:text-white"
                    : isActive
                    ? "text-primary font-semibold"
                    : "text-text hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Call Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={siteConfig.telephoneLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-accent hover:bg-accent-hover text-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href={siteConfig.telephoneLink}
            className="p-2 rounded-xl bg-accent text-white"
            aria-label="Call Hari Om Real Estate"
          >
            <Phone className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl transition-colors ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-text hover:bg-bg"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200 text-text">
          <nav className="flex flex-col space-y-3">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl font-medium text-text hover:bg-bg hover:text-primary transition-colors text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <div className="text-xs text-muted mb-1">
              {siteConfig.address.full}
            </div>
            <a
              href={siteConfig.telephoneLink}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-accent text-white text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Call {siteConfig.phoneFormatted}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

