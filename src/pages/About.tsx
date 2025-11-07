import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Youtube } from "lucide-react";

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
            Helping Small Businesses
            <span className="block text-primary">Thrive with AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Making enterprise-grade AI accessible to small businesses
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              At agent13 ai, we believe artificial intelligence should empower every small business, 
              not just large corporations. We're dedicated to making cutting-edge AI technology accessible, 
              affordable, and practical for businesses of all sizes. Our goal is to help you work smarter, 
              compete better, and grow faster.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We help small businesses harness the power of AI to automate tasks, gain insights, and 
              create content. From process automation to customer analytics, from content generation 
              to predictive insights - we provide practical AI solutions that drive real results.
            </p>
            <p className="text-lg text-muted-foreground">
              Our approach is hands-on and results-focused. We don't just talk about AI - we show you 
              how to implement it effectively in your daily operations.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We combine technical expertise with business acumen. Every recommendation we make is based 
              on proven strategies and real-world results. We focus on ROI-driven solutions that deliver 
              measurable improvements in productivity and profitability.
            </p>
            <p className="text-lg text-muted-foreground">
              Our commitment is to your success. We provide ongoing education, practical tutorials, and 
              strategic guidance to ensure you get maximum value from AI technology.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Subscribe to our YouTube channel for weekly AI insights, business strategies, and practical 
              tutorials. Learn how other small businesses are leveraging AI to grow and stay ahead of the 
              latest AI trends and innovations.
            </p>
            <a 
              href="https://youtube.com/@agent13ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline text-lg"
            >
              <Youtube className="w-6 h-6" />
              Subscribe to agent13 ai on YouTube
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
