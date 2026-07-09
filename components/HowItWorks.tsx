"use client";

import Link from "next/link";
import { MousePointer2, Copy, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: MousePointer2,
      num: "01",
      title: "Escolha seu ponto de partida",
      desc: "Use um prompt pronto ou crie um fluxo próprio para a sua ideia."
    },
    {
      icon: Copy,
      num: "02",
      title: "Envie a referência",
      desc: "Você pode enviar apenas o prompt ou adicionar uma foto para guiar a geração."
    },
    {
      icon: Sparkles,
      num: "03",
      title: "Gere resultados melhores",
      desc: "A combinação certa de prompt + referência entrega imagens mais precisas."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-green-deep/5 skew-y-3 transform origin-bottom-left z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Como funciona em <span className="text-green-neon">3 passos</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Você pode gerar imagens com apenas um prompt ou enriquecer o resultado com uma foto de referência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
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

        <div className="mt-12 flex justify-center">
          <Link
            href="/tutorial"
            className="inline-flex items-center gap-2 rounded-full border border-green-neon/30 bg-green-neon/10 px-5 py-2.5 text-sm font-medium text-green-neon transition hover:bg-green-neon/20"
          >
            Saiba mais
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
