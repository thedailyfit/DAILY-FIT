-- Phase 15: Trainer Referral System

-- 1. Add Referral Columns to Gyms (Trainers)
ALTER TABLE gyms 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by_code VARCHAR(20);

-- 2. Create Referrals Ledger Table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_gym_id UUID REFERENCES gyms(gym_id),
    referee_gym_id UUID REFERENCES gyms(gym_id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, active, completed
    commission_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Function to Generate 5-Digit Code
-- Usage: UPDATE gyms SET referral_code = 'TR-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 5)) WHERE referral_code IS NULL;
-- (Application logic will likely handle this for cleaner codes, but good to have)

-- 4. RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gyms view their own referrals" ON referrals
    USING (auth.uid() = referrer_gym_id);
