"use client";

import { useState } from "react";
import { DetailedPrompt } from "@/lib/data/mockPrompts";
import { Eye, Heart, Tag } from "lucide-react";
import Image from "next/image";

interface ImageGalleryProps {
  prompt: DetailedPrompt;
}

export function ImageGallery({ prompt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = prompt?.images || [];
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      
      {/* 🖼️ IMAGEM PRINCIPAL */}
      <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
        
        {/* IMAGEM */}
        <Image
          src={activeImage}
          alt={prompt.title}
          fill
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          
          {/* TAG */}
          <div className="mb-auto mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
              <Tag className="w-3 h-3 text-green-400" />
              {prompt.tag}
            </span>
          </div>

          {/* STATS */}
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {prompt.views.toLocaleString("pt-BR")}
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {prompt.likes.toLocaleString("pt-BR")}
            </div>
          </div>
        </div>
      </div>

      {/* 🧩 THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${img}-${index}`}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border transition-all duration-300 z-10
                  ${
                    isActive
                      ? "ring-2 ring-green-400 scale-95"
                      : "opacity-60 hover:opacity-100 hover:scale-105 border-white/10"
                  }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Variação ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
