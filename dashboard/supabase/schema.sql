-- [PREVIOUS CONTENT OF schema.sql]

-- 1. Diet Plans
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  goal text,
  total_calories integer,
  diet_preference text,
  plan_type text NOT NULL DEFAULT 'template'
    CHECK (plan_type IN ('template','custom')),
  tags text[] DEFAULT '{}',
  structure jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diet_plans_trainer_id ON diet_plans (trainer_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_goal ON diet_plans (goal);
CREATE INDEX IF NOT EXISTS idx_diet_plans_plan_type ON diet_plans (plan_type);
CREATE INDEX IF NOT EXISTS idx_diet_plans_is_active ON diet_plans (is_active);

-- 2. Workout Plans
CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  level text,
  frequency_per_week integer,
  focus text,
  description text,
  plan_type text NOT NULL DEFAULT 'template'
    CHECK (plan_type IN ('template','custom')),
  tags text[] DEFAULT '{}',
  structure jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_trainer_id ON workout_plans (trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_level ON workout_plans (level);
CREATE INDEX IF NOT EXISTS idx_workout_plans_focus ON workout_plans (focus);
CREATE INDEX IF NOT EXISTS idx_workout_plans_plan_type ON workout_plans (plan_type);
CREATE INDEX IF NOT EXISTS idx_workout_plans_is_active ON workout_plans (is_active);

-- 3. Plan Programs (Bundles)
CREATE TABLE IF NOT EXISTS plan_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  target text,
  duration_weeks integer,
  diet_plan_id uuid REFERENCES diet_plans(id) ON DELETE SET NULL,
  workout_plan_id uuid REFERENCES workout_plans(id) ON DELETE SET NULL,
  intensity text,
  recommended_profile text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','draft','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plan_programs_trainer_id ON plan_programs (trainer_id);
CREATE INDEX IF NOT EXISTS idx_plan_programs_status ON plan_programs (status);

-- 4. Clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active','Paused','Trial','Inactive')),
  goal text,
  gender text,
  age integer,
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  diet_preference text,
  experience_level text,
  time_availability text,
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients (trainer_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients (status);

-- 5. Client Programs (Linking Clients to Programs)
CREATE TABLE IF NOT EXISTS client_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES plan_programs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','paused','completed','cancelled')),
  start_date date NOT NULL,
  end_date date,
  is_current boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_client_program_current ON client_programs (client_id) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_client_programs_program_id ON client_programs (program_id);

-- 6. Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  billing_cycle text NOT NULL DEFAULT 'one_time'
    CHECK (billing_cycle IN ('monthly','package','one_time','trial')),
  status text NOT NULL DEFAULT 'due'
    CHECK (status IN ('paid','due','overdue','refunded','cancelled')),
  due_date date,
  paid_at timestamptz,
  method text DEFAULT 'cash',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments (client_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments (due_date);

-- 7. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  subject text NOT NULL,
  category text NOT NULL
    CHECK (category IN ('technical','billing','plan_help','feature_request','other')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','in_progress','resolved','closed')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low','normal','high','urgent')),
  description text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_trainer_id ON support_tickets (trainer_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets (status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets (category);

-- 8. Views

-- clients_with_programs VIEW
CREATE OR REPLACE VIEW clients_with_programs AS
SELECT
  c.id AS client_id,
  c.trainer_id,
  c.name,
  c.status,
  c.phone,
  c.goal,
  c.last_active_at,
  cp.program_id,
  pp.name AS program_name,
  cp.status AS program_status,
  cp.start_date AS program_start_date,
  cp.end_date AS program_end_date
FROM clients c
LEFT JOIN LATERAL (
  SELECT *
  FROM client_programs cp2
  WHERE cp2.client_id = c.id
    AND cp2.is_current = true
  ORDER BY cp2.created_at DESC
  LIMIT 1
) cp ON true
LEFT JOIN plan_programs pp
  ON cp.program_id = pp.id;

-- clients_view (Full view with payments)
CREATE OR REPLACE VIEW clients_view AS
SELECT
  c.id AS client_id,
  c.trainer_id,
  c.name,
  c.status,
  c.phone,
  c.goal,
  c.last_active_at,
  -- program info
  cp.program_id,
  pp.name AS plan_name,
  cp.status AS program_status,
  cp.start_date AS program_start_date,
  cp.end_date AS program_end_date,
  -- next payment (due/overdue)
  next_pay.next_payment_date,
  -- last payment snapshot
  last_pay.last_payment_status,
  last_pay.last_payment_amount,
  last_pay.last_payment_at
FROM clients c
LEFT JOIN LATERAL (
  SELECT *
  FROM client_programs cp2
  WHERE cp2.client_id = c.id
    AND cp2.is_current = true
  ORDER BY cp2.created_at DESC
  LIMIT 1
) cp ON true
LEFT JOIN plan_programs pp
  ON cp.program_id = pp.id
-- next upcoming payment (due or overdue)
LEFT JOIN LATERAL (
  SELECT
    p.due_date AS next_payment_date
  FROM payments p
  WHERE p.client_id = c.id
    AND p.status IN ('due','overdue')
    AND p.due_date IS NOT NULL
  ORDER BY p.due_date ASC
  LIMIT 1
) next_pay ON true
-- last payment (any status, most recent)
LEFT JOIN LATERAL (
  SELECT
    p2.status AS last_payment_status,
    p2.amount AS last_payment_amount,
    COALESCE(p2.paid_at, p2.created_at) AS last_payment_at
  FROM payments p2
  WHERE p2.client_id = c.id
  ORDER BY COALESCE(p2.paid_at, p2.created_at) DESC
  LIMIT 1
) last_pay ON true;

-- diet_plans_usage VIEW
CREATE OR REPLACE VIEW diet_plans_usage AS
SELECT
  dp.id AS diet_plan_id,
  dp.name AS diet_plan_name,
  dp.goal,
  dp.total_calories,
  dp.diet_preference,
  dp.plan_type,
  dp.tags,
  dp.is_active,
  dp.trainer_id,
  COUNT(DISTINCT cp.client_id) AS active_clients_count
FROM diet_plans dp
LEFT JOIN plan_programs pp
  ON pp.diet_plan_id = dp.id
LEFT JOIN client_programs cp
  ON cp.program_id = pp.id
  AND cp.is_current = true
  AND cp.status = 'active'
GROUP BY
  dp.id,
  dp.name,
  dp.goal,
  dp.total_calories,
  dp.diet_preference,
  dp.plan_type,
  dp.tags,
  dp.is_active,
  dp.trainer_id;

-- workout_plans_usage VIEW
CREATE OR REPLACE VIEW workout_plans_usage AS
SELECT
  wp.id AS workout_plan_id,
  wp.name AS workout_plan_name,
  wp.level,
  wp.frequency_per_week,
  wp.focus,
  wp.plan_type,
  wp.tags,
  wp.is_active,
  wp.trainer_id,
  COUNT(DISTINCT cp.client_id) AS active_clients_count
FROM workout_plans wp
LEFT JOIN plan_programs pp
  ON pp.workout_plan_id = wp.id
LEFT JOIN client_programs cp
  ON cp.program_id = pp.id
  AND cp.is_current = true
  AND cp.status = 'active'
GROUP BY
  wp.id,
  wp.name,
  wp.level,
  wp.frequency_per_week,
  wp.focus,
  wp.plan_type,
  wp.tags,
  wp.is_active,
  wp.trainer_id;

-- support_view VIEW
CREATE OR REPLACE VIEW support_view AS
SELECT
  st.id AS ticket_id,
  st.trainer_id,
  u.email AS trainer_email,
  st.client_id,
  c.name AS client_name,
  st.subject,
  st.category,
  st.status,
  st.priority,
  st.created_at,
  st.updated_at,
  st.resolved_at
FROM support_tickets st
LEFT JOIN auth.users u
  ON st.trainer_id = u.id
LEFT JOIN clients c
  ON st.client_id = c.id;

-- 9. Row Level Security (RLS) Policies

-- 9.1. Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can SELECT own clients" ON clients FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers can INSERT own clients" ON clients FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can UPDATE own clients" ON clients FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers can DELETE own clients" ON clients FOR DELETE USING (trainer_id = auth.uid());

-- 9.2. Diet Plans
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own diet plans" ON diet_plans FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own diet plans" ON diet_plans FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own diet plans" ON diet_plans FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());

-- 9.3. Workout Plans
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own workout plans" ON workout_plans FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own workout plans" ON workout_plans FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own workout plans" ON workout_plans FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());

-- 9.4. Plan Programs
ALTER TABLE plan_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own programs" ON plan_programs FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own programs" ON plan_programs FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own programs" ON plan_programs FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());

-- 9.5. Client Programs
ALTER TABLE client_programs ENABLE ROW LEVEL SECURITY;

-- Assuming we can join via clients if trainer_id is not present, but since we have client_id which has trainer_id...
-- Ideally client_programs should inherit access from clients.
-- However, for simplicity and performance, adding trainer_id to client_programs or using EXISTS is good.
-- Let's use the EXISTS clause as per user suggestion since we didn't explicitly add trainer_id to client_programs table definition above, 
-- although adding it would be better for performance. The user's schema for client_programs didn't have trainer_id.
-- Wait, the user provided RLS using EXISTS.

CREATE POLICY "Trainers SELECT client_programs via clients" ON client_programs FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM clients c
    WHERE c.id = client_programs.client_id
      AND c.trainer_id = auth.uid()
  )
);

CREATE POLICY "Trainers INSERT client_programs via clients" ON client_programs FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1
    FROM clients c
    WHERE c.id = client_programs.client_id
      AND c.trainer_id = auth.uid()
  )
);

CREATE POLICY "Trainers UPDATE client_programs via clients" ON client_programs FOR UPDATE USING (
  EXISTS (
    SELECT 1
    FROM clients c
    WHERE c.id = client_programs.client_id
      AND c.trainer_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1
    FROM clients c
    WHERE c.id = client_programs.client_id
      AND c.trainer_id = auth.uid()
  )
);

-- 9.6. Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own payments" ON payments FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own payments" ON payments FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own payments" ON payments FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());

-- 9.7. Support Tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own tickets" ON support_tickets FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own tickets" ON support_tickets FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own tickets" ON support_tickets FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());
