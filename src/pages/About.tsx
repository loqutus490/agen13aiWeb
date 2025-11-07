import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            About Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Building the Future of
            <span className="block text-primary">E-Commerce Tools</span>
          </h1>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground">
                At agent13 ai, we're on a mission to empower e-commerce sellers with cutting-edge AI tools 
                that save time, increase efficiency, and drive sales. We believe that powerful technology 
                should be accessible to everyone, not just large corporations.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">What We Do</h2>
              <p className="text-lg text-muted-foreground mb-4">
                We develop AI-powered solutions specifically designed for online sellers. Our flagship product, 
                <strong className="text-foreground"> ProdScript AI</strong>, helps sellers generate compelling product descriptions 
                in seconds, eliminating one of the most time-consuming aspects of e-commerce.
              </p>
              <p className="text-lg text-muted-foreground">
                But we're just getting started. We're constantly researching and developing new AI tools 
                to solve the real-world challenges faced by modern e-commerce businesses.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
              <p className="text-lg text-muted-foreground mb-4">
                We believe in transparency, simplicity, and results. That's why we:
              </p>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li>• Offer straightforward pricing with no hidden fees</li>
                <li>• Provide free trials so you can test before committing</li>
                <li>• Focus on solving real problems, not adding unnecessary features</li>
                <li>• Share our knowledge through our YouTube channel and blog</li>
                <li>• Listen to our users and continuously improve based on feedback</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-muted-foreground">
                We're building more than just tools—we're building a community of forward-thinking sellers 
                who embrace AI to grow their businesses. Follow our YouTube channel for AI news, product 
                tutorials, and e-commerce insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
