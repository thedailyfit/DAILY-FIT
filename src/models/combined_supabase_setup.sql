-- ============================================================
-- DailyFit AI: Unified Database Setup, Migrations & RLS Policies
-- Resolves error: relation "conversations" does not exist and other schema mismatches.
-- Run this in your Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- STEP 0: ENSURE "gyms" TABLE AND ALL "gym_id" COLUMNS EXIST AT THE VERY TOP
-- ============================================================

-- 1. Create the gyms table first if it doesn't exist
CREATE TABLE IF NOT EXISTS gyms (
    gym_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_name VARCHAR(100) NOT NULL,
    gym_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. If gyms already existed, ensure the gym_id column exists (or is compatible)
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS gym_id UUID DEFAULT gen_random_uuid();

-- 3. Pre-emptively add gym_id column to all other potential V1 tables
-- This ensures the column exists before any CREATE TABLE with foreign keys or RLS policies runs!
ALTER TABLE IF EXISTS staff ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS members ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS leads ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS diet_templates ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS workout_templates ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS subscriptions ADD COLUMN IF NOT EXISTS gym_id UUID;
ALTER TABLE IF EXISTS whatsapp_connections ADD COLUMN IF NOT EXISTS gym_id UUID;


-- ============================================================
-- STEP 1: CREATE CORE TABLES WITH FOREIGN KEYS (IF NOT EXISTS)
-- ============================================================

-- Staff (Gym Trainers / Admins under the Owner)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id) NOT NULL,
    auth_id UUID REFERENCES auth.users(id),
    role VARCHAR(20) DEFAULT 'trainer',
    name VARCHAR(100),
    email VARCHAR(100),
    whatsapp_notification_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    bio TEXT,
    specialization VARCHAR(255),
    experience_years VARCHAR(10),
    UNIQUE(auth_id)
);

-- Trainers (System representation of Trainers)
CREATE TABLE IF NOT EXISTS trainers (
    trainer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INT,
    phone_number VARCHAR(20),
    city VARCHAR(100),
    profile_picture_url TEXT,
    specialization VARCHAR(255),
    assigned_member_ids JSONB DEFAULT '[]'::jsonb,
    edit_history JSONB DEFAULT '[]'::jsonb,
    daily_digest_preferences JSONB DEFAULT '{"time":"08:00","include_low_adherence":true}'::jsonb
);

-- Members (Clients)
CREATE TABLE IF NOT EXISTS members (
    member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id),
    whatsapp_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    goal VARCHAR(20) CHECK (goal IN ('fat_loss', 'muscle_gain', 'maintenance')),
    diet_preference VARCHAR(20) CHECK (diet_preference IN ('veg', 'non-veg', 'vegan')),
    allergies TEXT[] DEFAULT '{}',
    trainer_id VARCHAR(50),
    assigned_trainer_id UUID REFERENCES staff(id),
    adherence_score DECIMAL(5,2) DEFAULT 100.0,
    weight_history JSONB DEFAULT '[]'::jsonb,
    sleep_history JSONB DEFAULT '[]'::jsonb,
    check_in_history JSONB DEFAULT '[]'::jsonb,
    meal_logs JSONB DEFAULT '[]'::jsonb,
    plan_id_active VARCHAR(50),
    consent_flags JSONB DEFAULT '{"terms_accepted": true, "data_processing": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    monthly_fee DECIMAL(10, 2) DEFAULT 0,
    invite_code VARCHAR(20) UNIQUE
);

-- Leads (Sales Pipeline)
CREATE TABLE IF NOT EXISTS leads (
    lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id),
    whatsapp_id VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'new',
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Diet Templates
CREATE TABLE IF NOT EXISTS diet_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    region VARCHAR(50),
    calories INT,
    data JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    trainer_id UUID,
    template_name VARCHAR(100),
    description TEXT,
    is_template BOOLEAN DEFAULT FALSE
);

-- Workout Templates
CREATE TABLE IF NOT EXISTS workout_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id),
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    data JSONB NOT NULL,
    trainer_id UUID,
    template_name VARCHAR(100),
    description TEXT,
    duration_minutes INT DEFAULT 45,
    exercises JSONB,
    is_template BOOLEAN DEFAULT FALSE
);

