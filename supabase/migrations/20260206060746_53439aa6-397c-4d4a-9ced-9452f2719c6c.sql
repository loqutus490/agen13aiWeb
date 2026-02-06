-- Fix blog_posts SELECT policies: change from RESTRICTIVE to PERMISSIVE
-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;

-- Create new PERMISSIVE SELECT policies (default is PERMISSIVE, uses OR logic)
CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published blog posts are viewable by everyone"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (published = true);

-- Fix user_roles SELECT policies: change from RESTRICTIVE to PERMISSIVE
-- Drop existing restrictive SELECT policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create new PERMISSIVE SELECT policies
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);