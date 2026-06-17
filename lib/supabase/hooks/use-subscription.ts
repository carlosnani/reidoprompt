'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/lib/supabase/hooks';

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing';
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function useSubscription() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          setIsSubscribed(false);
          setSubscription(null);
        } else if (data) {
          setSubscription(data);
          setIsSubscribed(data.status === 'active' || data.status === 'trialing');
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`subscription:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stripe_subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setSubscription(payload.new as Subscription);
            setIsSubscribed(
              (payload.new as Subscription).status === 'active' ||
              (payload.new as Subscription).status === 'trialing'
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase]);

  return {
    subscription,
    isSubscribed,
    loading,
    isActive: isSubscribed,
    isPastDue: subscription?.status === 'past_due',
    isCanceled: subscription?.status === 'canceled',
  };
}
