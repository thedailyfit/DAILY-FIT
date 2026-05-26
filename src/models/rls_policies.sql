-- ============================================================
-- DailyFit: Row Level Security (RLS) Policies
-- C-06: Prevent unauthorized data access via Supabase anon key
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_schedule ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- GYMS: Owner can see/edit their own gym
-- ============================================================
CREATE POLICY "Gym owners can view own gym"
    ON gyms FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Gym owners can update own gym"
    ON gyms FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create gyms"
    ON gyms FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- MEMBERS: Gym owners see members in their gym
-- Staff trainers see their assigned members
-- ============================================================
CREATE POLICY "Gym owners can view gym members"
    ON members FOR SELECT
    USING (
        trainer_id IN (
            SELECT gym_id::text FROM gyms WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view assigned members"
    ON members FOR SELECT
    USING (
        assigned_trainer_id IN (
            SELECT id::text FROM staff WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Gym owners can manage gym members"
    ON members FOR ALL
    USING (
        trainer_id IN (
            SELECT gym_id::text FROM gyms WHERE owner_id = auth.uid()
        )
    );

-- ============================================================
-- STAFF: Gym owners manage their staff
-- Staff can view own profile
-- ============================================================
CREATE POLICY "Gym owners can manage staff"
    ON staff FOR ALL
    USING (
        gym_id IN (
            SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Staff can view own profile"
    ON staff FOR SELECT
    USING (auth_id = auth.uid());

CREATE POLICY "Staff can update own profile"
    ON staff FOR UPDATE
    USING (auth_id = auth.uid());

-- ============================================================
-- LEADS: Gym owners see their leads
-- ============================================================
CREATE POLICY "Gym owners can manage leads"
    ON leads FOR ALL
    USING (
        gym_id IN (
            SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
        )
    );

-- ============================================================
-- DIET/WORKOUT TEMPLATES: Public or gym-owned
-- ============================================================
CREATE POLICY "Anyone can view public templates"
    ON diet_templates FOR SELECT
    USING (is_public = true);

CREATE POLICY "Gym owners can manage own templates"
    ON diet_templates FOR ALL
    USING (
        gym_id IN (
            SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view public workout templates"
    ON workout_templates FOR SELECT
    USING (true); -- Workout templates don't have is_public yet

CREATE POLICY "Gym owners can manage own workout templates"
    ON workout_templates FOR ALL
    USING (
        gym_id IN (
            SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
        )
    );

-- ============================================================
-- SUBSCRIPTIONS: Gym owners see their subscriptions
-- ============================================================
CREATE POLICY "Gym owners can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (
        gym_id IN (
            SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
        )
    );

-- ============================================================
-- TRAINER SCHEDULE: Staff/owners can manage schedules
-- ============================================================
CREATE POLICY "Staff can manage own schedule"
    ON trainer_schedule FOR ALL
    USING (
        trainer_id IN (
            SELECT id FROM staff WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Gym owners can view all schedules"
    ON trainer_schedule FOR SELECT
    USING (
        trainer_id IN (
            SELECT id FROM staff WHERE gym_id IN (
                SELECT gym_id FROM gyms WHERE owner_id = auth.uid()
            )
        )
    );

-- ============================================================
-- WEIGHT CHECKINS: Members / trainers
-- ============================================================
CREATE POLICY "Trainers can view member checkins"
    ON weight_checkins FOR SELECT
    USING (true); -- Simplify for now, tighten after member auth is added

-- ============================================================
-- SERVICE ROLE BYPASS (for backend server operations)
-- The backend uses DATABASE_URL with the service_role key,
-- which bypasses RLS. This is by design.
-- ============================================================
