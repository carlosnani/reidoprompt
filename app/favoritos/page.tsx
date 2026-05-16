import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/prompts/GalleryGrid";
import { GalleryPagination } from "@/components/prompts/GalleryPagination";
import { getUserFavorites } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FavoritosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-green-neon/30 selection:text-white overflow-hidden">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-green-neon mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Acesse sua conta</h1>
            <p className="text-gray-400 mb-8">Faça login para ver seus prompts favoritos</p>
            <Link href="/auth/login">
              <Button className="bg-green-neon hover:bg-green-neon/80 text-black font-semibold">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let favoritePrompts: any[] = [];
  try {
    const favorites = await getUserFavorites(user.id);
    favoritePrompts = favorites.map((fav: any) => fav.prompts);
  } catch (error) {
    console.error("Error loading favorites:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-green-neon/30 selection:text-white overflow-hidden">
      {/* 🌌 Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_var(--color-green-neon)_0%,_transparent_50%)] opacity-[0.05]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-50">
        <Header />
      </div>

      <main className="flex-grow relative z-10 pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto w-full">
        {/* Header Específico de Favoritos */}
        <div className="mb-20 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-neon/10 border border-green-neon/20 text-green-neon text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-8">
            <Heart className="w-3 h-3 fill-current" />
            Sua Coleção Pessoal
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white mb-6">
            Meus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon via-green-400 to-green-dark">
              Favoritos
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Todos os prompts que você curtiu e salvou para usar mais tarde estão aqui, organizados para sua produtividade.
          </p>
        </div>
        
        {favoritePrompts.length > 0 ? (
          <div className="animate-in fade-in duration-500 delay-200">
            <GalleryGrid prompts={favoritePrompts} />
            <div className="mt-20">
              <GalleryPagination />
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Heart className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Nenhum favorito ainda</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">Explore a galeria e clique no coração para salvar seus prompts preferidos.</p>
            <Link href="/prompts">
              <Button className="bg-green-neon text-black hover:bg-green-neon/90 font-bold px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(72,255,36,0.2)]">
                Explorar Prompts
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
