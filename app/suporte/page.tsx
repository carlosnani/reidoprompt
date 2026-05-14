"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail, Clock, MessageSquare, BookOpen, HeadphonesIcon,
  ArrowRight, CheckCircle, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";

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

const helpCards = [
  { icon: Mail, title: "E-mail de Suporte", description: "Envie sua dúvida diretamente para nossa equipe.", action: "suporte@reidoprompt.com", href: "mailto:suporte@reidoprompt.com" },
  { icon: Clock, title: "Tempo de Resposta", description: "Nossa equipe responde em até 24 horas úteis.", action: "Seg–Sex, 9h–18h", href: null },
  { icon: BookOpen, title: "Base de Conhecimento", description: "Artigos e tutoriais para dúvidas comuns.", action: "Acessar FAQ", href: "/faq" },
  { icon: HeadphonesIcon, title: "Suporte Premium", description: "Assinantes premium têm atendimento prioritário.", action: "Ver Planos", href: "/planos" },
];

const quickFaqs = [
  { q: "Como cancelo minha assinatura?", a: "Acesse 'Minha Conta' > 'Assinatura' > 'Cancelar'. O acesso permanece ativo até o fim do período pago." },
  { q: "Os prompts não estão funcionando. O que faço?", a: "Verifique se está usando o modelo de IA correto indicado no prompt. Se o problema persistir, entre em contato pelo e-mail de suporte." },
  { q: "Posso mudar de plano?", a: "Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento pelo painel 'Minha Conta'." },
];

export default function SuportePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none" />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-6">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">Suporte</Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Como podemos <span className="text-green-neon">ajudar?</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Nossa equipe está pronta para resolver qualquer dúvida ou problema que você tiver.
            </p>
          </motion.div>
        </AnimSection>
      </section>

      {/* Help Cards */}
      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {helpCards.map((card, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  <div className="group relative bg-white/[0.03] border border-white/10 hover:border-green-neon/30 rounded-2xl p-6 transition-all hover:shadow-[0_0_25px_rgba(72,255,36,0.1)] h-full">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-neon/5 to-transparent rounded-2xl" />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_15px_rgba(72,255,36,0.3)] transition-all">
                        <card.icon className="w-5 h-5 text-green-neon" />
                      </div>
                      <h3 className="text-white font-bold mb-2">{card.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{card.description}</p>
                      {card.href ? (
                        <Link href={card.href} className="text-green-neon text-sm font-medium hover:underline flex items-center gap-1">
                          {card.action} <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-green-neon text-sm font-medium">{card.action}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Contact Form + Quick FAQ */}
      <section className="py-16 px-6 pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Form */}
          <AnimSection>
            <motion.div variants={fadeUp} custom={0}>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-neon" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Enviar Mensagem</h2>
                </div>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-neon/10 border border-green-neon/30 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-neon" />
                    </div>
                    <p className="text-white font-bold text-xl">Mensagem enviada!</p>
                    <p className="text-gray-400">Responderemos em até 24 horas úteis.</p>
                    <button onClick={() => setSubmitted(false)} className="text-green-neon text-sm hover:underline mt-2">Enviar outra mensagem</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">Nome</Label>
                        <Input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Seu nome" className="bg-white/5 border-white/10 focus:border-green-neon/40 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-0" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-sm">E-mail</Label>
                        <Input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="seu@email.com" className="bg-white/5 border-white/10 focus:border-green-neon/40 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-0" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Assunto</Label>
                      <Input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Do que se trata?" className="bg-white/5 border-white/10 focus:border-green-neon/40 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-0" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300 text-sm">Mensagem</Label>
                      <Textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Descreva sua dúvida em detalhes..." rows={5} className="bg-white/5 border-white/10 focus:border-green-neon/40 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-0 resize-none" />
                    </div>
                    <Button type="submit" className="w-full rounded-xl bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] font-bold h-12 transition-all">
                      Enviar Mensagem <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </AnimSection>

          {/* Quick FAQ */}
          <AnimSection>
            <motion.div variants={fadeUp} custom={1} className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-neon" />
                </div>
                <h2 className="text-xl font-bold text-white">Dúvidas Rápidas</h2>
              </div>
              {quickFaqs.map((faq, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-green-neon/20 transition-all">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                    <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-green-neon shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 pb-4">
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
              <div className="mt-6 p-5 rounded-2xl bg-green-neon/5 border border-green-neon/20">
                <p className="text-gray-300 text-sm mb-3">Precisa de mais ajuda? Veja nosso FAQ completo.</p>
                <Link href="/faq">
                  <Button variant="outline" className="rounded-xl border-green-neon/30 text-green-neon hover:bg-green-neon/10 text-sm h-9">
                    Ver FAQ Completo <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
