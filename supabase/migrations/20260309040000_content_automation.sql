-- Content automation schema extensions
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS primary_keyword TEXT,
  ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS faq_json JSONB,
  ADD COLUMN IF NOT EXISTS schema_json JSONB,
  ADD COLUMN IF NOT EXISTS internal_link_suggestions JSONB,
  ADD COLUMN IF NOT EXISTS image_options_json JSONB,
  ADD COLUMN IF NOT EXISTS source_links_json JSONB,
  ADD COLUMN IF NOT EXISTS post_type TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS created_by_system BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS newsletter_status TEXT DEFAULT 'draft_generated',
  ADD COLUMN IF NOT EXISTS newsletter_subject_options TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS newsletter_preview_text TEXT,
  ADD COLUMN IF NOT EXISTS newsletter_body TEXT,
  ADD COLUMN IF NOT EXISTS generation_run_id UUID;

CREATE TABLE IF NOT EXISTS public.content_generation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  selected_topic TEXT,
  selected_keyword TEXT,
  mode TEXT NOT NULL DEFAULT 'deep-dive',
  source_count INT NOT NULL DEFAULT 0,
  output_post_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  newsletter_generated BOOLEAN NOT NULL DEFAULT false,
  trigger_type TEXT NOT NULL DEFAULT 'manual',
  error_message TEXT,
  logs_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_generation_runs_started_at ON public.content_generation_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_generation_runs_status ON public.content_generation_runs(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_by_system ON public.blog_posts(created_by_system);
CREATE INDEX IF NOT EXISTS idx_blog_posts_generation_run_id ON public.blog_posts(generation_run_id);

ALTER TABLE public.content_generation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view generation runs" ON public.content_generation_runs;
DROP POLICY IF EXISTS "Service role can manage generation runs" ON public.content_generation_runs;

CREATE POLICY "Admins can view generation runs"
ON public.content_generation_runs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage generation runs"
ON public.content_generation_runs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_status_check,
  DROP CONSTRAINT IF EXISTS blog_posts_newsletter_status_check;

ALTER TABLE public.blog_posts
  ADD CONSTRAINT blog_posts_status_check CHECK (
    status IN ('draft_generated','pending_review','approved','published','failed')
  ),
  ADD CONSTRAINT blog_posts_newsletter_status_check CHECK (
    newsletter_status IN ('draft_generated','newsletter_draft_ready','newsletter_approved','newsletter_sent','failed')
  );

CREATE UNIQUE INDEX IF NOT EXISTS uniq_blog_posts_system_topic_per_day
ON public.blog_posts (date, lower(title))
WHERE created_by_system = true;

CREATE OR REPLACE FUNCTION public.update_content_generation_runs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_content_generation_runs_updated_at ON public.content_generation_runs;
CREATE TRIGGER update_content_generation_runs_updated_at
BEFORE UPDATE ON public.content_generation_runs
FOR EACH ROW
EXECUTE FUNCTION public.update_content_generation_runs_updated_at();
