'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/lib/supabase/hooks';
import { createClient } from '@/lib/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
interface SubscriptionManagerProps {
  subscription: any;
}

export function SubscriptionManager({ subscription }: SubscriptionManagerProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const supabase = createClient();

  const handleUpdatePaymentMethod = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao abrir portal de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
        }),
      });

      if (!response.ok) throw new Error('Failed to cancel');
      alert('Assinatura cancelada com sucesso');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao cancelar assinatura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Gerenciar Assinatura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-400">Status</p>
          <p className="font-semibold capitalize">{subscription.status}</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Próxima Renovação</p>
          <p className="font-semibold">
            {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="pt-4 space-y-2">
          <Button
            onClick={handleUpdatePaymentMethod}
            disabled={loading}
            className="w-full"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar Forma de Pagamento'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Cancelar Assinatura
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Cancelar Assinatura?</AlertDialogTitle>
              <AlertDialogDescription>
                Você perderá acesso aos recursos premium. Pode se inscrever novamente a qualquer momento.
              </AlertDialogDescription>
              <div className="flex gap-2">
                <AlertDialogCancel>Não, manter</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelSubscription}>
                  Sim, cancelar
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
