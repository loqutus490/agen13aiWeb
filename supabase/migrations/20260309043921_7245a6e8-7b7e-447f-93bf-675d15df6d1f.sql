
-- Create a public-facing view with only safe columns
CREATE OR REPLACE VIEW public.blog_posts_public AS
SELECT 
  id, slug, title, excerpt, content, category, author, tags, 
  image_url, date, published_at, seo_title, meta_description,
  primary_keyword, secondary_keywords, faq_json, schema_json,
  created_at, post_type
FROM public.blog_posts
WHERE published = true;

-- Grant access to the view for anon and authenticated roles
GRANT SELECT ON public.blog_posts_public TO anon;
GRANT SELECT ON public.blog_posts_public TO authenticated;
