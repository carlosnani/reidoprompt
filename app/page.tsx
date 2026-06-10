import { Header } from "@/components/Header";
import { HeroHome } from "@/components/herohome";
import { PromptGallery } from "@/components/PromptGallery";
import { CategoryGrid } from "@/components/CategoryGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { ToolsGrid } from "@/components/ToolsGrid";
import { PremiumPrompts } from "@/components/PremiumPrompts";
//import { Automations } from "@/components/Automations";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { getCategories } from "@/lib/supabase/queries";

// This is the main page of the application, which serves as the landing page for users. It includes various sections such as the header, hero, prompt gallery, category grid, how it works, tools grid, premium prompts, and a call to action. The footer is also included at the bottom of the page.

export default async function Home() {
  const { data: categories } = await getCategories(10); // Fetch up to 10 categories for the hero

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <HeroHome categories={categories} />
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
