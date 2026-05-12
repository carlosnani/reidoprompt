"use client";

import { Workflow, ArrowRight, Bot } from "lucide-react";
import { Card } from "./ui/card";

export function Automations() {
  const automations = [
    "Captura leads automática",
    "Atendimento IA WhatsApp",
    "Postador automático Instagram",
    "Funil de vendas IA",
    "CRM inteligente",
    "Agendamento automático"
  ];

  return (
    <section className="py-24 px-6 max-w-[1440px] mx-auto relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Workflow className="w-8 h-8 text-green-neon" />
            Workflows n8n Prontos
          </h2>
          <p className="text-gray-400 text-lg">Automação Instantânea para o seu negócio</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-green-neon transition-colors group">
          Ver todas as automações
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {automations.map((title, i) => (
          <Card 
            key={i}
            className="group bg-black/40 backdrop-blur-sm border border-white/10 hover:border-green-neon/40 p-1 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(72,255,36,0.12)] hover:-translate-y-1"
          >
            <div className="bg-gradient-to-b from-white/5 to-transparent p-6 rounded-lg h-full flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center group-hover:border-green-neon/30 group-hover:bg-green-deep/20 transition-all">
                  <Bot className="w-6 h-6 text-gray-300 group-hover:text-green-neon transition-colors" />
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 group-hover:text-green-neon group-hover:border-green-neon/30 transition-colors">
                  n8n workflow
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-6">Instale em 1 clique e comece a economizar horas de trabalho manual todos os dias.</p>
              
              <div className="mt-auto flex items-center text-sm font-medium text-green-neon group-hover:text-green-neon/80">
                Acessar fluxo
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
