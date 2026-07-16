import { Suspense } from "react";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { User, Shield, Heart, CreditCard } from "lucide-react";
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
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = user.user_metadata?.role === "admin" || (!!adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase());

  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const planMetadata = ((user.user_metadata?.plan || user.app_metadata?.plan) || '').toLowerCase();
  const subscriptionMetadata = ((user.user_metadata?.subscription || user.app_metadata?.subscription) || '').toLowerCase();
  const metadataIsPro = planMetadata === 'pro' || subscriptionMetadata === 'active';
  const metadataIsUltra = planMetadata === 'ultra';

  const rowIsActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isSubscribed = metadataIsPro || metadataIsUltra || rowIsActive;
  const isTrial = subscription?.status === 'trialing';
  const currentPeriodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;

  const isYearlyPriceInRow =
    subscription?.price_id === process.env.STRIPE_PRICE_ID_YEARLY ||
    subscription?.price_id === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY;

  const billingCycle = subscription?.price_id
    ? (isYearlyPriceInRow ? 'Anual' : 'Mensal')
    : (metadataIsUltra ? 'Anual' : metadataIsPro ? 'Mensal' : '');

  const planTier = isSubscribed
    ? (metadataIsUltra || isYearlyPriceInRow ? 'Ultra' : 'Pro')
    : 'Free';

  const statusLabel = isSubscribed ? (isTrial ? 'Período de Teste' : planTier) : 'Free';

  // cálculo do tempo restante até o fim do período
  let timeRemainingText: string | null = null;
  if (currentPeriodEnd) {
    const now = new Date();
    const diffMs = currentPeriodEnd.getTime() - now.getTime();
    if (diffMs <= 0) {
      timeRemainingText = 'Expirado';
    } else {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (days >= 30) {
        const months = Math.floor(days / 30);
        const remDays = days % 30;
        timeRemainingText = `${months} mês${months > 1 ? 'es' : ''}${remDays > 0 ? ` e ${remDays} dia${remDays > 1 ? 's' : ''}` : ''} restantes`;
      } else if (days >= 1) {
        timeRemainingText = `${days} dia${days > 1 ? 's' : ''} restantes`;
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        timeRemainingText = `${hours} hora${hours > 1 ? 's' : ''} restantes`;
      }
    }
  }

  const statusDescription = isSubscribed
    ? subscription?.status === 'canceled'
      ? `Seu plano será encerrado em ${currentPeriodEnd?.toLocaleDateString('pt-BR')}.`
      : currentPeriodEnd
        ? `Próxima renovação em ${currentPeriodEnd.toLocaleDateString('pt-BR')}. (${timeRemainingText})`
        : (metadataIsUltra || metadataIsPro)
          ? 'Sua assinatura está ativa. Aguarde alguns minutos para sincronizar os dados de renovação.'
          : 'Você está com acesso premium ao conteúdo Pro.'
    : 'Você ainda pode usar o acesso gratuito e assinar quando quiser.';

  const statusBadgeClasses = isSubscribed
    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
    : 'bg-slate-700/80 text-slate-200 border border-slate-600/50';

  return (
    <div className="space-y-12">
      {/* Header da Página */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Minha <span className="text-green-neon">Conta</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Controle seu plano e veja de forma clara se você está no Free, Mensal ou Anual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Conta e Navegação */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-neon/20 flex items-center justify-center border border-green-neon/30 p-4 m-2 mb-4">
                  <User className="w-8 h-8 text-green-neon" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Conta</CardTitle>
                  <CardDescription className="text-gray-500">{user.email}</CardDescription>
                  <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition ${statusBadgeClasses}`}>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClasses}`}>
                      {statusLabel}
                    </span>
                  </div>
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
              <CardTitle className="text-white text-2xl font-bold">Status do Plano</CardTitle>
              <CardDescription className="text-gray-400">
                Veja com clareza seu plano atual e a próxima data de renovação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-gray-500">
                        Plano Atual
                      </p>
                      <h2 className="text-5xl font-black text-white">
                        {statusLabel}
                      </h2>
                      <p className="max-w-xl text-sm text-gray-400">
                        {statusDescription}
                      </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${statusBadgeClasses}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-3xl bg-slate-950/80 p-5">
                      <p className="text-sm text-gray-400">E-mail</p>
                      <p className="mt-2 text-white font-semibold break-all">{user.email}</p>
                    </div>
                    {!isSubscribed ? (
                      <div className="rounded-3xl bg-slate-950/80 p-5">
                        <p className="text-sm text-gray-400">Status</p>
                        <p className="mt-2 text-white font-semibold">Plano Gratuito</p>
                      </div>
                    ) : currentPeriodEnd ? (
                      <>
                        <div className="rounded-3xl bg-slate-950/80 p-5">
                          <p className="text-sm text-gray-400">
                            {billingCycle === 'Anual' ? 'Vencimento' : 'Próxima Renovação'}
                          </p>
                          <p className="mt-2 text-white font-semibold">
                            {currentPeriodEnd.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="rounded-3xl bg-slate-950/80 p-5">
                          <p className="text-sm text-gray-400">Tempo Restante</p>
                          <p className="mt-2 text-white font-semibold">
                            {timeRemainingText}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-3xl bg-slate-950/80 p-5 md:col-span-2">
                        <p className="text-sm text-gray-400">Atualização</p>
                        <p className="mt-2 text-white font-semibold">
                          Informação de renovação sendo sincronizada...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-5">
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Seu plano</p>
                    <p className="mt-3 text-lg font-semibold text-white">{isSubscribed ? `${planTier}${billingCycle ? ` • ${billingCycle}` : ''}` : 'Free'}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">Aproveite o conteúdo sem distrações e sem configurações extras. Este painel mostra apenas o essencial.</p>
                    <p className="text-sm text-gray-400">Se você já tem assinatura, ela continuará válida até a data indicada.</p>
                  </div>
                  <Link href="/planos" className="inline-flex w-full items-center justify-center rounded-full bg-green-neon px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                    {isSubscribed ? 'Ver Planos' : 'Assinar agora'}
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl bg-[#111] border border-white/10 p-6 text-sm text-gray-300">
                <p className="font-semibold text-white">Comparação rápida</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-neon" />
                    <span>Free: acesso básico com favoritos e navegação livre.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-neon" />
                    <span>Mensal: renovação automática a cada 30 dias e conteúdo premium.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-neon" />
                    <span>Anual: maior economia e acesso contínuo por 12 meses.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
