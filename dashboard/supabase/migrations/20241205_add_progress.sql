-- Create client_progress_entries table
CREATE TABLE IF NOT EXISTS client_progress_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric(5,2),
  body_fat_percentage numeric(4,1),
  notes text,
  photos text[] DEFAULT '{}', -- Array of URLs
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_client_progress_client_id ON client_progress_entries (client_id);
CREATE INDEX IF NOT EXISTS idx_client_progress_date ON client_progress_entries (date);

-- RLS Policies
ALTER TABLE client_progress_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers SELECT own client progress" ON client_progress_entries FOR SELECT USING (trainer_id = auth.uid());
CREATE POLICY "Trainers INSERT own client progress" ON client_progress_entries FOR INSERT WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers UPDATE own client progress" ON client_progress_entries FOR UPDATE USING (trainer_id = auth.uid()) WITH CHECK (trainer_id = auth.uid());
CREATE POLICY "Trainers DELETE own client progress" ON client_progress_entries FOR DELETE USING (trainer_id = auth.uid());
