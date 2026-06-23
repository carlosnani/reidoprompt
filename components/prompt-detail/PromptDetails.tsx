import type { DetailedPrompt } from "@/lib/supabase/queries";
import { Eye } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import Link from "next/link";

interface PromptDetailsProps {
  prompt: DetailedPrompt;
  isFavorited?: boolean;
}

export function PromptDetails({ prompt, isFavorited = false }: PromptDetailsProps) {
  return (
    <div className="flex flex-col">
      {/* Category Tag */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {prompt.categories.map((category, idx) => (
          <Link 
            key={idx} 
            href={`/prompts?category=${category.id}`}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#181818] border border-white/10 text-[11px] font-semibold text-gray-300 uppercase tracking-wider hover:bg-white/5 hover:border-white/20 hover:text-white transition-all cursor-pointer"
          >
            {category.name}
          </Link>
        ))}
        {prompt.is_premium && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-neon text-black text-[11px] font-bold uppercase tracking-wider">
            PRO
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8">
        {prompt.title}
      </h1>

      {/* Stats & Actions */}
      <div className="flex items-center justify-between py-6 border-b border-white/10 mb-8">
        {/* Left Side: Views */}
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white leading-none">
              {prompt.views.toLocaleString("pt-BR")}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">
              Visualizações
            </span>
          </div>
        </div>f

        {/* Right Side: Favorite Action */}
        <div className="flex items-center">
          <FavoriteButton promptId={prompt.id} initialIsFavorite={isFavorited} />
        </div>
      </div>
    </div>
  );
}

