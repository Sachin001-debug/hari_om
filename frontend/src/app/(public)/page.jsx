import { Suspense } from "react";
import { HomePageClient } from "@/components/home/HomePageClient";
import { Container } from "@/components/ui/Container";

function HomeLoadingFallback() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="h-[65vh] bg-primary-dark animate-pulse" />
      <Container className="py-16">
        <div className="h-10 w-64 bg-slate-200 rounded-md mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-4/3 bg-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoadingFallback />}>
      <HomePageClient />
    </Suspense>
  );
}

