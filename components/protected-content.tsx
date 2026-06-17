'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/lib/supabase/hooks/use-subscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LockIcon } from 'lucide-react';

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedContent({ children, fallback }: ProtectedContentProps) {
  const { isSubscribed, loading } = useSubscription();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isSubscribed) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505]">
          <Card className="max-w-md w-full border-white/10 bg-white/5">
            <CardContent className="pt-8 space-y-4 text-center">
              <LockIcon className="w-12 h-12 mx-auto text-green-neon" />
              <h2 className="text-2xl font-bold text-white">Conteúdo Exclusivo</h2>
              <p className="text-gray-400">
                Este conteúdo é exclusivo para assinantes premium. Assine agora para ter acesso!
              </p>
              <Button asChild className="w-full bg-green-neon hover:bg-green-dark text-black font-bold">
                <Link href="/planos">Ver Planos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    );
  }

  return <>{children}</>;
}
