"use client";

import { Crown, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";

export function PremiumPrompts() {
  const prompts = [
    "Prompt Mestre para Marketing Viral",
    "Gerador de Conteúdo Infinito",
    "Especialista em Vendas no WhatsApp",
    "Copywriter Automático",
    "Consultor SEO Supremo",
    "Máquina de Reels Virais"
  ];

  return (
    <>
    
    </>
    // <section className="py-24 px-6 max-w-360 mx-auto">
    //   <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
    //     <div>
    //       <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
    //         Outros Prompts Premium
    //       </h2>
    //       <p className="text-green-neon text-lg">Muito além do básico</p>
    //     </div>
    //     <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-green-neon transition-colors group">
    //       Ver todos os prompts
    //       <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    //     </button>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {prompts.map((title, i) => (
    //       <Card 
    //         key={i}
    //         className="group bg-black/60 border border-green-deep/30 hover:border-green-neon/50 p-8 cursor-pointer transition-all duration-300 hover:bg-green-deep/10 hover:shadow-[0_0_20px_rgba(72,255,36,0.1)] relative overflow-hidden"
    //       >
    //         {/* Background pattern */}
    //         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
    //           <Crown className="w-16 h-16 text-green-neon" />
    //         </div>
            
    //         <div className="w-10 h-10 rounded-full bg-green-neon/10 flex items-center justify-center mb-6 border border-green-neon/20 group-hover:bg-green-neon/20 transition-colors">
    //           <Crown className="w-5 h-5 text-green-neon" />
    //         </div>
            
    //         <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-neon transition-colors">{title}</h3>
    //         <p className="text-gray-400 text-sm mb-6 line-clamp-2">
    //           Acesso exclusivo a estruturas avançadas testadas e aprovadas para gerar resultados acima da média.
    //         </p>
            
    //         <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
    //           <span className="text-xs font-bold uppercase tracking-wider text-green-neon">Premium</span>
    //           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-neon group-hover:text-black transition-all">
    //             <ArrowRight className="w-4 h-4" />
    //           </div>
    //         </div>
    //       </Card>
    //     ))}
    //   </div>
    // </section>
  );
}
