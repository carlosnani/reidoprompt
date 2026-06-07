"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Search, Sparkles, CreditCard, Bot, XCircle, RefreshCw, Gift, Briefcase, HeadphonesIcon } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
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

const categories = [
  { id: "all", label: "Todas" },
  { id: "geral", label: "Geral" },
  { id: "assinatura", label: "Assinatura" },
  { id: "uso", label: "Uso" },
  { id: "suporte", label: "Suporte" },
];

const faqs = [
  {
    id: "1", category: "geral", icon: Sparkles,
    question: "O que é O Rei do Prompt?",
    answer: "O Rei do Prompt é a maior biblioteca de prompts premium do Brasil. Reunimos prompts organizados, validados e prontos para uso nas principais ferramentas de inteligência artificial — como ChatGPT, Midjourney, Claude, Stable Diffusion, entre outras. Nossa missão é ajudar criadores, profissionais e empresas a acelerarem seus resultados com IA."
  },
  {
    id: "2", category: "assinatura", icon: CreditCard,
    question: "Como funciona a assinatura?",
    answer: "Oferecemos planos mensais e anuais. Após o pagamento, você tem acesso imediato a toda a biblioteca premium. A renovação é automática, mas você pode cancelar a qualquer momento pelo painel 'Minha Conta'. No plano anual, você economiza significativamente em relação ao mensal."
  },
  {
    id: "3", category: "uso", icon: Bot,
    question: "Os prompts funcionam em quais IAs?",
    answer: "Nossa biblioteca cobre as principais plataformas de IA do mercado: ChatGPT (GPT-4 e modelos anteriores), Claude, Midjourney, DALL-E, Stable Diffusion, Leonardo.AI, Runway, Sora, Gemini e muitas outras. Cada prompt indica explicitamente para quais ferramentas é otimizado."
  },
  {
    id: "4", category: "assinatura", icon: XCircle,
    question: "Posso cancelar quando quiser?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento, sem burocracia, diretamente pelo painel 'Minha Conta'. Após o cancelamento, o acesso premium permanece ativo até o fim do período já pago. Não cobramos taxas de cancelamento."
  },
  {
    id: "5", category: "uso", icon: RefreshCw,
    question: "Novos prompts são adicionados?",
    answer: "Sim, constantemente! Nossa equipe adiciona novos prompts toda semana, acompanhando as atualizações das plataformas de IA e as tendências do mercado. Assinantes premium têm acesso a todos os novos prompts assim que são publicados, sem custo adicional."
  },
  {
    id: "6", category: "geral", icon: Gift,
    question: "Existe plano gratuito?",
    answer: "Sim! Oferecemos um plano gratuito com acesso a uma seleção curada de prompts. Para ter acesso completo à biblioteca com mais de 5.000 prompts premium, é necessário assinar um dos nossos planos pagos. O plano gratuito é uma ótima forma de conhecer a qualidade da nossa plataforma."
  },
  {
    id: "7", category: "uso", icon: Briefcase,
    question: "Posso usar os prompts comercialmente?",
    answer: "Os planos pagos incluem licença de uso comercial, permitindo que você utilize os prompts para criar conteúdo para clientes, projetos comerciais e produtos. O que não é permitido é revender, redistribuir ou compartilhar publicamente os próprios prompts em outros repositórios ou plataformas."
  },
  {
    id: "8", category: "suporte", icon: HeadphonesIcon,
    question: "Como recebo suporte?",
    answer: "Nosso suporte está disponível por e-mail (suporte@reidoprompt.com) com tempo médio de resposta de 24 horas úteis. Assinantes premium têm prioridade no atendimento. Também disponibilizamos nossa seção de FAQ, tutoriais em vídeo e uma base de conhecimento completa para autoatendimento."
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = faqs.filter((f) => {
    const matchCat = category === "all" || f.category === category;
    const matchSearch = search.trim() === "" ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none" />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-6">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">FAQ</Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
              Perguntas <span className="text-green-neon">Frequentes</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre a plataforma O Rei do Prompt.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar pergunta..."
                className="pl-11 h-12 bg-white/5 border-white/10 focus:border-green-neon/40 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-0"
              />
            </div>
          </motion.div>
        </AnimSection>
      </section>

      {/* Categories */}
      <section className="px-6 pb-4">
        <AnimSection className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${category === cat.id ? "bg-green-neon text-black shadow-[0_0_15px_rgba(72,255,36,0.3)]" : "bg-white/5 text-gray-400 border border-white/10 hover:border-green-neon/30 hover:text-white"}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </AnimSection>
      </section>

      {/* Accordion */}
      <section className="py-12 px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <AnimSection>
                <Accordion type="single" collapsible className="space-y-3">
                  {filtered.map((faq, i) => (
                    <motion.div key={faq.id} variants={fadeUp} custom={i}>
                      <AccordionItem value={faq.id} className="bg-white/[0.03] border border-white/10 rounded-2xl px-6 hover:border-green-neon/20 transition-all data-[state=open]:border-green-neon/30 data-[state=open]:shadow-[0_0_20px_rgba(72,255,36,0.08)]">
                        <AccordionTrigger className="text-white font-semibold text-left hover:no-underline py-5 [&>svg]:text-green-neon">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-green-neon/10 flex items-center justify-center shrink-0">
                              <faq.icon className="w-3.5 h-3.5 text-green-neon" />
                            </div>
                            {faq.question}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 leading-relaxed pb-5 pl-10">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </AnimSection>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                <p className="text-gray-500 text-lg">Nenhuma pergunta encontrada.</p>
                <button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-4 text-green-neon text-sm hover:underline">
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <AnimSection className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <p className="text-white font-semibold text-xl">Não encontrou sua resposta?</p>
            <p className="text-gray-400">Nossa equipe de suporte está pronta para ajudar você.</p>
            <Link href="/suporte">
              <Button className="mt-4 rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] font-bold px-8 h-12">
                Falar com Suporte <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </AnimSection>
      </section>

      <Footer />
    </div>
  );
}
