"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchSiteSettings } from "@/lib/supabase/site-settings";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const [monthlyPrice, setMonthlyPrice] = useState<string>("4,99");

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient();
      const settings = await fetchSiteSettings(supabase);
      if (settings?.monthly_price) {
        setMonthlyPrice(settings.monthly_price.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }));
      }
    };
    loadSettings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-green-neon/30 selection:text-white overflow-hidden">
      <Header />
      
      <main className="flex-1 relative pb-24 pt-40">
        {/* 🌌 Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_var(--color-green-neon)_0%,_transparent_50%)] opacity-[0.05]" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* 🏷️ Badge e Título */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-neon/10 border border-green-neon/20 text-green-neon text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Preços Imbatíveis
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">
              Desbloqueie o <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon via-green-400 to-green-dark">
                Poder da IA
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Pare de perder horas tentando criar o prompt perfeito. Tenha acesso à maior e melhor biblioteca de prompts validados do Brasil.
            </p>
          </motion.div>

          {/* 💳 Grid de Planos */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch"
          >
            {/* Free Plan */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col border-white/5 bg-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors" />
                
                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-bold text-white">Básico</CardTitle>
                    <div className="p-2 rounded-lg bg-white/5">
                      <Zap className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400 text-base">Para você testar e conhecer o formato</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">R$ 0</span>
                    <span className="text-gray-500 font-medium">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 relative z-10 pt-4">
                  <ul className="space-y-4">
                    {[
                      { text: "Acesso a Prompts Básicos Limitados", active: true },
                      { text: "Busca simples no diretório", active: true },
                      { text: "Acesso a Prompts Premium (+5.000)", active: false },
                      { text: "Ferramentas e Geradores Avançados", active: false },
                      { text: "Atualizações Semanais", active: false }
                    ].map((item, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm ${item.active ? "text-gray-300" : "text-gray-600"}`}>
                        {item.active ? (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                            <X className="w-3 h-3 text-gray-700" />
                          </div>
                        )}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative z-10 pt-8 pb-8">
                  <Link href="/auth/signup?plan=free" className="w-full">
                    <Button variant="outline" className="w-full h-14 border-white/10 bg-transparent text-white hover:bg-white/10 text-lg font-bold rounded-xl transition-all">
                      Começar Grátis
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col border-green-neon/30 bg-[#0d0d0d] relative overflow-hidden shadow-[0_0_50px_-12px_rgba(72,255,36,0.3)] group">
                {/* 🌟 Efeito de Brilho */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-neon/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                
                {/* 🏷️ Badge de Destaque */}
                <div className="absolute top-0 left-0 w-full bg-green-neon text-black text-center text-[10px] font-black py-1.5 uppercase tracking-widest z-20">
                  Melhor Custo-Benefício
                </div>
                
                <CardHeader className="relative z-10 pt-10">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-bold text-green-neon">Pro</CardTitle>
                    <div className="p-2 rounded-lg bg-green-neon/10">
                      <Sparkles className="w-5 h-5 text-green-neon" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-300 text-base">O arsenal completo para dominar a IA</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">R$ {monthlyPrice}</span>
                    <span className="text-gray-400 font-medium">/mês</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 relative z-10 pt-4">
                  <ul className="space-y-4">
                    {[
                      "Acesso Ilimitado a todos os Prompts",
                      "Mais de 5.000 Prompts Validados",
                      "Todas as Ferramentas e Geradores",
                      "Busca Avançada e Filtros Premium",
                      "Novos Prompts Adicionados Semanalmente",
                      "Suporte Prioritário VIP"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-neon/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-neon" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative z-10 pt-8 pb-8">
                  <Link
                    href="/auth/signup?plan=pro"
                    className="w-full h-14 inline-flex items-center justify-center bg-green-neon text-black hover:bg-green-neon/90 text-lg font-black rounded-xl transition-all shadow-[0_0_20px_rgba(72,255,36,0.4)] group-hover:scale-[1.02] active:scale-95"
                  >
                    Assinar Agora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* 🛡️ Trust & Security */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-32 pt-16 border-t border-white/5"
          >
            <div className="grid md:grid-cols-3 gap-12 items-center">
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-neon">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Pagamento 100% Seguro</h4>
                  <p className="text-gray-500 text-sm mt-1">Criptografia de ponta a ponta e processamento imediato.</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <p className="text-xs uppercase tracking-widest text-gray-600 font-bold">Aceitamos</p>
                <div className="flex items-center gap-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                  <img src="/pix.svg" alt="PIX" className="h-6 w-auto" />
                  <img src="/visa.svg" alt="Visa" className="h-4 w-auto" />
                  <img src="/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-green-neon">
                  <X className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Sem Fidelidade</h4>
                  <p className="text-gray-500 text-sm mt-1">Cancele quando quiser diretamente no seu painel, sem taxas.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
