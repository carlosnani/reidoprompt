"use client";

import { PlayCircle } from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";

export function BlogReviews() {
  const posts = [
    { title: "Como o ChatGPT mudou o copywriting", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" },
    { title: "Midjourney v6 vs DALL-E 3: Qual o melhor?", img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop" },
    { title: "Automatizando vendas com n8n passo a passo", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" },
    { title: "Os 10 melhores prompts para SEO em 2026", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&auto=format&fit=crop" },
    { title: "Criando avatares ultra-realistas", img: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=800&auto=format&fit=crop" },
    { title: "Guia definitivo do Claude 3.5 Sonnet", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" },
    { title: "Sora: O futuro do vídeo gerado por IA", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" },
    { title: "Como ganhar dinheiro vendendo prompts", img: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <section id="blog" className="py-24 px-6 max-w-[1440px] mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Avaliações e Guias de IA
        </h2>
        <p className="text-gray-400 text-lg">Mantenha-se atualizado com os melhores conteúdos práticos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post, i) => (
          <Card 
            key={i}
            className="group bg-transparent border-none shadow-none cursor-pointer p-4"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-green-neon/50 transition-colors">
              <Image 
                src={post.img} 
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-green-neon group-hover:scale-110 transition-all drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-green-neon transition-colors">
              {post.title}
            </h3>
          </Card>
        ))}
      </div>
    </section>
  );
}
