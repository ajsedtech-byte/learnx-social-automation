-- ═══════════════════════════════════════════════════════
-- LearnX Social Media Automation — Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Posts table: stores all 365 days of content
CREATE TABLE IF NOT EXISTS posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series          TEXT NOT NULL,
  title           TEXT NOT NULL,
  content         JSONB NOT NULL DEFAULT '{}',
  media_urls      TEXT[] DEFAULT '{}',
  hashtags        TEXT[] DEFAULT '{}',
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME NOT NULL DEFAULT '10:00',
  platforms       TEXT[] NOT NULL DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('draft', 'scheduled', 'publishing', 'posted', 'failed')),
  platform_post_ids JSONB DEFAULT '{}',
  error_log       JSONB,
  retry_count     INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast cron queries
CREATE INDEX IF NOT EXISTS idx_posts_schedule
  ON posts (scheduled_date, scheduled_time)
  WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_series ON posts (series);

-- Platform credentials: OAuth tokens for each platform
CREATE TABLE IF NOT EXISTS platform_credentials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        TEXT UNIQUE NOT NULL,
  access_token    TEXT,
  refresh_token   TEXT,
  token_expires   TIMESTAMPTZ,
  extra_config    JSONB DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'disconnected'
                  CHECK (status IN ('connected', 'disconnected', 'expired')),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed all 10 platforms as disconnected
INSERT INTO platform_credentials (platform, status) VALUES
  ('instagram', 'disconnected'),
  ('facebook', 'disconnected'),
  ('twitter', 'disconnected'),
  ('linkedin', 'disconnected'),
  ('threads', 'disconnected'),
  ('telegram', 'disconnected'),
  ('youtube', 'disconnected'),
  ('pinterest', 'disconnected'),
  ('whatsapp', 'disconnected'),
  ('reddit', 'disconnected')
ON CONFLICT (platform) DO NOTHING;

-- Publish log: track every publish attempt
CREATE TABLE IF NOT EXISTS publish_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id         UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  platform_post_id TEXT,
  error_message   TEXT,
  published_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publish_log_post ON publish_log (post_id);
CREATE INDEX IF NOT EXISTS idx_publish_log_date ON publish_log (published_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER platform_credentials_updated_at
  BEFORE UPDATE ON platform_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS (Row Level Security) but allow service role full access
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_log ENABLE ROW LEVEL SECURITY;

-- Policies: allow everything for service role (cron + admin)
CREATE POLICY "Service role full access on posts"
  ON posts FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on platform_credentials"
  ON platform_credentials FOR ALL
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on publish_log"
  ON publish_log FOR ALL
  USING (true) WITH CHECK (true);

-- Storage bucket for generated images
-- (Create via Supabase Dashboard > Storage > New Bucket: "social-media")
-- Make it public for CDN delivery
