"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const themes = [
  { name: "Futebol", img: "/home/futebol-theme.jpg" },
  { name: "Marketing", img: "/home/marketing.jpg" },
  { name: "Personagens", img: "/home/personagem3D.jpg" },
  { name: "Tecnologia", img: "/home/tecnologia.jpg" },
  { name: "Reels", img: "/home/video.jpg" },
  { name: "Influenciadores", img: "/home/influencer.jpg" },
  { name: "Moda", img: "/home/moda.jpg" },
  { name: "Arte Digital", img: "/home/arte-digital.jpg" },
  { name: "Thumbnail YouTube", img: "/home/thumbnail-youtube.jpg" },
  { name: "UI Design", img: "/home/ui-design.jpg" },
  { name: "Cyberpunk", img: "/home/cyberpunk.jpg" },
  { name: "Natureza", img: "/home/natureza.jpg" },
  { name: "Arquitetura", img: "/home/arquitetura.jpg" },
  { name: "Animes", img: "/home/anime.jpg" },
  { name: "Logo Design", img: "/home/logo-design.jpg" },
  { name: "3D Renders", img: "/home/3d-render.jpg" },
  { name: "E-commerce", img: "/home/ecommerce.jpg" },
  { name: "Fotografia", img: "/home/fotografia.jpg" },  
];

export function PromptGallery() {
  const row1 = themes.slice(0, 9);
  const row2 = themes.slice(9);

  return (
    <section className="py-24 bg-[#050505] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-px bg-green-neon/50"></div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-green-neon font-bold">Categorias em Destaque</h2>
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white mt-4"
        >
          Explore infinitas <br /> <span className="text-gray-600">possibilidades.</span>
        </motion.h3>
      </div>

      <style>{`
        @keyframes marquee-forward {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-forward {
          animation: marquee-forward 60s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
        .marquee-container:hover .animate-marquee-forward,
        .marquee-container:hover .animate-marquee-reverse {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="marquee-container space-y-8 relative">
        {/* Row 1 */}
        <div className="flex w-max animate-marquee-forward hover:pause">
          {[...row1, ...row1].map((theme, i) => (
            <div key={`${theme.name}-r1-${i}`} className="pr-6">
              <GalleryCard theme={theme} />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-max animate-marquee-reverse hover:pause">
          {[...row2, ...row2].map((theme, i) => (
            <div key={`${theme.name}-r2-${i}`} className="pr-6">
              <GalleryCard theme={theme} />
            </div>
          ))}
        </div>

        {/* Gradients masks */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}

function GalleryCard({ theme }: { theme: typeof themes[0] }) {
  return (
    <Link 
      href="/prompts"
      className="group relative block w-72 h-96 rounded-2xl overflow-hidden cursor-pointer shrink-0 border border-white/5 hover:border-green-neon/30 transition-all duration-700 bg-white/5"
    >
      <Image 
        src={theme.img} 
        alt={theme.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-500"></div>
      
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">{theme.name}</h3>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
             <span className="text-green-neon text-xs">→</span>
          </div>
        </div>
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-green-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </Link>
  );
}