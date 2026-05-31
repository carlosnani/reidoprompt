import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryHeader } from "@/components/prompts/GalleryHeader";
import { GalleryGrid } from "@/components/prompts/GalleryGrid";
import { GalleryPagination } from "@/components/prompts/GalleryPagination";
import { getPrompts, getCategories, getUserFavorites } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Galeria de Prompts | Rei do Prompt",
  description: "Explore prompts premium para criação de imagens cinematográficas, retratos, cenas urbanas e identidades visuais realistas.",
};

import { AppPagination } from "@/components/AppPagination";

export default async function PromptsGalleryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
    category?: string; 
    sort?: string;
  }> 
}) {
  const params = await searchParams;
  const { data: categories } = await getCategories();
  const currentPage = Number(params.page) || 1;
  const search = params.search || "";
  const categoryId = params.category || undefined;
  const sort = (params.sort as any) || "recentes";
  
  const limit = 12;
  const offset = (currentPage - 1) * limit;

  const { data: prompts, count } = await getPrompts({
    limit,
    offset,
    search,
    categoryId,
    orderBy: sort
  });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const favorites = user ? await getUserFavorites(user.id) : [];
  const favoriteIds = new Set(favorites.map(f => f.prompt_id));
  const isCommonUser = user ? !isAdmin(user) : false;
  const showFavoriteButton = !isCommonUser;
  
  const totalPages = Math.ceil(count / limit);
  const baseUrl = "/prompts";
  
  // Construct baseUrl with existing search/category/sort for pagination links
  const urlParams = new URLSearchParams();
  if (search) urlParams.set('search', search);
  if (categoryId) urlParams.set('category', categoryId);
  if (sort) urlParams.set('sort', sort);
  const paginationBaseUrl = urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl;

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
        <GalleryHeader categories={categories} />
        
        {/* Passando os dados do Supabase */}
        <GalleryGrid prompts={prompts} favoriteIds={favoriteIds} showFavoriteButton={showFavoriteButton} />
        
        {prompts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-xl mb-4">Nenhum prompt encontrado para esta busca.</p>
            <Link href="/prompts">
              <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                Limpar filtros
              </Button>
            </Link>
          </div>
        )}

        <AppPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          baseUrl={paginationBaseUrl} 
          className="mt-16 mb-8 animate-in fade-in duration-1000 delay-300"
        />
      </main>

      {/* Footer Global */}
      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
