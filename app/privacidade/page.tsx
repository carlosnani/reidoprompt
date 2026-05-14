"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Cookie, BarChart2, CreditCard, Lock, Scale, UserCheck, Server, Mail } from "lucide-react";

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
  { id: "coleta", icon: Database, title: "Coleta de Dados" },
  { id: "cookies", icon: Cookie, title: "Cookies" },
  { id: "analytics", icon: BarChart2, title: "Analytics" },
  { id: "pagamentos", icon: CreditCard, title: "Dados de Pagamento" },
  { id: "seguranca", icon: Lock, title: "Segurança" },
  { id: "lgpd", icon: Scale, title: "LGPD" },
  { id: "direitos", icon: UserCheck, title: "Direitos do Usuário" },
  { id: "armazenamento", icon: Server, title: "Armazenamento" },
  { id: "contato", icon: Mail, title: "Contato" },
];

const privacyContent = [
  {
    id: "coleta", icon: Database, title: "Coleta de Dados",
    text: `Coletamos apenas os dados necessários para fornecer e melhorar nossos serviços. As informações coletadas incluem: nome completo, endereço de e-mail, preferências de uso da plataforma e dados de navegação anonimizados.

Não coletamos dados sensíveis sem consentimento explícito. Os dados são coletados no momento do cadastro, durante o uso da plataforma e através de formulários de contato.

Você sempre poderá revisar e solicitar a exclusão dos seus dados pessoais através do painel de configurações ou pelo nosso canal de suporte.`
  },
  {
    id: "cookies", icon: Cookie, title: "Cookies",
    text: `Utilizamos cookies para garantir o funcionamento correto da plataforma, manter sua sessão ativa e personalizar sua experiência. Os cookies são divididos em: essenciais (necessários para o funcionamento), de performance (analytics anônimos) e de preferência (configurações salvas).

Você pode gerenciar as preferências de cookies nas configurações do seu navegador. A desativação de cookies essenciais pode afetar a funcionalidade da plataforma.

Não utilizamos cookies de rastreamento de terceiros para fins publicitários sem seu consentimento explícito.`
  },
  {
    id: "analytics", icon: BarChart2, title: "Analytics",
    text: `Utilizamos ferramentas de analytics para entender como os usuários interagem com a plataforma e melhorar continuamente a experiência. Os dados coletados são anonimizados e agregados.

As métricas coletadas incluem: páginas visitadas, tempo de permanência, cliques em elementos e fluxo de navegação. Nenhum dado pessoal identificável é vinculado a essas métricas.

Você pode optar por não participar da coleta de analytics através das configurações de privacidade da sua conta.`
  },
  {
    id: "pagamentos", icon: CreditCard, title: "Dados de Pagamento",
    text: `Não armazenamos dados de cartão de crédito em nossos servidores. Todas as transações financeiras são processadas por gateways certificados PCI DSS de nível 1, os mais seguros disponíveis.

Armazenamos apenas tokens de pagamento fornecidos pelos processadores, que permitem renovações automáticas sem expor seus dados financeiros.

Em caso de disputas ou estornos, trabalhamos diretamente com os processadores de pagamento para resolver a situação de forma justa e ágil.`
  },
  {
    id: "seguranca", icon: Lock, title: "Segurança",
    text: `Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. Todas as comunicações são criptografadas via TLS/SSL.

Realizamos auditorias de segurança regulares e mantemos nossa infraestrutura atualizada com as melhores práticas do setor. Senhas são armazenadas com hashing seguro (bcrypt).

Em caso de violação de dados que afete seus direitos, você será notificado dentro do prazo legal exigido pela LGPD.`
  },
  {
    id: "lgpd", icon: Scale, title: "LGPD — Lei Geral de Proteção de Dados",
    text: `Estamos em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). O tratamento dos seus dados é realizado com base legal adequada, seja por contrato, legítimo interesse ou consentimento.

Nossa base jurídica para processamento de dados inclui: execução de contrato de prestação de serviços, cumprimento de obrigações legais e legítimo interesse para melhoria dos serviços.

Você tem direito a: confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade e revogação de consentimento.`
  },
  {
    id: "direitos", icon: UserCheck, title: "Direitos do Usuário",
    text: `Você tem direitos completos sobre seus dados pessoais. Pode solicitar a qualquer momento: acesso aos dados coletados, correção de informações incorretas, exclusão de dados (direito ao esquecimento) e portabilidade dos seus dados.

Para exercer seus direitos, acesse as configurações da sua conta ou entre em contato pelo e-mail privacidade@reidoprompt.com. Respondemos a todas as solicitações em até 15 dias úteis.

A revogação do consentimento pode afetar o acesso a determinadas funcionalidades da plataforma, mas nunca resultará em penalidades.`
  },
  {
    id: "armazenamento", icon: Server, title: "Armazenamento de Dados",
    text: `Seus dados são armazenados em servidores seguros localizados no Brasil e/ou em países com nível de proteção equivalente ao exigido pela LGPD.

O período de retenção dos dados varia conforme o tipo: dados de conta são mantidos enquanto a conta estiver ativa; dados de transação são mantidos por 5 anos conforme exigência fiscal; dados de analytics são anonimizados após 14 meses.

Após o encerramento da conta, seus dados pessoais são excluídos dentro de 30 dias, exceto aqueles cuja retenção é exigida por lei.`
  },
  {
    id: "contato", icon: Mail, title: "Contato e DPO",
    text: `Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail: privacidade@reidoprompt.com.

Nosso time de privacidade está disponível para esclarecer dúvidas, receber reclamações e processar solicitações relacionadas aos seus direitos. O tempo médio de resposta é de 5 dias úteis.

Você também pode contatar a Autoridade Nacional de Proteção de Dados (ANPD) caso considere que seus direitos não foram atendidos adequadamente.`
  },
];

