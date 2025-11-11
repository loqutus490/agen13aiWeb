-- Add tags column to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN tags TEXT[] DEFAULT '{}';

-- Create an index for better tag filtering performance
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Add a comment to document the column
COMMENT ON COLUMN public.blog_posts.tags IS 'Array of tags for categorizing and filtering blog posts';