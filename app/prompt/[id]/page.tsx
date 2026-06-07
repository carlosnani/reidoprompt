import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getPromptById, isFavorite, incrementPromptViews } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/supabase/auth";
import { ImageGallery } from "@/components/prompt-detail/ImageGallery";
import { PromptDetails } from "@/components/prompt-detail/PromptDetails";
import { PromptText } from "@/components/prompt-detail/PromptText";
import { RelatedPrompts } from "@/components/prompt-detail/RelatedPrompts";

import { fetchSiteSettings } from "@/lib/supabase/site-settings";

export async function generateMetadata(props: PromptPageProps): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const [prompt, settings] = await Promise.all([
    getPromptById(params.id),
    fetchSiteSettings(supabase)
  ]);

  if (!prompt) return {};

  const title = `${prompt.title || prompt.tag} - Prompt para IA`;
  const description = prompt.description || `Veja como gerar esta imagem usando o prompt de ${prompt.tag} no Rei do Prompt.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${settings.platform_name}`,
      description,
      images: [
        {
          url: prompt.image,
          width: 1200,
          height: 630,
          alt: prompt.title || prompt.tag,
        },
      ],
    },
  };
}

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromptPage(props: PromptPageProps) {
  const params = await props.params;

  // Incrementar visualizações
  try {
    await incrementPromptViews(params.id);
  } catch (err) {
    console.error("Failed to increment views:", err);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let prompt;
  let favorited = false;
  const userIsPro = isPro(user);

  try {
    const basicPrompt = await getPromptById(params.id);
    
    if (user) {
      favorited = await isFavorite(user.id, params.id);
    }

    const isRestricted = basicPrompt.is_premium && !userIsPro;

    // Convert to DetailedPrompt using real data from Supabase
    prompt = {
      ...basicPrompt,
      title: basicPrompt.title || basicPrompt.tag,
      categories:
        basicPrompt.prompt_categories && basicPrompt.prompt_categories.length > 0
          ? basicPrompt.prompt_categories.map((item) => item.category)
          : basicPrompt.category
          ? [{ id: basicPrompt.category, name: basicPrompt.category, slug: basicPrompt.category.toLowerCase() }]
          : [],
      description: basicPrompt.description || "Um prompt profissional e altamente otimizado para gerar imagens de altíssima qualidade.",
      // SECURITY: Redact prompt text on server if user is not Pro
      prompt_text: isRestricted ? undefined : basicPrompt.prompt_text,
      promptText: isRestricted 
        ? null 
        : (basicPrompt.prompt_text || `A highly detailed ${basicPrompt.category?.toLowerCase() || 'artistic'} scene of ${basicPrompt.tag.toLowerCase()}, masterpiece, 8k resolution, photorealistic.`),
      images: basicPrompt.images && basicPrompt.images.length > 0 ? basicPrompt.images : [basicPrompt.image],
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    notFound();
  }

  if (!prompt) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] selection:bg-green-neon/30 selection:text-white">
      {/* Background Effects */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[600px] bg-green-neon/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-50">
        <Header />
      </div>

      <main className="flex-grow relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        
        {/* Back Button */}
        <Link 
          href="/prompts"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Voltar para Prompts
        </Link>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full">
            <ImageGallery key={prompt.id} prompt={prompt} />
          </div>

          {/* Right Column: Details & Prompt */}
          <div className="w-full flex flex-col">
            <PromptDetails prompt={prompt} isFavorited={favorited} />
            <PromptText prompt={prompt} />
          </div>

        </div>

        {/* Bottom Section: Related */}
        <RelatedPrompts />

      </main>

      <div className="relative z-50 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
