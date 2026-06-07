"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, AlertTriangle, Ban, CreditCard, RefreshCw, MessageSquare, Edit3 } from "lucide-react";

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

const sections = [
  { id: "uso", icon: FileText, title: "Uso da Plataforma" },
  { id: "acesso", icon: Shield, title: "Acesso aos Prompts" },
  { id: "propriedade", icon: AlertTriangle, title: "Propriedade Intelectual" },
  { id: "responsabilidade", icon: Ban, title: "Limitações de Responsabilidade" },
  { id: "assinaturas", icon: CreditCard, title: "Assinaturas e Pagamentos" },
  { id: "cancelamento", icon: RefreshCw, title: "Cancelamentos" },
  { id: "redistribuicao", icon: Ban, title: "Proibição de Redistribuição" },
  { id: "comportamento", icon: MessageSquare, title: "Comportamento do Usuário" },
  { id: "alteracoes", icon: Edit3, title: "Alterações dos Termos" },
];

export default function TermosDeUsoPage() {
  const [active, setActive] = useState("uso");

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none" />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">Legal</Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Termos de Uso</h1>
            <p className="text-gray-400 text-lg">Última atualização: 13 de maio de 2026</p>
            <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
              Ao acessar e utilizar a plataforma O Rei do Prompt, você concorda com os termos descritos nesta página. Leia com atenção antes de utilizar nossos serviços.
            </p>
          </motion.div>
        </AnimSection>
      </section>

      {/* Body */}
      <section className="py-12 px-6 pb-28">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Sticky sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-28 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4 px-2">Índice</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActive(s.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${active === s.id ? "bg-green-neon/10 text-green-neon border border-green-neon/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <s.icon className="w-3.5 h-3.5 shrink-0" />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <AnimSection className="flex-1 space-y-12">
            {[
              {
                id: "uso", icon: FileText, title: "Uso da Plataforma",
                content: `A plataforma O Rei do Prompt é destinada exclusivamente para uso pessoal e/ou comercial conforme o plano adquirido. É proibido o uso da plataforma para atividades ilegais, fraudulentas ou que violem os direitos de terceiros.

O acesso à plataforma é concedido mediante cadastro e aceite dos presentes termos. Reservamos o direito de suspender ou encerrar contas que violem estas regras sem aviso prévio.

Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.`
              },
              {
                id: "acesso", icon: Shield, title: "Acesso aos Prompts",
                content: `Os prompts disponíveis na plataforma são organizados por planos de acesso: gratuito e premium. O plano gratuito permite acesso a uma seleção limitada de prompts. O plano premium garante acesso completo à biblioteca.

O acesso é intransferível e vinculado exclusivamente à conta cadastrada. É vedado o compartilhamento de credenciais entre múltiplos usuários.

Novos prompts são adicionados regularmente à biblioteca e disponibilizados conforme o plano do usuário, sem custo adicional.`
              },
              {
                id: "propriedade", icon: AlertTriangle, title: "Propriedade Intelectual",
                content: `Todo o conteúdo da plataforma O Rei do Prompt, incluindo prompts, textos, design, logotipos e código, é protegido por direitos autorais e demais leis de propriedade intelectual aplicáveis.

Os prompts adquiridos podem ser utilizados para criação de conteúdo pessoal e comercial, conforme licença do plano. No entanto, é expressamente proibido reproduzir, vender, sublicenciar ou redistribuir os prompts para terceiros.

O uso dos prompts para treinar modelos de inteligência artificial sem autorização expressa é terminantemente vedado.`
              },
              {
                id: "responsabilidade", icon: Ban, title: "Limitações de Responsabilidade",
                content: `O Rei do Prompt não se responsabiliza pelos resultados obtidos com o uso dos prompts, uma vez que os outputs gerados pelas IAs dependem de fatores externos ao nosso controle, incluindo as políticas e capacidades das plataformas de IA utilizadas.

A plataforma é fornecida "como está" e pode estar sujeita a interrupções para manutenção. Nos esforçamos para garantir disponibilidade máxima, mas não garantimos 100% de uptime.

Em nenhuma hipótese nossa responsabilidade excederá o valor pago pelo usuário nos últimos 12 meses.`
              },
              {
                id: "assinaturas", icon: CreditCard, title: "Assinaturas e Pagamentos",
                content: `As assinaturas são cobradas de forma recorrente (mensal ou anual) conforme o plano escolhido. O pagamento é processado automaticamente na data de renovação.

Aceitamos os principais cartões de crédito e débito. O processamento é realizado por gateways de pagamento certificados PCI DSS, garantindo segurança nas transações.

Preços podem ser alterados com aviso prévio de 30 dias. Assinantes existentes serão notificados por e-mail sobre qualquer alteração de preços.`
              },
              {
                id: "cancelamento", icon: RefreshCw, title: "Cancelamentos",
                content: `Você pode cancelar sua assinatura a qualquer momento através do painel "Minha Conta". O cancelamento encerra a renovação automática, e o acesso premium permanece ativo até o fim do período já pago.

Não realizamos reembolsos proporcionais por períodos não utilizados, exceto em casos de falha técnica comprovada de nossa parte.

Para solicitar cancelamento por problemas técnicos, entre em contato com nosso suporte em até 7 dias após a cobrança.`
              },
              {
                id: "redistribuicao", icon: Ban, title: "Proibição de Redistribuição",
                content: `É estritamente proibido redistribuir, revender, compartilhar publicamente ou criar produtos derivados com base nos prompts da plataforma O Rei do Prompt sem autorização expressa por escrito.

Isso inclui, mas não se limita a: criação de outros repositórios de prompts, venda em marketplaces de terceiros, distribuição em grupos, canais ou comunidades online.

A violação desta cláusula poderá resultar em suspensão imediata da conta e medidas legais cabíveis.`
              },
              {
                id: "comportamento", icon: MessageSquare, title: "Comportamento do Usuário",
                content: `Os usuários devem utilizar a plataforma de forma ética e respeitosa. É vedado o uso para criar conteúdo ofensivo, discriminatório, ilegal ou que viole direitos de terceiros.

Qualquer comportamento abusivo, tentativa de acesso não autorizado a outros sistemas ou uso da plataforma para fins maliciosos resultará em banimento permanente.

Encorajamos o feedback construtivo através de nossos canais de suporte para melhoria contínua da plataforma.`
              },
              {
                id: "alteracoes", icon: Edit3, title: "Alterações dos Termos",
                content: `Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas por e-mail com antecedência mínima de 15 dias.

O uso continuado da plataforma após a vigência das alterações constitui aceite dos novos termos. Caso não concorde com as alterações, você poderá cancelar sua conta.

A versão mais atual destes termos estará sempre disponível nesta página, com a data da última atualização indicada no topo.`
              },
            ].map((sec, i) => (
              <motion.div key={sec.id} id={sec.id} variants={fadeUp} custom={i} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center">
                    <sec.icon className="w-4 h-4 text-green-neon" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{sec.title}</h2>
                </div>
                <div className="pl-0 space-y-4">
                  {sec.content.split("\n\n").map((p, j) => (
                    <p key={j} className="text-gray-400 leading-relaxed">{p}</p>
                  ))}
                </div>
                {i < 8 && <div className="mt-10 border-t border-white/5" />}
              </motion.div>
            ))}
          </AnimSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/5">
        <AnimSection className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <p className="text-gray-400">Dúvidas sobre os termos de uso?</p>
            <Link href="/suporte">
              <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] font-bold px-8 h-12">
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
