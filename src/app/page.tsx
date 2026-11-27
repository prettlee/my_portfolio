import { PortfolioScene } from "@/components/canvas";
import { SiteHeader } from "@/components/layout";
import { Hero } from "@/components/sections";
import { Vignette } from "@/components/ui";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-void">
      <PortfolioScene />
      <Vignette />
      <SiteHeader />
      <Hero />
    </main>
  );
}
