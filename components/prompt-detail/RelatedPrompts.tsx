"use client";

import { useState, useEffect } from "react";
import { Prompt, fetchPrompts } from "@/lib/data/mockPrompts";
import { PromptCard } from "@/components/prompts/PromptCard";
import { Sparkles } from "lucide-react";

export function RelatedPrompts() {
  const [related, setRelated] = useState<Prompt[]>([]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const prompts = await fetchPrompts(10);
        const shuffled = [...prompts].sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelated(shuffled);
      } catch (error) {
        console.error('Error loading related prompts:', error);
      }
    };

    loadRelated();
  }, []);

  if (related.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-white/5">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="w-6 h-6 text-green-neon" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Prompts Relacionados</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {related.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
