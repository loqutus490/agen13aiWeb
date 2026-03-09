-- Add content ingestion and review workflow columns to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS primary_keyword text,
  ADD COLUMN IF NOT EXISTS secondary_keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS faq_json jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS schema_json jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS internal_link_suggestions text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_links_json jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS image_options_json jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS post_type text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS created_by_system boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_publish_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS newsletter_status text DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS newsletter_subject_options text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS newsletter_preview_text text,
  ADD COLUMN IF NOT EXISTS newsletter_body text,
  ADD COLUMN IF NOT EXISTS generation_run_id text;

-- Create content_generation_runs table
CREATE TABLE IF NOT EXISTS public.content_generation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mode text NOT NULL DEFAULT 'deep-dive',
  trigger_type text NOT NULL DEFAULT 'manual',
  status text NOT NULL DEFAULT 'running',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  selected_topic text,
  selected_keyword text,
  source_count integer DEFAULT 0,
  output_post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  newsletter_generated boolean DEFAULT false,
  error_message text,
  logs_json jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on content_generation_runs
ALTER TABLE public.content_generation_runs ENABLE ROW LEVEL SECURITY;

-- Only admins can view generation runs
CREATE POLICY "Admins can view generation runs"
  ON public.content_generation_runs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert generation runs (for admin-triggered runs)
CREATE POLICY "Admins can insert generation runs"
  ON public.content_generation_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create index for date-based lookups on blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_date_status ON public.blog_posts(date, status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_by_system ON public.blog_posts(created_by_system);
CREATE INDEX IF NOT EXISTS idx_content_generation_runs_status ON public.content_generation_runs(status, started_at);