import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, User, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  date: string;
  category: string;
  author: string | null;
  tags: string[];
  image_url: string | null;
}

const isMarkdown = (content: string): boolean => {
  // Detect markdown patterns: headings, bold, lists, links, code blocks
  return /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|\*\*.*\*\*|```|\[.*\]\(.*\)/m.test(content);
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await (supabase
        .from('blog_posts_public' as any) as any)
        .select('*')
        .eq('slug', postSlug)
        .single();
      
      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-4 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const contentIsMarkdown = isMarkdown(post.content);

  return (
    <div className="min-h-screen">
      <SEO title={post.title} description={post.content.replace(/<[^>]*>/g, '').replace(/[#*_`]/g, '').slice(0, 155)} type="article" />
      <Navbar />
      
      <article className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/blog")}
            className="mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>

          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            {post.category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>

          {post.image_url && (
            <div className="mb-8">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[500px]"
              />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 pb-8 border-b">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} to="/blog" state={{ selectedTag: tag }}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {contentIsMarkdown ? (
            <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-li:leading-relaxed prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:mb-4 prose-li:leading-relaxed prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline" 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'hr', 'span', 'div'],
                  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
                  ALLOW_DATA_ATTR: false,
                })
              }} 
            />
          )}

          {/* Contextual CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Is Your Firm Ready for AI?</h3>
                <p className="text-muted-foreground">
                  Download our free AI Readiness Assessment — a 10-page guide with a 20-point scoring rubric, security checklist, and implementation worksheets built specifically for law firms.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/ai-readiness-guide")}
                className="shrink-0"
                size="lg"
              >
                Get the Free Guide
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <Button onClick={() => navigate("/blog")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Posts
            </Button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
