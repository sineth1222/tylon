CREATE TABLE motivational_speeches (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  excerpt    TEXT NOT NULL,
  body       TEXT NOT NULL,
  image_url  TEXT,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE speech_likes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  speech_id  UUID REFERENCES motivational_speeches(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(speech_id, user_email)
);

ALTER TABLE motivational_speeches ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read speeches" ON motivational_speeches FOR SELECT USING (is_active = true);
CREATE POLICY "service full access speeches" ON motivational_speeches FOR ALL USING (true);
CREATE POLICY "public read likes" ON speech_likes FOR SELECT USING (true);
CREATE POLICY "anyone can like" ON speech_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "service full access likes" ON speech_likes FOR ALL USING (true);