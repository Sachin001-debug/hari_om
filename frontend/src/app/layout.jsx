import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: `${siteConfig.name} | Verified Lands & Modern Homes in Butwal`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.shortDescription,
  keywords: [
    "Hari Om Real Estate",
    "Real Estate Butwal",
    "Land for sale in Butwal",
    "House for sale in Butwal",
    "Plots in Tilottama Manigram",
    "Real estate Manigram Tilotama-8",
    "Charnumber Butwal land",
    "Rupandehi real estate agent",
    "Property Nepal",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} | Verified Real Estate in Butwal & Tilottama`,
    description: siteConfig.shortDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Boutique Property Agency`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Butwal Real Estate`,
    description: siteConfig.shortDescription,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.shortDescription,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.area,
    addressRegion: siteConfig.address.province,
    postalCode: "32903",
    addressCountry: "NP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  priceRange: "Rs. 40 Lakh - Rs. 4 Crore",
  areaServed: ["Butwal", "Tilottama", "Bhairahawa", "Rupandehi"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-bg text-text selection:bg-accent-light selection:text-accent-hover">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
