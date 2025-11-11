-- Create function to update timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  author TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published blog posts are viewable by everyone"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all blog posts"
ON public.blog_posts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, content, date, category, author, published) VALUES
('ai-revolutionizing-ecommerce', 'How AI is Revolutionizing E-commerce Product Descriptions', 'Discover how AI-powered tools are transforming the way online businesses create compelling product descriptions that convert browsers into buyers.', '<h1>How AI is Revolutionizing E-commerce Product Descriptions</h1><p>The e-commerce landscape is evolving rapidly, and artificial intelligence is at the forefront of this transformation.</p><h2>The Challenge of Traditional Product Descriptions</h2><p>Writing compelling product descriptions has always been time-consuming and challenging for e-commerce businesses.</p><h2>How AI Changes the Game</h2><p>AI-powered tools like ProdScript.ai are revolutionizing this process by enabling speed, consistency, optimization, and personalization at scale.</p>', '2025-01-15', 'AI Insights', 'agent13 ai Team', true),
('automate-business-with-ai', '5 Ways to Automate Your Business with AI', 'Learn practical strategies to implement AI automation in your business operations, from customer service to inventory management.', '<h1>5 Ways to Automate Your Business with AI</h1><p>Automation is no longer just for large enterprises. Small and medium-sized businesses can now leverage AI to streamline operations and focus on growth.</p><h2>1. Customer Service Automation</h2><p>Implement AI-powered chatbots to handle common customer inquiries 24/7.</p><h2>2. Content Creation</h2><p>Use AI to generate product descriptions, social media posts, and email campaigns.</p>', '2025-01-10', 'Business Tips', 'agent13 ai Team', true),
('future-of-ai-small-business', 'The Future of AI in Small Business', 'Explore upcoming AI trends and technologies that will shape how small businesses operate and compete in the digital marketplace.', '<h1>The Future of AI in Small Business</h1><p>The AI revolution is just beginning, and small businesses that embrace these technologies now will have a significant competitive advantage.</p><h2>Emerging Trends</h2><p>Hyper-personalization, voice search, predictive analytics, and autonomous operations are reshaping business landscapes.</p>', '2025-01-05', 'Future Tech', 'agent13 ai Team', true);