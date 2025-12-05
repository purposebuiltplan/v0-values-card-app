-- Create the session_values table
CREATE TABLE IF NOT EXISTS session_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  value_id UUID REFERENCES values_master(id) ON DELETE SET NULL,
  custom_label TEXT,
  custom_description TEXT,
  importance_level TEXT DEFAULT 'unsorted' CHECK (importance_level IN ('unsorted', 'low', 'medium', 'high')),
  is_core BOOLEAN DEFAULT false,
  edited_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS with public access
ALTER TABLE session_values ENABLE ROW LEVEL SECURITY;

-- Anyone can insert session values
CREATE POLICY "session_values_public_insert" ON session_values
  FOR INSERT WITH CHECK (true);

-- Anyone can read session values
CREATE POLICY "session_values_public_read" ON session_values
  FOR SELECT USING (true);

-- Anyone can update session values
CREATE POLICY "session_values_public_update" ON session_values
  FOR UPDATE USING (true);

-- Anyone can delete session values
CREATE POLICY "session_values_public_delete" ON session_values
  FOR DELETE USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_session_values_session_id ON session_values(session_id);
CREATE INDEX IF NOT EXISTS idx_session_values_importance ON session_values(session_id, importance_level);
