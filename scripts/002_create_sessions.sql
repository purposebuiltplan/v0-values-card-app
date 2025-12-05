-- Create the sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  user_name TEXT,
  user_email TEXT,
  newsletter_opt_in BOOLEAN DEFAULT false,
  share_slug TEXT UNIQUE
);

-- Enable RLS with public access for this anonymous exercise
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can create a session
CREATE POLICY "sessions_public_insert" ON sessions
  FOR INSERT WITH CHECK (true);

-- Anyone can read sessions (needed for share_slug lookups)
CREATE POLICY "sessions_public_read" ON sessions
  FOR SELECT USING (true);

-- Anyone can update sessions (for anonymous exercise flow)
CREATE POLICY "sessions_public_update" ON sessions
  FOR UPDATE USING (true);

-- Create index on share_slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_share_slug ON sessions(share_slug);
