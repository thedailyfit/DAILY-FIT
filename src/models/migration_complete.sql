-- ============================================================
-- DailyFit Complete Migration
-- Run this in Supabase SQL Editor to fix all schema issues
-- ============================================================

-- 1. Add owner_id to gyms (CRITICAL - all gym queries depend on this)
ALTER TABLE gyms
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- 2. Add subscription/trial fields
ALTER TABLE gyms
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Add settings fields to gyms
ALTER TABLE gyms
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
ADD COLUMN IF NOT EXISTS currency VARCHAR(20) DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS billing_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100);

-- 4. Add monthly_fee to members (used in analytics revenue calc)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS monthly_fee DECIMAL(10, 2) DEFAULT 0;

-- 5. Add assigned_trainer_id to members (for Pro Plan trainer assignment)
ALTER TABLE members
ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID;

-- 6. Add trainer profile fields to staff
ALTER TABLE staff
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS whatsapp_notification_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
ADD COLUMN IF NOT EXISTS experience_years VARCHAR(10);

-- 7. Add template fields to workout_templates
ALTER TABLE workout_templates
ADD COLUMN IF NOT EXISTS trainer_id UUID,
ADD COLUMN IF NOT EXISTS template_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS duration_minutes INT DEFAULT 45,
ADD COLUMN IF NOT EXISTS exercises JSONB,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- 8. Add template fields to diet_templates
ALTER TABLE diet_templates
ADD COLUMN IF NOT EXISTS trainer_id UUID,
ADD COLUMN IF NOT EXISTS template_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- 9. Create trainer_schedule table (for the schedule page)
CREATE TABLE IF NOT EXISTS trainer_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID NOT NULL,
    member_id UUID,
    title VARCHAR(255) DEFAULT 'PT Session',
    type VARCHAR(20) DEFAULT 'session',
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INT DEFAULT 60,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Set initial trial period for existing gyms
UPDATE gyms
SET trial_ends_at = created_at + INTERVAL '30 days'
WHERE trial_ends_at IS NULL;

-- 11. Create index on owner_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_gyms_owner_id ON gyms(owner_id);
CREATE INDEX IF NOT EXISTS idx_members_assigned_trainer ON members(assigned_trainer_id);
CREATE INDEX IF NOT EXISTS idx_staff_auth_id ON staff(auth_id);
CREATE INDEX IF NOT EXISTS idx_trainer_schedule_trainer ON trainer_schedule(trainer_id);

-- ============================================================
-- IMPORTANT: After running this, update owner_id for existing gyms:
--
-- UPDATE gyms SET owner_id = '<your-auth-user-uuid>'
-- WHERE gym_name = 'YourGymName';
-- ============================================================
