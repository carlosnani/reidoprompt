"use client";

import { MousePointer2, Copy, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: MousePointer2,
      num: "01",
      title: "Escolha um Prompt",
      desc: "Navegue por nossa biblioteca premium e encontre o prompt perfeito."
    },
    {
      icon: Copy,
      num: "02",
      title: "Copie e Personalize",
      desc: "Copie com um clique e adicione seus detalhes específicos."
    },
    {
      icon: Sparkles,
      num: "03",
      title: "Gere com IA",
      desc: "Cole na sua IA favorita e obtenha resultados extraordinários."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-green-deep/5 skew-y-3 transform origin-bottom-left z-0"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Resultados incríveis em <span className="text-green-neon">3 passos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Connection line between steps (desktop) */}
              {i !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-[1px] bg-gradient-to-r from-green-neon/50 to-transparent"></div>
              )}
              
              <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center relative mb-6 group-hover:border-green-neon/50 transition-colors duration-500 z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(72,255,36,0.2)]">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-neon text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(72,255,36,0.6)]">
                  {step.num}
                </div>
                <step.icon className="w-10 h-10 text-gray-300 group-hover:text-green-neon transition-colors duration-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