-- Subscriptions (Billing)
CREATE TABLE IF NOT EXISTS subscriptions (
    sub_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id),
    plan_name VARCHAR(50),
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    start_date DATE,
    next_billing_date DATE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Weight Check-ins (Photo Evidence)
CREATE TABLE IF NOT EXISTS weight_checkins (
    checkin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(member_id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    weight_extracted DECIMAL(5, 2),
    verified BOOLEAN DEFAULT FALSE
);

-- Trainer Schedule
CREATE TABLE IF NOT EXISTS trainer_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL,
    member_id UUID REFERENCES members(member_id) ON DELETE SET NULL,
    title VARCHAR(255) DEFAULT 'PT Session',
    type VARCHAR(20) DEFAULT 'session',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INT DEFAULT 60,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Referrals Ledger
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_gym_id UUID REFERENCES gyms(gym_id),
    referee_gym_id UUID REFERENCES gyms(gym_id),
    status VARCHAR(20) DEFAULT 'pending',
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Connections (Per Trainer/Gym)
CREATE TABLE IF NOT EXISTS whatsapp_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES auth.users(id),
    gym_id UUID REFERENCES gyms(gym_id),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    twilio_phone_sid VARCHAR(50),
    is_connected BOOLEAN DEFAULT FALSE,
    connected_at TIMESTAMP WITH TIME ZONE,
    sandbox_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Proxy Sessions (Trainer active conversation)
CREATE TABLE IF NOT EXISTS whatsapp_proxy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    active_member_id UUID REFERENCES members(member_id),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat History
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES members(member_id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'member', 'assistant', 'trainer'
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    trainer_id UUID REFERENCES auth.users(id)
);

-- Conversations (AI State Manager)
CREATE TABLE IF NOT EXISTS conversations (
    whatsapp_id VARCHAR(20) PRIMARY KEY,
    step VARCHAR(100) NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- STEP 2: APPLY OTHER COLUMN UPGRADES (IN CASE THE TABLES ALREADY EXISTED)
-- ============================================================

-- Gyms upgrades
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'basic';
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Kolkata';
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS currency VARCHAR(20) DEFAULT 'INR';
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100);
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'basic';
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE gyms ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(20);

-- Staff upgrades
ALTER TABLE staff ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS whatsapp_notification_number VARCHAR(20);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);
ALTER TABLE staff ADD COLUMN IF NOT EXISTS experience_years VARCHAR(10);

-- Members upgrades
ALTER TABLE members ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID REFERENCES staff(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS invite_code VARCHAR(20) UNIQUE;

-- Templates upgrades
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS trainer_id UUID;
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS template_name VARCHAR(100);
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 45;
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS exercises JSONB;
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

ALTER TABLE diet_templates ADD COLUMN IF NOT EXISTS trainer_id UUID;
ALTER TABLE diet_templates ADD COLUMN IF NOT EXISTS template_name VARCHAR(100);
ALTER TABLE diet_templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE diet_templates ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- Chat history upgrades
ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS trainer_id UUID REFERENCES auth.users(id);


-- ============================================================
-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS)
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
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_proxy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 4: CONFIGURE RLS SECURITY POLICIES
-- ============================================================

-- Clean up existing policies to avoid duplicates
DROP POLICY IF EXISTS "Gym owners can view own gym" ON gyms;
DROP POLICY IF EXISTS "Gym owners can update own gym" ON gyms;
DROP POLICY IF EXISTS "Authenticated users can create gyms" ON gyms;
DROP POLICY IF EXISTS "Gym owners can view gym members" ON members;
DROP POLICY IF EXISTS "Staff can view assigned members" ON members;
DROP POLICY IF EXISTS "Gym owners can manage gym members" ON members;
DROP POLICY IF EXISTS "Gym owners can manage staff" ON staff;
DROP POLICY IF EXISTS "Staff can view own profile" ON staff;
DROP POLICY IF EXISTS "Staff can update own profile" ON staff;
DROP POLICY IF EXISTS "Gym owners can manage leads" ON leads;
DROP POLICY IF EXISTS "Anyone can view public templates" ON diet_templates;
DROP POLICY IF EXISTS "Gym owners can manage own templates" ON diet_templates;
DROP POLICY IF EXISTS "Anyone can view public workout templates" ON workout_templates;
DROP POLICY IF EXISTS "Gym owners can manage own workout templates" ON workout_templates;
DROP POLICY IF EXISTS "Gym owners can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Staff can manage own schedule" ON trainer_schedule;
DROP POLICY IF EXISTS "Gym owners can view all schedules" ON trainer_schedule;
DROP POLICY IF EXISTS "Trainers can view member checkins" ON weight_checkins;
DROP POLICY IF EXISTS "Gyms view their own referrals" ON referrals;
DROP POLICY IF EXISTS "Trainers can view own connections" ON whatsapp_connections;
DROP POLICY IF EXISTS "Trainers can insert own connections" ON whatsapp_connections;
DROP POLICY IF EXISTS "Trainers can update own connections" ON whatsapp_connections;
DROP POLICY IF EXISTS "Trainers manage own proxy sessions" ON whatsapp_proxy_sessions;
DROP POLICY IF EXISTS "Trainers manage own conversations" ON conversations;

