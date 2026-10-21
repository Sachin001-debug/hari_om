import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import { Providers } from "@/providers/Providers";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col font-sans bg-bg text-text selection:bg-accent-light selection:text-accent-hover">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
