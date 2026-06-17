'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getSubscriptionDetailsAction } from '@/app/actions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

function SubscribeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (!sessionId) {
          setError('Session ID not found');
          setLoading(false);
          return;
        }

        const result = await getSubscriptionDetailsAction(sessionId);
        
        if (result.success && result.subscription) {
          setSubscription(result.subscription);
        } else {
          setError(result.error || 'Erro ao verificar assinatura');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error verifying session:', err);
        setError('Erro ao verificar assinatura');
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050505]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-neon" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-40 pb-24 px-4">
        <Card className="max-w-md w-full border-green-neon/30 bg-white/5 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-neon/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-green-neon" />
            </div>
            <CardTitle className="text-2xl text-green-neon">
              Assinatura Confirmada!
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error ? (
              <div className="text-center text-red-500">
                <p>{error}</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/planos">Voltar aos planos</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2 text-center text-gray-300">
                  <p className="text-sm">Sua assinatura está activa!</p>
                  {subscription && (
                    <p className="text-xs text-gray-400">
                      Próximo pagamento:{' '}
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full bg-green-neon hover:bg-green-dark text-black font-bold">
                    <Link href="/prompts">Acessar Prompts</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/conta">Gerenciar Assinatura</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default function SubscribeSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#050505]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-neon" />
        </main>
        <Footer />
      </div>
    }>
      <SubscribeSuccessContent />
    </Suspense>
  );
}
