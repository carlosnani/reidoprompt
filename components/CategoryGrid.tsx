"use client";

import { Palette, Camera, Megaphone, PenTool, Ghost, Trophy, Briefcase, Box } from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";

// 💡 Dica: Substitua as URLs Unsplash por caminhos locais em `/public/home/` quando tiver as artes finais
const categories = [
  { icon: Palette, title: "Arte & Design", count: "1.2k+ prompts", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80" },
  { icon: Camera, title: "Fotografia", count: "850+ prompts", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
  { icon: Megaphone, title: "Marketing Digital", count: "2.1k+ prompts", image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80" },
  { icon: PenTool, title: "Logo Design", count: "420+ prompts", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80" },
  { icon: Ghost, title: "Personagens", count: "600+ prompts", image: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80" },
  { icon: Trophy, title: "Futebol", count: "310+ prompts", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80" },
  { icon: Briefcase, title: "Negócios", count: "1.5k+ prompts", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" },
  { icon: Box, title: "Efeitos 3D", count: "345+ prompts", image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=800&q=80" },
];

export function CategoryGrid() {
  return (
    <section id="categorias" className="py-24 px-6 max-w-[1440px] mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Milhares de prompts <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-dark">criados para você.</span>
        </h2>
        <p className="text-gray-400 text-lg">Explore coleções organizadas por nicho e objetivo.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <Card 
            key={i}
            className="group relative h-64 overflow-hidden cursor-pointer border border-white/10 hover:border-green-neon/50 transition-all duration-300"
          >
            {/* 🖼️ Background Image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            
            {/* 🌑 Gradient Overlay para Legibilidade */}
            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/90 group-hover:via-black/70 transition-colors duration-300" />
            
            {/* 💡 Efeito de Glow no Hover (Estilo Premium) */}
            <div className="absolute inset-0 bg-green-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />

            {/* 📝 Conteúdo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-green-neon/15 group-hover:scale-110 transition-all duration-300 border border-white/10 shadow-lg">
                <cat.icon className="w-7 h-7 text-gray-300 group-hover:text-green-neon transition-colors duration-300 drop-shadow-md" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-sm">{cat.title}</h3>
              <p className="text-sm text-gray-400 font-medium">{cat.count}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import { Palette, Camera, Megaphone, PenTool, Ghost, Trophy, Briefcase, Box } from "lucide-react";
// import { Card } from "./ui/card";

// const categories = [
//   { icon: Palette, title: "Arte & Design", count: "1.2k+ prompts" },
//   { icon: Camera, title: "Fotografia", count: "850+ prompts" },
//   { icon: Megaphone, title: "Marketing Digital", count: "2.1k+ prompts" },
//   { icon: PenTool, title: "Logo Design", count: "420+ prompts" },
//   { icon: Ghost, title: "Personagens", count: "600+ prompts" },
//   { icon: Trophy, title: "Futebol", count: "310+ prompts" },
//   { icon: Briefcase, title: "Negócios", count: "1.5k+ prompts" },
//   { icon: Box, title: "Efeitos 3D", count: "345+ prompts" },
// ];

// export function CategoryGrid() {
//   return (
//     <section id="categorias" className="py-24 px-6 max-w-[1440px] mx-auto relative z-10">
//       <div className="text-center mb-16">
//         <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
//           Milhares de prompts <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-dark">criados para você.</span>
//         </h2>
//         <p className="text-gray-400 text-lg">Explore coleções organizadas por nicho e objetivo.</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {categories.map((cat, i) => (
//           <Card 
//             key={i}
//             className="group bg-black/40 border border-white/5 hover:border-green-neon/50 p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:bg-green-deep/10 hover:-translate-y-1 relative overflow-hidden"
//           >
//             {/* Glow effect on hover */}
//             <div className="absolute inset-0 bg-green-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            
//             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-green-neon/10 group-hover:text-green-neon transition-colors duration-300 border border-white/5 group-hover:border-green-neon/30 relative z-10">
//               <cat.icon className="w-6 h-6 text-gray-300 group-hover:text-green-neon transition-colors duration-300" />
//             </div>
            
//             <h3 className="text-lg font-semibold text-white mb-2 relative z-10">{cat.title}</h3>
//             <p className="text-sm text-gray-500 font-medium relative z-10">{cat.count}</p>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }
