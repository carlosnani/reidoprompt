'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface StripeCheckoutButtonProps {
  priceId: string;
  userId: string;
  email: string;
  children: React.ReactNode;
  className?: string;
}

export function StripeCheckoutButton({
  priceId,
  userId,
  email,
  children,
  className,
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Debug logs to help diagnose missing fields
      console.info('Stripe checkout: start', { priceId, userId, email });

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // send explicit null if priceId is undefined so server can detect and apply fallback
          priceId: priceId ?? null,
          userId,
          email,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        console.error('Checkout create session failed:', response.status, body);
        throw new Error(body?.error || 'Failed to create checkout session');
      }

      const body = await response.json().catch(() => ({}));

      // Prefer server-provided redirect URL (session.url).
      const { url } = body as { url?: string };

      if (url) {
        // Redirect browser directly to Stripe Checkout URL
        window.location.href = url;
      } else {
        console.error('No session URL returned from server', body);
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processando...' : children}
    </Button>
  );
}
