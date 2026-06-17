import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { priceId } = body as { priceId?: string };

    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.warn('Checkout attempted by unauthorized user or session error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const safeUserId = user.id;
    const safeEmail = user.email!;

    console.log('Checkout endpoint received request for user:', safeUserId);

    const requestedPriceId = typeof priceId === 'string' ? priceId : undefined;
    const fallbackPrice = process.env.STRIPE_PRICE_ID_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;
    const isValidPriceId = (id?: string) => typeof id === 'string' && id.startsWith('price_');

    if (requestedPriceId && !isValidPriceId(requestedPriceId)) {
      console.warn('Invalid Stripe priceId received from request:', requestedPriceId);
    }
    if (fallbackPrice && !isValidPriceId(fallbackPrice)) {
      console.warn('Invalid Stripe fallback price id from env:', fallbackPrice);
    }

    const finalPriceId = isValidPriceId(requestedPriceId)
      ? requestedPriceId
      : isValidPriceId(fallbackPrice)
      ? fallbackPrice
      : undefined;

    if (!finalPriceId) {
      console.warn('Checkout missing finalPriceId');
      return NextResponse.json(
        { error: 'Missing required field: priceId' },
        { status: 400 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_APP_URL environment variable' },
        { status: 500 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: subscription, error: selectError } = await supabase
      .from('stripe_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', safeUserId)
      .single();

    const ignoredSelectErrors = ['PGRST116', 'PGRST205'];
    if (selectError && !ignoredSelectErrors.includes(selectError.code || '')) {
      console.error('Supabase select user subscription error:', selectError);
    }

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: safeEmail,
        metadata: {
          userId: safeUserId,
        },
      });
      customerId = customer.id;

      const { error: insertError } = await supabase
        .from('stripe_subscriptions')
        .insert({
          user_id: safeUserId,
          stripe_customer_id: customerId,
        });

      if (insertError && insertError.code !== 'PGRST205') {
        console.error('Supabase insert stripe_subscriptions error:', insertError);
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/planos`,
      subscription_data: {
        metadata: {
          userId: safeUserId,
        },
      },
      metadata: {
        userId: safeUserId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
