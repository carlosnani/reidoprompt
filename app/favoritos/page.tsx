"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/prompts/GalleryGrid";
import { GalleryPagination } from "@/components/prompts/GalleryPagination";
import { mockPrompts } from "@/lib/data/mockPrompts";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritosPage() {
  // Simulando que o usuário favoritou os 10 primeiros prompts para preencher a tela
  const favoritePrompts = mockPrompts.slice(0, 10);

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 flex flex-col items-center justify-center text-center"
        >
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
        </motion.div>
        
        {favoritePrompts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GalleryGrid prompts={favoritePrompts} />
            <div className="mt-20">
              <GalleryPagination />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl max-w-4xl mx-auto"
          >
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
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
