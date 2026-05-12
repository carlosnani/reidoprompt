import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromptGallery } from "@/components/PromptGallery";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { ToolsGrid } from "@/components/ToolsGrid";
import { PremiumPrompts } from "@/components/PremiumPrompts";
import { Automations } from "@/components/Automations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";


export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <Hero />
        <PromptGallery />
        <CategoryGrid />
        {/* <Automations /> */}
        <HowItWorks />
        <ToolsGrid />
        <PremiumPrompts />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
