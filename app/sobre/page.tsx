"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, CheckCircle, RefreshCw, Palette, Code2,
  Brain, ArrowRight, Star, Zap, Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

function AnimSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const featureCards = [
  { icon: Sparkles, title: "Organização inteligente", description: "Prompts organizados por categoria, ferramenta e nível de resultado. Encontre o que precisa em segundos." },
  { icon: CheckCircle, title: "Prompts validados", description: "Cada prompt é testado e refinado antes de ser publicado. Zero desperdício de tempo e tokens." },
  { icon: RefreshCw, title: "Atualizações constantes", description: "Novos prompts adicionados toda semana. A biblioteca cresce conforme as IAs evoluem." },
];

const creatorStats = [
  { value: "8+", label: "Anos de experiência" },
  { value: "200+", label: "Projetos criativos" },
  { value: "100%", label: "Foco em IA & Design" },
];

const creatorTags = [
  { icon: Palette, label: "Design Visual" },
  { icon: Code2, label: "Desenvolvimento" },
  { icon: Brain, label: "Inteligência Artificial" },
  { icon: Zap, label: "Automações Criativas" },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-green-neon/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-green-neon/3 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(72,255,36,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(72,255,36,0.4) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimSection>
            <motion.div variants={fadeUp} custom={0} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-deep/20 border border-green-neon/20 text-green-neon text-xs font-semibold tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(72,255,36,0.1)]">
                CRIATIVIDADE • IA • DESIGN
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                Sobre o{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon via-green-400 to-green-dark drop-shadow-[0_0_30px_rgba(72,255,36,0.3)]">
                  Rei do Prompt
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                O Rei do Prompt nasceu para transformar criatividade em resultados reais através da inteligência artificial.
              </p>
              <p className="text-gray-400 leading-relaxed">
                O projeto foi criado por <span className="text-white font-semibold">Carlos Nani</span>, designer e desenvolvedor apaixonado por tecnologia, branding e inteligência artificial. A ideia surgiu da necessidade de organizar prompts realmente úteis em um único lugar, facilitando a criação de imagens, designs, vídeos, campanhas e automações com IA.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/prompts">
                  <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] transition-all font-bold px-8 h-12">
                    Explorar Prompts <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/planos">
                  <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/5 hover:border-green-neon/40 transition-all px-8 h-12">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimSection>

          {/* Creator image */}
          <AnimSection className="flex justify-center">
            <motion.div variants={fadeUp} custom={2}>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-green-neon/10 blur-2xl" />
                <div className="relative w-[320px] h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_60px_rgba(72,255,36,0.15)]">
                  <Image src="/sobre/reidoprompt.jpg" alt="Carlos Nani — Criador do Rei do Prompt" fill className="object-cover" priority />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="absolute -bottom-4 -left-6 bg-black/80 backdrop-blur-md border border-green-neon/30 rounded-2xl px-5 py-3 shadow-[0_0_20px_rgba(72,255,36,0.2)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-neon" />
                    <span className="text-white text-sm font-bold">+5.000 prompts criados</span>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }} className="absolute -top-4 -right-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-semibold">Carlos Nani</span>
                  </div>
                  <p className="text-gray-400 text-[10px] mt-0.5">Criador & Designer</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      {/* A IDEIA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-neon/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <AnimSection>
            <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
              <Badge className="mb-6 bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">O Projeto</Badge>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                Um repositório criado <span className="text-green-neon">para criadores</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                O Rei do Prompt foi desenvolvido para reunir prompts organizados, validados e prontos para uso em diversas inteligências artificiais. Em vez de perder horas tentando criar comandos do zero, os usuários encontram ideias estruturadas para acelerar seus resultados.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((card, i) => (
                <motion.div key={i} variants={fadeUp} custom={i + 1}>
                  <Card className="group relative bg-white/[0.03] border border-white/10 hover:border-green-neon/30 rounded-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(72,255,36,0.1)] overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-neon/5 to-transparent" />
                    <CardContent className="p-8">
                      <div className="w-12 h-12 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(72,255,36,0.3)] transition-all">
                        <card.icon className="w-5 h-5 text-green-neon" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-3">{card.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* QUEM É CARLOS NANI */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:order-last">
                {creatorStats.map((s, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-green-neon/30 hover:shadow-[0_0_20px_rgba(72,255,36,0.1)] transition-all">
                    <p className="text-4xl font-black text-green-neon mb-2">{s.value}</p>
                    <p className="text-gray-400 text-sm leading-snug">{s.label}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={fadeUp} custom={1} className="space-y-6">
                <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">O Criador</Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                  Quem é <span className="text-green-neon">Carlos Nani?</span>
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Carlos Nani é designer e desenvolvedor, especializado em criação visual, experiências digitais e automações criativas. O Rei do Prompt nasceu da união entre design, tecnologia e inteligência artificial, com o objetivo de ajudar criadores, empresas e profissionais a produzirem conteúdos mais rápidos, criativos e impactantes.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {creatorTags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                      <tag.icon className="w-3.5 h-3.5 text-green-neon" />
                      {tag.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(72,255,36,0.06)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 border-y border-white/5 pointer-events-none" />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-6">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">Propósito</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              Nossa <span className="text-green-neon">missão</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Democratizar o acesso a prompts de alta qualidade, ajudando pessoas a explorarem todo o potencial da inteligência artificial de forma{" "}
              <span className="text-white font-semibold">prática, criativa e profissional.</span>
            </p>
          </motion.div>
        </AnimSection>
      </section>

      {/* CTA */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimSection>
            <motion.div variants={fadeUp} custom={0} className="relative rounded-3xl overflow-hidden border border-green-neon/20 bg-white/[0.02] backdrop-blur-sm p-12 md:p-16 text-center shadow-[0_0_80px_rgba(72,255,36,0.08)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-green-neon/10 blur-[80px] rounded-full pointer-events-none" />
              <motion.div variants={fadeUp} custom={1} className="relative space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-neon/10 border border-green-neon/20 mb-2">
                  <Users className="w-7 h-7 text-green-neon" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                  Pronto para elevar sua <span className="text-green-neon">criatividade?</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                  Entre para a comunidade que está dominando a inteligência artificial através dos melhores prompts do Brasil.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link href="/prompts">
                    <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_30px_rgba(72,255,36,0.5)] transition-all font-bold px-10 h-14 text-base">
                      Explorar Prompts <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/5 hover:border-green-neon/40 transition-all px-10 h-14 text-base">
                      Criar Conta
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
