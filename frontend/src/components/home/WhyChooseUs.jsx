import React from "react";
import { ShieldCheck, MapPinned, BadgePercent } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Legal Title Verification",
    description:
      "Every plot and home undergoes complete land revenue registry checks, cadastral map verification, and boundary demarcation before listing.",
  },
  {
    icon: MapPinned,
    title: "Deep Local Roots in Butwal",
    description:
      "Over 15 years guiding families and investors through Butwal, Tilottama-8 Manigram, Sukhanagar, and Siddhartha highway expansion corridors.",
  },
  {
    icon: BadgePercent,
    title: "Direct Dealing & Clear Pricing",
    description:
      "Transparent negotiation directly with property owners. Open land rates in Dhur and Katha with clear road widths and future potential.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-surface border-t border-border">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={idx} delay={idx * 100} direction="up">
                <div className="flex flex-col items-start p-6 rounded-2xl bg-bg border border-border/80 h-full hover:border-primary/30 transition-all hover:shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-accent-light text-accent-hover flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default WhyChooseUs;

