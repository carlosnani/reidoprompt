"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { CreditCard, LogOut, Settings, User, AlertTriangle, Sparkles, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";

export default function ContaPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);
  const handleSave = (e: React.MouseEvent, message: string) => {
    e.preventDefault();
    toast.success(message);
  };

  const handleCancelPlan = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.error("Assinatura cancelada com sucesso. Você perderá os benefícios ao final do ciclo.");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <Loader2 className="w-8 h-8 text-green-neon animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const userInitial = session.user.name?.charAt(0).toUpperCase() || "U";

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
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-neon/5 blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-50">
        <Header />
      </div>

      <main className="flex-grow relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Minha Conta
          </h1>
          <p className="text-gray-400 mt-2">
            Gerencie seu perfil, preferências e assinatura do Rei do Prompt.
          </p>
        </div>

        <Tabs defaultValue="perfil" className="w-full space-y-8">
          <TabsList className="flex h-auto bg-white/5 border border-white/10 p-1 justify-start overflow-x-hidden w-full md:w-fit rounded-lg">
            <TabsTrigger
              value="perfil"
              className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-md py-2 px-4 transition-colors"
            >
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger
              value="assinatura"
              className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-md py-2 px-4 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Assinatura
            </TabsTrigger>

            <Link 
              href="/favoritos" 
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Favoritos</span>
            </Link>

            <TabsTrigger
              value="seguranca"
              className="gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-md py-2 px-4 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 w-full">
            {/* PERFIL */}
            <TabsContent value="perfil" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize sua foto e dados de identificação.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-24 h-24 border-2 border-green-neon/50">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="bg-black/40 text-green-neon text-2xl font-bold">{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                        Mudar foto
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recomendado: 256x256px. Máximo 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 pt-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName" className="text-gray-300">Nome Completo</Label>
                      <Input id="fullName" defaultValue={session.user.name || ""} className="bg-black/20 border-white/10 text-white" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                      <Input id="email" type="email" defaultValue={session.user.email || ""} className="bg-black/20 border-white/10 text-white" disabled />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-6">
                  <Button onClick={(e) => handleSave(e, "Perfil atualizado com sucesso!")} className="bg-green-neon text-black hover:bg-green-neon/90 font-semibold">
                    Salvar alterações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* ASSINATURA */}
            <TabsContent value="assinatura" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-white/5 border-green-neon/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <div className="px-3 py-1 rounded-full bg-green-neon/20 border border-green-neon/50 text-green-neon text-xs font-bold uppercase tracking-wider">
                    Ativo
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Seu Plano Atual</CardTitle>
                  <CardDescription>
                    Você está atualmente no plano <strong className="text-white">PRO Mensal</strong>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-black text-white">R$ 4,99</span>
                    <span className="text-gray-400 mb-1">/mês</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Próxima cobrança</span>
                      <span className="text-white font-medium">15 de Junho, 2026</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-gray-400">Método de pagamento</span>
                      <span className="text-white font-medium flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-neon" />
                        •••• 4242
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-6 flex flex-wrap gap-4">
                  <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    Mudar forma de pagamento
                  </Button>
                  <Link href="/planos">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Ver todos os planos
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-white/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Cancelar Assinatura
                  </CardTitle>
                  <CardDescription>
                    Pausar ou cancelar sua assinatura atual. Você continuará com acesso até o final do ciclo faturado.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <Button
                    variant="destructive"
                    className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 hover:text-destructive font-medium"
                    onClick={handleCancelPlan}
                  >
                    Cancelar meu plano
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* SEGURANÇA */}
            <TabsContent value="seguranca" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Alterar Senha</CardTitle>
                  <CardDescription>
                    Certifique-se de usar uma senha forte e segura.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-gray-300">Senha atual</Label>
                    <Input id="currentPassword" type="password" className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-gray-300">Nova senha</Label>
                    <Input id="newPassword" type="password" className="bg-black/20 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar nova senha</Label>
                    <Input id="confirmPassword" type="password" className="bg-black/20 border-white/10 text-white" />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-6">
                  <Button onClick={(e) => handleSave(e, "Senha alterada com sucesso!")} className="bg-green-neon text-black hover:bg-green-neon/90 font-semibold">
                    Atualizar senha
                  </Button>
                </CardFooter>
              </Card>               
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <div className="relative z-50">
        <Footer />
      </div>
    </div>
  );
}
