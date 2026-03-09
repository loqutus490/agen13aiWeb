
-- Fix the security definer view by explicitly setting SECURITY INVOKER
ALTER VIEW public.blog_posts_public SET (security_invoker = on);
