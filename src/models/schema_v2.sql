-- DailyFit V2 Schema Upgrade
-- Run this to enable Gym SaaS features, Templates, and Lead Management

-- 1. Gyms (Tenants)
CREATE TABLE IF NOT EXISTS gyms (
    gym_id UUID PRIMARY KEY,
    owner_name VARCHAR(100) NOT NULL,
    gym_name VARCHAR(100) NOT NULL,
    whatsapp_business_id VARCHAR(50), 
    subscription_status VARCHAR(20) DEFAULT 'trial', -- active, inactive, trial
    subscription_plan VARCHAR(20) DEFAULT 'basic', -- basic, pro, enterprise
    trainers_allowed INT DEFAULT 3,
    members_limit INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. New Lead Enquiries (Sales Pipeline)
CREATE TABLE IF NOT EXISTS leads (
    lead_id UUID PRIMARY KEY,
    gym_id UUID REFERENCES gyms(gym_id),
    whatsapp_id VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'new', -- new, contacted, converted, lost
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Diet Templates (Global & Gym Specific)
CREATE TABLE IF NOT EXISTS diet_templates (
    template_id UUID PRIMARY KEY,
    gym_id UUID REFERENCES gyms(gym_id), -- NULL means "System Standard" (Available to all)
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- veg, non-veg, vegan, keto
    region VARCHAR(50), -- North Indian, South Indian, etc.
    calories INT,
    data JSONB NOT NULL, -- Stores the full Meal[] array structure
    is_public BOOLEAN DEFAULT FALSE
);

-- 4. Workout Templates
CREATE TABLE IF NOT EXISTS workout_templates (
    template_id UUID PRIMARY KEY,
    gym_id UUID REFERENCES gyms(gym_id),
    name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'intermediate',
    data JSONB NOT NULL -- Stores Exercise[] array
);

-- 5. Subscriptions (Billing)
CREATE TABLE IF NOT EXISTS subscriptions (
    sub_id UUID PRIMARY KEY,
    gym_id UUID REFERENCES gyms(gym_id),
    plan_name VARCHAR(50), -- 'Pro Monthly'
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    start_date DATE,
    next_billing_date DATE,
    status VARCHAR(20) DEFAULT 'active'
);

-- 6. Weight Check-ins (Photo Evidence)
CREATE TABLE IF NOT EXISTS weight_checkins (
    checkin_id UUID PRIMARY KEY,
    member_id UUID, -- Assumes 'members' table exists from V1
    date DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    weight_extracted DECIMAL(5, 2),
    verified BOOLEAN DEFAULT FALSE
);
