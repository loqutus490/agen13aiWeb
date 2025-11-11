import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { getBlogPostBySlug } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) {
      navigate("/blog");
    }
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  // Simple markdown-like content parsing
  const formatContent = (content: string) => {
    const lines = content.trim().split('\n');
    return lines.map((line, index) => {
      // Headings
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-4xl font-bold mb-6 mt-8">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-3xl font-bold mb-4 mt-8">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-2xl font-bold mb-3 mt-6">{line.substring(4)}</h3>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2 list-disc">{line.substring(2)}</li>;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      
      // Regular paragraphs
      return <p key={index} className="text-lg text-muted-foreground mb-4 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen">
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

          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
          </div>

          <div className="mt-12 pt-8 border-t">
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
