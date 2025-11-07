import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Youtube } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Youtube className="w-4 h-4 mr-1 inline" />
            Blog & Videos
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            AI News & Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest AI developments, product updates, and e-commerce tips from agent13 ai.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-muted/30 rounded-lg p-12 scan-line-effect holographic-border">
            <Youtube className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground mb-6">
              We're preparing exciting content about AI innovations, product tutorials, and e-commerce strategies.
            </p>
            <a 
              href="https://youtube.com/@agent13ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Youtube className="w-5 h-5" />
              Subscribe to our YouTube channel
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
