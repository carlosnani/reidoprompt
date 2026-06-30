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
import { getCategories, getPrompts } from "@/lib/supabase/queries";

export default async function Home() {
  const { data: categories } = await getCategories(10); // Fetch up to 10 categories for the hero

  let dbPrompts: any[] = [];
  try {
    const { data } = await getPrompts({ limit: 18, orderBy: 'recentes' });
    dbPrompts = data || [];
  } catch (err) {
    console.error("Erro ao buscar prompts reais para o carrossel:", err);
  }

  const mappedPrompts = dbPrompts.map((p: any) => {
    const mainCategory = p.prompt_categories && p.prompt_categories.length > 0
      ? p.prompt_categories[0].category?.name
      : undefined;

    return {
      id: p.id,
      title: p.title || p.tag,
      image: p.image,
      category: mainCategory
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <HeroHome categories={categories} />
        <PromptGallery initialPrompts={mappedPrompts} />
        <CategoryGrid />
        {/* <Automations /> */}
        <HowItWorks />
        {/* <ToolsGrid /> */}
        <PremiumPrompts />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
