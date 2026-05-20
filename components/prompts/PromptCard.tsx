import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, Tag } from "lucide-react";
import type { Prompt } from "@/lib/supabase/queries";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  // O masonry real é feito pelo break-inside-avoid e mb-4 no pai (GalleryGrid)
  return (
    <Link 
      href={`/prompt/${prompt.id}`}
      className="group relative block w-full rounded-sm overflow-hidden bg-white/5 border border-white/5 cursor-pointer"
    >
      {/* Container da Imagem com tamanho fixo (aspect ratio 3:4) */}
      <div className="relative w-full h-full aspect-[3/4] overflow-hidden">
        <Image 
          src={prompt.image} 
          alt={prompt.tag}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
          className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          
          {/* Tag & PRO Badge */}
          <div className="mb-auto mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg">
              <Tag className="w-3 h-3 text-green-neon" />
              {prompt.tag}
            </span>
            {prompt.is_premium && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-neon text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                PRO
              </span>
            )}
          </div>

          {/* Stats Footer */}
          <div className="flex items-center justify-between text-white/90">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                {prompt.views.toLocaleString("pt-BR")}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Heart className="w-4 h-4 text-gray-400 group-hover:text-green-neon transition-colors" />
                {prompt.likes.toLocaleString("pt-BR")}
              </div>
            </div>
            
            {/* Call to action sutil */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-green-neon/20 transition-colors">
              <ArrowUpRightIcon className="w-4 h-4 text-white group-hover:text-green-neon" />
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}

// Helper icon
function ArrowUpRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
