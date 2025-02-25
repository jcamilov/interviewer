-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.billing_history CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.customer_subscriptions CASCADE;
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

-- Create subscription plans table
CREATE TABLE subscription_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price_id text NOT NULL, -- Stripe Price ID
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  interval text NOT NULL, -- 'month' or 'year'
  active boolean DEFAULT true,
  features jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create customer subscriptions table
CREATE TABLE customer_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  subscription_id text NOT NULL, -- Stripe Subscription ID
  plan_id uuid REFERENCES subscription_plans NOT NULL,
  status text NOT NULL,
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create billing history table
CREATE TABLE billing_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    amount integer NOT NULL,
    currency text NOT NULL DEFAULT 'usd',
    status text NOT NULL,
    invoice_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- Policies for subscription_plans
CREATE POLICY "Allow public read access to active plans" ON subscription_plans
  FOR SELECT USING (active = true);

-- Policies for customer_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON customer_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON customer_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for billing history
CREATE POLICY "Users can view own billing history"
    ON billing_history
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.subscriptions_handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.subscriptions_handle_updated_at();

CREATE TRIGGER handle_subscriptions_updated_at
    BEFORE UPDATE ON customer_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.subscriptions_handle_updated_at();

-- Insert some default plans
INSERT INTO subscription_plans (name, description, price_id, amount, interval, features) VALUES
('Starter', 'Perfect for side projects and small startups', 'price_starter', 99.00, 'month', '["Up to 5 team members", "Basic analytics", "Community support", "5GB storage", "API access"]'),
('Pro', 'Best for growing businesses', 'price_pro', 249.00, 'month', '["Unlimited team members", "Advanced analytics", "Priority support", "50GB storage", "API access", "Custom integrations"]'),
('Enterprise', 'For large scale applications', 'price_enterprise', 999.00, 'month', '["Unlimited everything", "White-label options", "24/7 phone support", "500GB storage", "API access", "Custom development"]'); 