-- Create Policies

-- Gyms
CREATE POLICY "Gym owners can view own gym" ON gyms FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Gym owners can update own gym" ON gyms FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create gyms" ON gyms FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Members
CREATE POLICY "Gym owners can view gym members" ON members FOR SELECT USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);
CREATE POLICY "Staff can view assigned members" ON members FOR SELECT USING (
    assigned_trainer_id IN (SELECT id FROM staff WHERE auth_id = auth.uid())
);
CREATE POLICY "Gym owners can manage gym members" ON members FOR ALL USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);

-- Staff
CREATE POLICY "Gym owners can manage staff" ON staff FOR ALL USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);
CREATE POLICY "Staff can view own profile" ON staff FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Staff can update own profile" ON staff FOR UPDATE USING (auth_id = auth.uid());

-- Leads
CREATE POLICY "Gym owners can manage leads" ON leads FOR ALL USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);

-- Diet/Workout Templates
CREATE POLICY "Anyone can view public templates" ON diet_templates FOR SELECT USING (is_public = true);
CREATE POLICY "Gym owners can manage own templates" ON diet_templates FOR ALL USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);
CREATE POLICY "Anyone can view public workout templates" ON workout_templates FOR SELECT USING (true);
CREATE POLICY "Gym owners can manage own workout templates" ON workout_templates FOR ALL USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);

-- Subscriptions
CREATE POLICY "Gym owners can view own subscriptions" ON subscriptions FOR SELECT USING (
    gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);

-- Trainer Schedule
CREATE POLICY "Staff can manage own schedule" ON trainer_schedule FOR ALL USING (
    trainer_id IN (SELECT id FROM staff WHERE auth_id = auth.uid())
);
CREATE POLICY "Gym owners can view all schedules" ON trainer_schedule FOR SELECT USING (
    trainer_id IN (SELECT id FROM staff WHERE gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid()))
);

-- Weight Check-ins
CREATE POLICY "Trainers can view member checkins" ON weight_checkins FOR SELECT USING (true);

-- Referrals
CREATE POLICY "Gyms view their own referrals" ON referrals FOR SELECT USING (
    referrer_gym_id IN (SELECT gym_id FROM gyms WHERE owner_id = auth.uid())
);

-- WhatsApp Connections
CREATE POLICY "Trainers can view own connections" ON whatsapp_connections FOR SELECT USING (auth.uid() = trainer_id);
CREATE POLICY "Trainers can insert own connections" ON whatsapp_connections FOR INSERT WITH CHECK (auth.uid() = trainer_id);
CREATE POLICY "Trainers can update own connections" ON whatsapp_connections FOR UPDATE USING (auth.uid() = trainer_id);

-- WhatsApp Proxy Sessions
CREATE POLICY "Trainers manage own proxy sessions" ON whatsapp_proxy_sessions FOR ALL USING (auth.uid() = trainer_id);

-- Conversations
CREATE POLICY "Trainers manage own conversations" ON conversations FOR ALL USING (true);


-- ============================================================
-- STEP 5: INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_gyms_owner_id ON gyms(owner_id);
CREATE INDEX IF NOT EXISTS idx_members_assigned_trainer ON members(assigned_trainer_id);
CREATE INDEX IF NOT EXISTS idx_staff_auth_id ON staff(auth_id);
CREATE INDEX IF NOT EXISTS idx_trainer_schedule_trainer ON trainer_schedule(trainer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_phone ON whatsapp_connections(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_trainer ON whatsapp_connections(trainer_id);
