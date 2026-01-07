-- WhatsApp Integration Tables (Phase 13)
-- Run this migration to enable multi-tenant WhatsApp routing

-- 1. WhatsApp Connections (Per Trainer/Gym)
CREATE TABLE IF NOT EXISTS whatsapp_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES auth.users(id),
    gym_id UUID REFERENCES gyms(gym_id),
    phone_number VARCHAR(20) NOT NULL,
    twilio_phone_sid VARCHAR(50), -- Twilio's Phone Number SID
    is_connected BOOLEAN DEFAULT FALSE,
    connected_at TIMESTAMP WITH TIME ZONE,
    sandbox_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(phone_number)
);

-- 2. Chat History Enhancement (Link to Trainer)
-- Add trainer_id column to existing chat_history if not exists
ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS trainer_id UUID REFERENCES auth.users(id);

-- 3. Index for fast lookup by phone number
CREATE INDEX IF NOT EXISTS idx_whatsapp_phone ON whatsapp_connections(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_trainer ON whatsapp_connections(trainer_id);

-- 4. RLS Policies for Security
ALTER TABLE whatsapp_connections ENABLE ROW LEVEL SECURITY;

-- Trainers can only see their own connections
CREATE POLICY "Trainers can view own connections" ON whatsapp_connections
    FOR SELECT USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can insert own connections" ON whatsapp_connections
    FOR INSERT WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update own connections" ON whatsapp_connections
    FOR UPDATE USING (auth.uid() = trainer_id);
