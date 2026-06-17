import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function handleSubscriptionEvent(
  event: Stripe.Event,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  const subscription = event.data.object as Stripe.Subscription;
  
  let userId = subscription.metadata.userId;

  if (!userId) {
    // Fallback: lookup by stripe_customer_id or stripe_subscription_id
    const { data: subData } = await supabase
      .from('stripe_subscriptions')
      .select('user_id')
      .or(`stripe_customer_id.eq.${subscription.customer as string},stripe_subscription_id.eq.${subscription.id}`)
      .maybeSingle();
    
    if (subData) {
      userId = subData.user_id;
    }
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      if (!userId) {
        console.error('No userId found for subscription event:', subscription.id);
        break;
      }

      await supabase
        .from('stripe_subscriptions')
        .upsert(
          {
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_end: new Date(((subscription as any).current_period_end || subscription.items.data[0]?.current_period_end || 0) * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
            price_id: subscription.items.data[0]?.price.id,
            updated_at: new Date(),
          },
          { onConflict: 'user_id' }
        );

      // Atualizar metadados do usuário no Supabase Auth
      try {
        const { data: userObject, error: getError } = await supabase.auth.admin.getUserById(userId);
        if (!getError && userObject?.user) {
          const currentMetadata = userObject.user.user_metadata || {};
          const isStatusActive = subscription.status === 'active' || subscription.status === 'trialing';
          const newMetadata = {
            ...currentMetadata,
            subscription: isStatusActive ? 'active' : 'inactive',
            plan: isStatusActive ? 'pro' : 'free'
          };
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: newMetadata,
            app_metadata: {
              plan: isStatusActive ? 'pro' : 'free',
              subscription: isStatusActive ? 'active' : 'inactive'
            }
          });
          console.log(`Updated user ${userId} auth metadata (user_metadata + app_metadata) to plan: ${newMetadata.plan}, subscription: ${newMetadata.subscription}`);
        } else {
          console.error(`Error fetching user ${userId} to update auth metadata:`, getError);
        }
      } catch (err) {
        console.error('Error updating user auth metadata in webhook:', err);
      }

      break;

    case 'customer.subscription.deleted':
      if (!userId) {
        console.error('No userId found for subscription deleted event:', subscription.id);
        break;
      }

      await supabase
        .from('stripe_subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date(),
        })
        .eq('stripe_subscription_id', subscription.id);

      // Remover acesso PRO do usuário no Supabase Auth
      try {
        const { data: userObject, error: getError } = await supabase.auth.admin.getUserById(userId);
        if (!getError && userObject?.user) {
          const currentMetadata = userObject.user.user_metadata || {};
          const newMetadata = {
            ...currentMetadata,
            subscription: 'inactive',
            plan: 'free'
          };
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: newMetadata,
            app_metadata: {
              plan: 'free',
              subscription: 'inactive'
            }
          });
          console.log(`Removed user ${userId} PRO access on subscription delete (user_metadata + app_metadata)`);
        }
      } catch (err) {
        console.error('Error removing user auth metadata in webhook:', err);
      }

      break;

    case 'invoice.paid':
      // Atualizar data do próximo pagamento
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as any).subscription || (invoice as any).parent?.subscription_details?.subscription;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId as string);
        await supabase
          .from('stripe_subscriptions')
          .update({
            current_period_end: new Date(((sub as any).current_period_end || sub.items.data[0]?.current_period_end || 0) * 1000),
          })
          .eq('stripe_subscription_id', sub.id);
      }
      break;

    case 'invoice.payment_failed':
      // Notificar usuário sobre falha de pagamento
      console.error('Payment failed for subscription:', subscription.id);
      break;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceRoleClient();

    if (event.type.startsWith('customer.subscription.') || event.type.startsWith('invoice.')) {
      await handleSubscriptionEvent(event, supabase);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
