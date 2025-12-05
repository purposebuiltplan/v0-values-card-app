-- Create the values_master table with all 60 default values
CREATE TABLE IF NOT EXISTS values_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS but allow public read access
ALTER TABLE values_master ENABLE ROW LEVEL SECURITY;

-- Anyone can read the default values
CREATE POLICY "values_master_public_read" ON values_master
  FOR SELECT USING (true);

-- Insert all 60 default values
INSERT INTO values_master (label, description) VALUES
  ('Accountability', 'Inviting others to help you grow, stay honest, and follow through.'),
  ('Adaptability', 'Adjusting with grace and flexibility when life changes.'),
  ('Adventure', 'Embracing new experiences, risks, and stories to tell later.'),
  ('Authenticity', 'Showing up as your real, unpolished, whole self.'),
  ('Balance', 'Holding work, family, health, and rest in healthy tension.'),
  ('Beauty', 'Appreciating and creating things that are meaningful and lovely.'),
  ('Calm', 'Seeking stillness, clarity, and a non-anxious presence.'),
  ('Community', 'Belonging to a group that supports, encourages, and sharpens you.'),
  ('Compassion', 'Caring deeply about the hurts and needs of others.'),
  ('Connection', 'Building meaningful, life-giving relationships with others.'),
  ('Contentment', 'Being grateful and at peace with what you have in this season.'),
  ('Contribution', 'Adding something positive and meaningful to the world.'),
  ('Courage', 'Doing the hard or scary thing because it''s the right thing.'),
  ('Creativity', 'Imagining new ideas and bringing them to life.'),
  ('Discipleship', 'Intentionally growing with and investing in others spiritually.'),
  ('Discipline', 'Choosing consistent habits that shape who you become.'),
  ('Empathy', 'Stepping into someone else''s shoes and feeling with them.'),
  ('Excellence', 'Doing things with care, intention, and high standards.'),
  ('Excitement', 'Enjoying energy, momentum, and thrilling moments.'),
  ('Faith', 'Trusting and following God in every area of life.'),
  ('Faithfulness', 'Showing up, staying committed, and keeping your word.'),
  ('Family', 'Prioritizing deep, healthy connection with loved ones.'),
  ('Fame', 'Desiring recognition, visibility, or a public platform.'),
  ('Fitness', 'Valuing strength, movement, and physical capability.'),
  ('Forgiveness', 'Letting go of resentment and choosing grace.'),
  ('Freedom', 'Having room to choose your path and how you live.'),
  ('Fun', 'Making space for enjoyment, laughter, and play.'),
  ('Generosity', 'Living open-handed with your time, money, and attention.'),
  ('Gratitude', 'Noticing the good and giving thanks often.'),
  ('Growth', 'Becoming a better, more mature version of yourself over time.'),
  ('Health', 'Caring for your physical, emotional, and spiritual well-being.'),
  ('Honor', 'Treating people with dignity, respect, and value.'),
  ('Hope', 'Believing good things are possible, even when life feels hard.'),
  ('Humility', 'Staying grounded, teachable, and others-focused.'),
  ('Impact', 'Leaving people, places, and work better than you found them.'),
  ('Independence', 'Valuing autonomy and freedom to choose your own way.'),
  ('Influence', 'Shaping people, decisions, or culture for the better.'),
  ('Integrity', 'Aligning your actions with your convictions and values.'),
  ('Justice', 'Pursuing what is fair, right, and honoring to others.'),
  ('Joy', 'Carrying a posture of delight, celebration, and inner gladness.'),
  ('Leadership', 'Taking responsibility to guide, serve, and influence others.'),
  ('Learning', 'Staying curious and always growing your mind and skills.'),
  ('Legacy', 'Living so that your impact and story outlast you.'),
  ('Loyalty', 'Sticking with people, causes, and commitments over time.'),
  ('Love', 'Choosing sacrificial, relational, life-giving care for others.'),
  ('Margin', 'Protecting extra space in your time, energy, and finances.'),
  ('Patience', 'Giving time, space, and grace to yourself and others.'),
  ('Peace', 'Cultivating calm, trust, and inner rest in all circumstances.'),
  ('Purpose', 'Living with clarity about why you''re here and what matters most.'),
  ('Relationships', 'Making close, mutual, and supportive connections a priority.'),
  ('Reputation', 'Caring about the character and trust others associate with you.'),
  ('Rest', 'Valuing recovery, Sabbath, and being unhurried.'),
  ('Responsibility', 'Owning your actions, choices, and commitments.'),
  ('Security', 'Seeking stability—financial, emotional, and relational.'),
  ('Service', 'Using your life and resources to help and bless others.'),
  ('Simplicity', 'Removing clutter and focusing on what truly matters.'),
  ('Stewardship', 'Managing God''s resources wisely and intentionally.'),
  ('Strength', 'Valuing resilience, grit, and the ability to endure.'),
  ('Trust', 'Relying on others and being reliable yourself.'),
  ('Wisdom', 'Seeking God''s perspective and making sound, thoughtful choices.');
