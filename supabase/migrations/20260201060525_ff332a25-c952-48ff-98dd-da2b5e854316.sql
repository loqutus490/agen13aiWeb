-- Fix security: Explicitly deny public SELECT access to download_leads
-- The current RLS only allows admin SELECT, but we should be explicit
CREATE POLICY "Deny public select on leads" 
ON public.download_leads 
FOR SELECT 
USING (false);

-- Add featured image support to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS image_url TEXT;