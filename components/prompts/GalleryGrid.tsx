import type { Prompt } from "@/lib/supabase/queries";
import { PromptCard } from "./PromptCard";

interface GalleryGridProps {
  prompts: Prompt[];
  favoriteIds?: Set<string>;
}

export function GalleryGrid({ prompts, favoriteIds = new Set() }: GalleryGridProps) {
  return (
    <div className="w-full max-w-[1920px] mx-auto animate-in fade-in duration-1000 delay-150">
      {/* 
        Grid Layout fixo para imagens do mesmo tamanho
        O gap e as margens definem o espaçamento visual.
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-3">
        {prompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt} 
            isFavorited={favoriteIds.has(prompt.id)} 
          />
        ))}
      </div>
    </div>
  );
}
