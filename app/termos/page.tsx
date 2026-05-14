"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Shield, HelpCircle, HeadphonesIcon } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

function AnimSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const legalLinks = [
  {
    icon: FileText,
    title: "Termos de Uso",
    description: "Condições de uso da plataforma, acesso aos prompts, assinaturas, cancelamentos e proibição de redistribuição.",
    href: "/termos-de-uso",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20 hover:border-blue-400/40",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Shield,
    title: "Política de Privacidade",
    description: "Como coletamos, usamos e protegemos seus dados pessoais em conformidade total com a LGPD.",
    href: "/privacidade",
    color: "from-purple-500/10 to-transparent",
    border: "border-purple-500/20 hover:border-purple-400/40",
    iconBg: "bg-purple-500/10 border-purple-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Perguntas e respostas frequentes sobre assinaturas, uso dos prompts, compatibilidade com IAs e muito mais.",
    href: "/faq",
    color: "from-green-neon/10 to-transparent",
    border: "border-green-neon/20 hover:border-green-neon/40",
    iconBg: "bg-green-neon/10 border-green-neon/20",
    iconColor: "text-green-neon",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte",
    description: "Entre em contato com nossa equipe, envie dúvidas pelo formulário ou acesse nossa central de ajuda.",
    href: "/suporte",
    color: "from-orange-500/10 to-transparent",
    border: "border-orange-500/20 hover:border-orange-400/40",
    iconBg: "bg-orange-500/10 border-orange-500/20",
    iconColor: "text-orange-400",
  },
];

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(72,255,36,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(72,255,36,0.4) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-5">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">Legal & Suporte</Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Central <span className="text-green-neon">Legal</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              Acesse todos os documentos legais, políticas e canais de suporte do Rei do Prompt em um único lugar.
            </p>
          </motion.div>
        </AnimSection>
      </section>

      {/* Cards Grid */}
      <section className="py-16 px-6 pb-28">
        <div className="max-w-4xl mx-auto">
          <AnimSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {legalLinks.map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <Link href={item.href} className="block group">
                    <div className={`relative h-full bg-white/[0.03] border ${item.border} rounded-2xl p-8 transition-all duration-400 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden`}>
                      {/* BG gradient */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.color}`} />

                      <div className="relative space-y-4">
                        <div className={`w-14 h-14 rounded-2xl ${item.iconBg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${item.iconColor} group-hover:gap-2.5 transition-all`}>
                          Acessar <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimSection>

          {/* Bottom note */}
          <AnimSection>
            <motion.div variants={fadeUp} custom={4} className="mt-10 text-center">
              <p className="text-gray-500 text-sm">
                Dúvidas gerais? Entre em contato:{" "}
                <a href="mailto:contato@reidoprompt.com" className="text-green-neon hover:underline">
                  contato@reidoprompt.com
                </a>
              </p>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