export default function PrivacidadePage() {
  const [active, setActive] = useState("coleta");

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Header />

      <section className="relative pt-40 pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-neon/5 blur-[120px] rounded-full pointer-events-none" />
        <AnimSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <Badge className="bg-green-neon/10 text-green-neon border-green-neon/20 px-4 py-1.5 text-xs tracking-widest uppercase">Privacidade</Badge>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Política de Privacidade</h1>
            <p className="text-gray-400 text-lg">Última atualização: 13 de maio de 2026</p>
            <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
              Sua privacidade é fundamental para nós. Esta política explica como coletamos, usamos e protegemos seus dados pessoais em total conformidade com a LGPD.
            </p>
          </motion.div>
        </AnimSection>
      </section>

      <section className="py-12 px-6 pb-28">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-28 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4 px-2">Índice</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${active === s.id ? "bg-green-neon/10 text-green-neon border border-green-neon/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                    <s.icon className="w-3.5 h-3.5 shrink-0" />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <AnimSection className="flex-1 space-y-12">
            {privacyContent.map((sec, i) => (
              <motion.div key={sec.id} id={sec.id} variants={fadeUp} custom={i} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-neon/10 border border-green-neon/20 flex items-center justify-center">
                    <sec.icon className="w-4 h-4 text-green-neon" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{sec.title}</h2>
                </div>
                {sec.text.split("\n\n").map((p, j) => (
                  <p key={j} className="text-gray-400 leading-relaxed mb-4">{p}</p>
                ))}
                {i < privacyContent.length - 1 && <div className="mt-10 border-t border-white/5" />}
              </motion.div>
            ))}
          </AnimSection>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <AnimSection className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <p className="text-gray-400">Dúvidas sobre nossa política de privacidade?</p>
            <Link href="/suporte">
              <Button className="rounded-full bg-green-neon text-black hover:bg-green-neon/90 hover:shadow-[0_0_20px_rgba(72,255,36,0.4)] font-bold px-8 h-12">
                Entrar em Contato <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </AnimSection>
      </section>

      <Footer />
    </div>
  );
}
