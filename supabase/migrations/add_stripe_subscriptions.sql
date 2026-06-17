-- Create stripe_subscriptions table
create table public.stripe_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  stripe_subscription_id text,
  status text check (status in ('active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'trialing')),
  price_id text,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indices
create index idx_stripe_subscriptions_user_id on public.stripe_subscriptions(user_id);
create index idx_stripe_subscriptions_stripe_customer_id on public.stripe_subscriptions(stripe_customer_id);
create index idx_stripe_subscriptions_stripe_subscription_id on public.stripe_subscriptions(stripe_subscription_id);

-- Enable RLS
alter table public.stripe_subscriptions enable row level security;

-- RLS Policies
create policy "Users can view their own subscriptions"
  on public.stripe_subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Only service role can update subscriptions"
  on public.stripe_subscriptions
  for update
  using (auth.role() = 'service_role');

create policy "Only service role can insert subscriptions"
  on public.stripe_subscriptions
  for insert
  with check (auth.role() = 'service_role');
