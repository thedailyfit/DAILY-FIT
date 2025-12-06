-- Create client_subscriptions table
CREATE TABLE IF NOT EXISTS client_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  billing_cycle text CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly', 'one_time')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  next_billing_date date,
  status text CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create client_payments table
CREATE TABLE IF NOT EXISTS client_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'INR',
  status text CHECK (status IN ('completed', 'pending', 'failed', 'refunded')) DEFAULT 'completed',
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'card', 'other')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON client_subscriptions (client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON client_payments (client_id);

-- RLS Policies
ALTER TABLE client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_payments ENABLE ROW LEVEL SECURITY;

-- Subscriptions Policies
CREATE POLICY "Trainers SELECT own client subscriptions" ON client_subscriptions 
  FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers INSERT own client subscriptions" ON client_subscriptions 
  FOR INSERT WITH CHECK (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers UPDATE own client subscriptions" ON client_subscriptions 
  FOR UPDATE USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers DELETE own client subscriptions" ON client_subscriptions 
  FOR DELETE USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

-- Payments Policies
CREATE POLICY "Trainers SELECT own client payments" ON client_payments 
  FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers INSERT own client payments" ON client_payments 
  FOR INSERT WITH CHECK (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers UPDATE own client payments" ON client_payments 
  FOR UPDATE USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));

CREATE POLICY "Trainers DELETE own client payments" ON client_payments 
  FOR DELETE USING (client_id IN (SELECT id FROM clients WHERE trainer_id = auth.uid()));
