"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-32 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative group">
        {/* Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-green-neon/20 via-green-dark/10 to-transparent blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

        <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--color-green-neon)_0%,_transparent_50%)] opacity-[0.03]" />

          <div className="flex flex-col lg:flex-row items-center">

            {/* 📝 Left Content */}
            <div className="flex-1 p-8 md:p-16 lg:p-24 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-neon/10 border border-green-neon/20 text-green-neon text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3" />
                  Acesso pelo melhor preço! 🚀
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                  Pronto para <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-400">
                    elevar seu nível?
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
                  Junte-se a milhares de criadores que já estão dominando a IA com os prompts mais precisos do mercado brasileiro.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="h-16 px-10 rounded-2xl bg-green-neon cursor-pointer text-black hover:bg-white transition-all font-black text-lg shadow-[0_20px_40px_-10px_rgba(72,255,36,0.3)] hover:shadow-none group">
                    QUERO COMEÇAR AGORA
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" className="h-16 px-10 rounded-2xl text-white hover:bg-white/5 font-bold text-lg">
                    Ver Planos
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white text-sm font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 font-medium">
                    <span className="text-white font-bold">+2.9k</span> membros satisfeitos
                  </p>
                </div>
              </motion.div>
            </div>

            {/* 📱 Right Image (Mockup) */}
            <div className="flex-1 relative w-full h-[500px] lg:h-[700px] bg-transparent flex items-center justify-center lg:justify-end pr-0 lg:pr-20 overflow-hidden lg:overflow-visible">
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                whileInView={{ opacity: 1, x: 0, rotate: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-[280px] md:w-[320px] aspect-[9/19] overflow-hidden group-hover:rotate-[-5deg] transition-transform duration-700"
              >
                {/* Screen Content */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                  <Image
                    src="/home/mobile-site_.png"
                    alt="O Rei do Prompt Mobile App"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
