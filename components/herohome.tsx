"use client";

import { Search, Sparkles, Users, Download, Layers, Star, RefreshCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 0 
}: { 
  value: number, 
  prefix?: string, 
  suffix?: string,
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,        
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = prefix + new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(latest) + suffix;
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value, prefix, suffix, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)}
      {suffix}
    </span>
  );
}

export function HeroHome() {
  const tags = [
    "Mais Acessados", "Novo", "SEO", "ChatGPT", 
    "Midjourney", "Vídeo", "Marketing", "Automação"
  ];
  
  const stats = [
    { icon: Sparkles, value: 564, prefix: "+", label: "prompts premium" },
    { icon: Users, value: 2983, prefix: "+", label: "usuários ativos" },
    { icon: Download, value: 5700, prefix: "+", label: "downloads" },
    { icon: Layers, value: 190, prefix: "+", label: "categorias" },
    { icon: Star, value: 3.3, prefix: "+", suffix: "k", decimals: 1, label: "avaliações" },
    { icon: RefreshCcw, value: 24, prefix: "+", label: "atualizações" },
  ];

  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[90vh] w-full">
      {/* 🖼️ Background Image with Parallax-like feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home/hero-bg.jpg"
          alt="AI Technology Background"
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        {/* 🌑 Overlays para legibilidade e estética premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-green-neon)_0%,_transparent_70%)] opacity-[0.03]" />
      </div>

      {/* 📝 Conteúdo Principal */}
      <div className="relative z-10 max-w-5xl w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-deep/20 border border-green-neon/20 text-green-neon text-xs md:text-sm font-semibold tracking-wide uppercase backdrop-blur-md shadow-[0_0_15px_rgba(72,255,36,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-neon"></span>
            </span>
            A maior biblioteca premium do Brasil
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Domine a <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon via-green-400 to-green-dark drop-shadow-[0_0_30px_rgba(72,255,36,0.3)]">
              Inteligência Artificial
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Acesso imediato aos melhores prompts profissionais para 
            <span className="text-white font-medium ml-1">alavancar sua produtividade e criatividade.</span>
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-green-neon/20 to-green-dark/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-2xl focus-within:border-green-neon/40 focus-within:bg-white/10 transition-all shadow-2xl shadow-black/50">
            <Search className="w-6 h-6 text-gray-500 ml-4 shrink-0" />
            <Input 
              type="text" 
              placeholder="O que você deseja criar hoje? (ex: SEO para blog)" 
              className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-14 text-white placeholder:text-gray-500"
            />
            <Button className="rounded-xl bg-green-neon text-black hover:bg-green-neon/90 px-10 h-14 font-bold text-lg transition-all shadow-[0_0_20px_rgba(72,255,36,0.4)] hover:scale-105 active:scale-95">
              Explorar
            </Button>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-sm text-gray-500 mr-2">Sugestões:</span>
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="px-4 py-1.5 rounded-lg border-white/5 bg-white/5 hover:bg-green-neon hover:text-black hover:border-green-neon transition-all duration-300 cursor-pointer text-sm text-gray-400 font-medium"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mt-20 pt-10 border-t border-white/5"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1 group">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-green-neon/10 transition-colors">
                <stat.icon className="w-5 h-5 text-green-neon/70 group-hover:text-green-neon transition-colors" />
              </div>
              <span className="text-2xl font-black text-white">
                <Counter 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  decimals={stat.decimals} 
                />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}