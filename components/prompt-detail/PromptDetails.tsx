import type { DetailedPrompt } from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, BookmarkPlus, Calendar, User } from "lucide-react";

interface PromptDetailsProps {
  prompt: DetailedPrompt;
}

export function PromptDetails({ prompt }: PromptDetailsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header and Title */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {prompt.is_premium && (
            <Badge className="bg-green-neon text-black hover:bg-green-neon/90 font-bold border-none">
              PRO
            </Badge>
          )}
          {prompt.categories.map((category, idx) => (
            <Badge key={idx} variant="secondary" className="bg-white/5 text-gray-300 hover:bg-white/10 border-white/10">
              {category.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          {prompt.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-neon" />
            <span className="text-gray-300">{prompt.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{prompt.date}</span>
          </div>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-white/10">

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{prompt.views.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Views</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{prompt.likes.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Likes</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white hover:bg-green-neon/10 hover:text-green-neon hover:border-green-neon/30 transition-all h-10">
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Favoritar
          </Button>
        </div>

      </div>
    </div>
  );
}
