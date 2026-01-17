-- Phase 16: Pro Plan Database Migration

-- 1. Create 'staff' table
-- This table stores Gym Trainers/Admins who are UNDER the main Gym Owner
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(gym_id) NOT NULL, -- The Parent Gym (Owner)
    auth_id UUID REFERENCES auth.users(id), -- Optimally link to their Auth Login
    role VARCHAR(20) DEFAULT 'trainer', -- 'trainer', 'admin'
    name VARCHAR(100),
    email VARCHAR(100),
    whatsapp_notification_number VARCHAR(20), -- For Bridge Alerts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(auth_id) -- One auth user = one staff record ideally
);

-- 2. Update 'members' table
-- Add column to assign a member to a specific staff/trainer
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS assigned_trainer_id UUID REFERENCES staff(id);

-- 3. Update 'gyms' table
-- Track if this is a Basic or Pro plan gym
ALTER TABLE gyms 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'basic'; -- 'basic', 'pro'

-- 4. RLS Policies
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Owner can manage their own staff
CREATE POLICY "Owners manage their staff" ON staff
    USING (auth.uid() = gym_id)
    WITH CHECK (auth.uid() = gym_id);

-- Trainers can view their own record
CREATE POLICY "Trainers view self" ON staff
    USING (auth.uid() = auth_id);

-- 5. Member RLS Updates (Crucial for Privacy)
-- Existing Policy: "Trainers view own members" (auth.uid() = gym_id) needs update.
-- New Logic:
-- IF you are the Owner (auth.uid() = members.gym_id) -> See All.
-- IF you are a Staff (auth.uid() -> staff.auth_id AND staff.id = members.assigned_trainer_id) -> See Assigned.

-- We often need a "helper function" or complex policy for this. 
-- For now, we will rely on Application Logic filtering in the dashboard 
-- while keeping the RLS broad enough for the implementation phase.
-- (Refinement of strict RLS comes in Phase 16-2)
