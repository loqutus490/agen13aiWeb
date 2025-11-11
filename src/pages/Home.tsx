import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, Zap, Target, TrendingUp, 
  CheckCircle, Youtube, RefreshCw, Cpu, BrainCircuit, Workflow
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl glow-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm text-sm">
            <Cpu className="w-4 h-4 mr-1 inline animate-pulse" />
            AI Business Solutions
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Empower Your Business
            <span className="block text-primary">with AI Solutions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unlock productivity and profitability with cutting-edge AI technology. 
            Transform how you work, compete, and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                Get Started
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="https://youtube.com/@agent13ai" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Youtube className="mr-2 w-5 h-5" />
                Watch Videos
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Learn how AI can transform your business today
          </p>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20">The Challenge</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Struggling to Keep Up?
              </h2>
              <ul className="space-y-4">
                {["Manual processes eating valuable time", "Competing with larger companies", "Limited budget for enterprise software", "Difficulty scaling operations"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive text-sm">✕</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 shadow-xl scan-line-effect holographic-border">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">The Solution</Badge>
              <h3 className="text-2xl font-bold mb-6">AI-Powered Business Transformation</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Automate Tasks</h3>
                    <p className="text-sm text-muted-foreground">
                      Save hours daily by automating repetitive processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise-Grade AI</h3>
                    <p className="text-sm text-muted-foreground">
                      Access powerful AI tools at affordable prices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Scale Efficiently</h3>
                    <p className="text-sm text-muted-foreground">
                      Grow operations without proportional cost increases
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">AI Solutions</Badge>
            <h2 className="text-4xl font-bold mb-4">How AI Transforms Your Business</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical AI applications that drive real results for businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Workflow,
                title: "Process Automation",
                description: "Eliminate repetitive tasks and focus on growth"
              },
              {
                icon: BrainCircuit,
                title: "Customer Insights",
                description: "AI-powered analytics to understand customers better"
              },
              {
                icon: TrendingUp,
                title: "Revenue Growth",
                description: "Data-driven strategies to increase sales"
              },
              {
                icon: Sparkles,
                title: "Content Creation",
                description: "Generate marketing copy and content instantly"
              },
              {
                icon: RefreshCw,
                title: "24/7 Availability",
                description: "AI assistants that work around the clock"
              },
              {
                icon: CheckCircle,
                title: "Cost Efficiency",
                description: "Reduce costs while improving quality"
              }
            ].map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm group scan-line-effect holographic-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube/Blog Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Learn More</Badge>
            <h2 className="text-4xl font-bold mb-4">Stay Updated with AI Insights</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our YouTube channel for the latest AI news and business tips
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-12 text-center scan-line-effect holographic-border">
              <Youtube className="w-16 h-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">agent13 ai on YouTube</h3>
              <p className="text-muted-foreground mb-8">
                Get weekly updates on AI innovations, practical tutorials, and strategies to grow your 
                business using artificial intelligence.
              </p>
              <a 
                href="https://youtube.com/@agent13ai" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Youtube className="mr-2 w-5 h-5" />
                  Subscribe Now
                </Button>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business with AI?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss how AI can drive productivity and profitability for your business
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Get in Touch
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
