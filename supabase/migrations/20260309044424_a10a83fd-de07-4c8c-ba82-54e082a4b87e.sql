
-- Remove the public SELECT policy from blog_posts since public access now goes through blog_posts_public view
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
