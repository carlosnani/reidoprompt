import { Suspense } from "react";
import { requireUser } from "@/lib/supabase/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { User, Shield, Clock, LayoutDashboard, Settings, Heart, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] selection:bg-green-neon/30 selection:text-white">
      {/* Background Effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[600px] bg-green-neon/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <Header />

      <main className="flex-grow relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Carregando informações da conta...</div>}>
          <ContaContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function ContaContent() {
  const user = await requireUser();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const isAdmin = user.user_metadata?.role === "admin" || (!!adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase());

  return (
    <div className="space-y-12">
      {/* Header da Página */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Minha <span className="text-green-neon">Conta</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Gerencie suas informações, visualize seus favoritos e acompanhe seu plano premium.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Perfil e Atalhos */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-neon/20 flex items-center justify-center border border-green-neon/30 p-4 m-2 mb-4">
                  <User className="w-8 h-8 text-green-neon" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Perfil</CardTitle>
                  <CardDescription className="text-gray-500">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                <Link href="/favoritos" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                  <Heart className="w-5 h-5 group-hover:text-green-neon transition-colors" />
                  <span>Meus Favoritos</span>
                </Link>
                <Link href="/planos" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                  <CreditCard className="w-5 h-5 group-hover:text-green-neon transition-colors" />
                  <span>Meu Plano</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                  <Settings className="w-5 h-5 group-hover:text-green-neon transition-colors" />
                  <span>Configurações</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl text-green-neon/70 hover:text-green-neon hover:bg-green-neon/5 transition-all group border border-green-neon/10">
                    <Shield className="w-5 h-5" />
                    <span>Painel Administrativo</span>
                  </Link>
                )}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-bold">Bem-vindo de volta!</CardTitle>
              <CardDescription className="text-gray-400">
                Você está autenticado como <span className="text-white font-medium">{user.email}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <LayoutDashboard className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-white font-bold">Acesso Rápido</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Explore os novos prompts adicionados recentemente na nossa galeria premium.
                  </p>
                  <Link href="/prompts" className="inline-block text-sm text-green-neon font-bold hover:underline">
                    Ver Galeria →
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-bold">Upgrade Pro</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Desbloqueie todos os prompts e ferramentas de automação com o plano Pro.
                  </p>
                  <Link href="/planos" className="inline-block text-sm text-green-neon font-bold hover:underline">
                    Ver Planos →
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-green-neon/5 border border-green-neon/10">
                <h4 className="text-white font-bold mb-2">Dica do Especialista</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Você sabia que pode salvar seus prompts favoritos para acessá-los rapidamente depois? Basta clicar no ícone de coração em qualquer prompt da galeria.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(72, 255, 36, 0.5);
        }
      `}} />
    </div>
  );
}
