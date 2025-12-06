-- Add adherence_score to client_progress_entries
ALTER TABLE client_progress_entries 
ADD COLUMN IF NOT EXISTS adherence_score integer CHECK (adherence_score >= 1 AND adherence_score <= 10);

COMMENT ON COLUMN client_progress_entries.adherence_score IS 'Self-reported adherence score from 1-10';
