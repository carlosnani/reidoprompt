import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID required' },
        { status: 400 }
      );
    }

    // Cancelar subscription ao final do período
    const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const supabase = createServiceRoleClient();

    // Atualizar registro no banco
    await supabase
      .from('stripe_subscriptions')
      .update({
        cancel_at_period_end: true,
      })
      .eq('stripe_subscription_id', subscriptionId);

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: canceledSubscription,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
