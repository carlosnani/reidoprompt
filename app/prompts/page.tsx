import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryHeader } from "@/components/prompts/GalleryHeader";
import { GalleryGrid } from "@/components/prompts/GalleryGrid";
import { GalleryPagination } from "@/components/prompts/GalleryPagination";
import { fetchPrompts } from "@/lib/data/mockPrompts";

export const metadata: Metadata = {
  title: "Galeria de Prompts | Rei do Prompt",
  description: "Explore prompts premium para criação de imagens cinematográficas, retratos, cenas urbanas e identidades visuais realistas.",
};

export default async function PromptsGalleryPage() {
  const prompts = await fetchPrompts();

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] selection:bg-green-neon/30 selection:text-white">
      {/* 
        Background Effects (Opcionais, para dar a cara de "SaaS milionário") 
        Grid bem suave e um glow verde lá no fundo superior.
      */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-neon/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Header Global */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">
        <GalleryHeader />
        
        {/* Passando os dados do Supabase */}
        <GalleryGrid prompts={prompts} />
        
        <GalleryPagination />
      </main>

      {/* Footer Global */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
