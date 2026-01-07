-- Phase 14: WhatsApp Bridge Mode Migration

-- 1. Proxy Sessions Table
-- Tracks which client the trainer is currently "talking to" via the bot
CREATE TABLE IF NOT EXISTS whatsapp_proxy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES auth.users(id) NOT NULL,
    active_member_id UUID REFERENCES members(member_id),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trainer_id)
);

-- 2. Add Unique Invite Code to Members
-- e.g. 'DF-9281' for unique client identification
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS invite_code VARCHAR(20) UNIQUE;

-- 3. RLS Policies
ALTER TABLE whatsapp_proxy_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own proxy sessions" ON whatsapp_proxy_sessions
    USING (auth.uid() = trainer_id)
    WITH CHECK (auth.uid() = trainer_id);

-- 4. Function to generate unique Invite Codes (Optional, but good for DB level)
-- We will handle generation in application logic for simplicity first, 
-- but ensuring uniqueness in DB is key.
