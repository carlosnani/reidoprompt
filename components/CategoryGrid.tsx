import { getCategoriesWithCount } from "@/lib/supabase/queries";
import { getCategoryConfig } from "@/lib/category-config";
import { Card } from "./ui/card";
import Image from "next/image";

/**
 * Seção de categorias dinâmica que busca dados do banco de dados
 * Exibe categorias com contagem real de prompts
 */
export async function CategoryGrid() {
  const categories = await getCategoriesWithCount(8);

  // Formata contagem de prompts
  const formatPromptCount = (count: number) => {
    if (count > 999) {
      return `${(count / 1000).toFixed(1)}k+ prompts`;
    }
    return `${count}+ prompts`;
  };

  return (
    <section id="categorias" className="py-24 px-6 max-w-[1440px] mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Milhares de prompts <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-dark">criados para você.</span>
        </h2>
        <p className="text-gray-400 text-lg">Explore coleções organizadas por nicho e objetivo.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const config = getCategoryConfig(cat.name);
          const Icon = config.icon;
          
          // Fallback logic: use last registered image from database, otherwise fall back to pre-configured image
          const imageSrc = cat.last_image || config.image;
          
          return (
            <Card 
              key={cat.id}
              className="group relative h-64 overflow-hidden cursor-pointer border border-white/10 hover:border-green-neon/50 transition-all duration-300 bg-neutral-950"
            >
              {/* 🖼️ Background Image */}
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
              )}
              
              {/* 🌑 Gradient Overlay para Legibilidade */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/90 group-hover:via-black/70 transition-colors duration-300" />
              
              {/* 💡 Efeito de Glow no Hover (Estilo Premium) */}
              <div className="absolute inset-0 bg-green-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />

              {/* 📝 Conteúdo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-green-neon/15 group-hover:scale-110 transition-all duration-300 border border-white/10 shadow-lg">
                  <Icon className="w-7 h-7 text-gray-300 group-hover:text-green-neon transition-colors duration-300 drop-shadow-md" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-sm">{cat.name}</h3>
                <p className="text-sm text-gray-400 font-medium">{formatPromptCount(cat.prompt_count)}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}