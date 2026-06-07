"use client";

import { useState } from "react";
import type { DetailedPrompt } from "@/lib/supabase/queries";

interface ImageGalleryProps {
  prompt: DetailedPrompt;
}

export function ImageGallery({ prompt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = prompt?.images || [];
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col">
      
      {/* 🖼️ IMAGEM PRINCIPAL */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* IMAGEM */}
        <img
          src={activeImage}
          alt={prompt.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>

      {/* 🧩 THUMBNAILS */}
      {images.length >= 1 && (
        <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-4">
          {images.slice(0, 6).map((img, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${img}-${index}`}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 z-10
                  ${
                    isActive
                      ? "border-2 border-white scale-[0.98] shadow-lg shadow-white/5"
                      : "border-white/10 opacity-50 hover:opacity-100 hover:scale-[1.02]"
                  }`}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={img} 
                    alt={`Variação ${index + 1}`} 
                    className="w-full h-full object-cover" 
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

