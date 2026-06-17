import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabaseClient = await createClient();
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseAdmin = createServiceRoleClient();

    // Query database for subscription details securely using the authenticated user.id
    const { data: subscription, error: dbError } = await supabaseAdmin
      .from('stripe_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (dbError || !subscription?.stripe_subscription_id) {
      console.warn(`Cancel subscription: subscription not found for user ${user.id}:`, dbError);
      return NextResponse.json(
        { error: 'Active subscription not found' },
        { status: 404 }
      );
    }

    const safeSubscriptionId = subscription.stripe_subscription_id;

    // Cancel subscription at the end of period
    const canceledSubscription = await stripe.subscriptions.update(safeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update DB record
    await supabaseAdmin
      .from('stripe_subscriptions')
      .update({
        cancel_at_period_end: true,
      })
      .eq('stripe_subscription_id', safeSubscriptionId);

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
