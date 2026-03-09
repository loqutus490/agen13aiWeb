import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, Zap, Target, TrendingUp, 
  CheckCircle, Youtube, RefreshCw, Cpu, BrainCircuit, Workflow,
  FileSearch, Shield, Users, Lock
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl glow-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm text-sm">
            <FileSearch className="w-4 h-4 mr-1 inline animate-pulse" />
            Secure Document AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Secure Document AI
            <span className="block text-primary">for Professional Services</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Reduce repetitive email and document work with secure, document-grounded AI assistants. 
            Built for law firms and professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-primary-foreground text-lg px-8 shadow-glow hover:shadow-lg transition-all"
                onClick={() => {
                  (window as any).dataLayer = (window as any).dataLayer || [];
                  (window as any).dataLayer.push({
                    event: 'cta_click',
                    cta_name: 'Schedule Discovery Call - Hero',
                    cta_location: 'home_hero',
                    destination: '/contact'
                  });
                }}
              >
                Schedule Discovery Call
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="https://youtube.com/@agent13ai" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8"
                onClick={() => {
                  (window as any).dataLayer = (window as any).dataLayer || [];
                  (window as any).dataLayer.push({
                    event: 'cta_click',
                    cta_name: 'Watch Videos',
                    cta_location: 'home_hero',
                    destination: 'https://youtube.com/@agent13ai'
                  });
                }}
              >
                <Youtube className="mr-2 w-5 h-5" />
                Watch Videos
              </Button>
            </a>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Your data, your control — never used for training
          </p>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20 text-base font-semibold">The Challenge</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Drowning in Repetitive Work?
              </h2>
              <ul className="space-y-4">
                {[
                  "Repetitive email and document drafting consuming staff time",
                  "Inconsistent responses across team members",
                  "Time lost searching for procedures and templates",
                  "Need to maintain strict data security and compliance"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive text-sm">✕</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 shadow-xl scan-line-effect holographic-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 pointer-events-none" />
              <div className="relative z-10">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">The Solution</Badge>
                <h3 className="text-2xl font-bold mb-6">Secure Document AI</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileSearch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Document-Grounded AI</h3>
                    <p className="text-sm text-muted-foreground">
                      Uses your existing templates and internal documents
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Improved Consistency</h3>
                    <p className="text-sm text-muted-foreground">
                      Better response speed and consistency across staff
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Your Data, Your Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Strict data control with human oversight — never used for training
                    </p>
                  </div>
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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold mb-4">Built for Professional Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure, document-grounded AI that supports your team without disrupting workflows
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileSearch,
                title: "Document Indexing",
                description: "AI trained on your existing templates and documents"
              },
              {
                icon: Shield,
                title: "Security First",
                description: "Strict data control with enterprise-grade security"
              },
              {
                icon: Users,
                title: "Human Oversight",
                description: "AI supports staff, never replaces human judgment"
              },
              {
                icon: Sparkles,
                title: "Email Drafting",
                description: "Generate consistent, professional responses faster"
              },
              {
                icon: RefreshCw,
                title: "Managed Service",
                description: "Low-risk deployment with ongoing support"
              },
              {
                icon: CheckCircle,
                title: "Workflow Integration",
                description: "Works with your existing tools and processes"
              }
            ].map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm group scan-line-effect holographic-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary-glow/30 transition-all">
                    <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
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
            <Card className="p-12 text-center scan-line-effect holographic-border relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
              <div className="relative z-10">
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
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow">
                  <Youtube className="mr-2 w-5 h-5" />
                  Subscribe Now
                </Button>
              </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Reduce Repetitive Work?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a discovery call to see how Secure Document AI can help your firm
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent-orange hover:bg-accent-orange/90 text-lg px-8 shadow-glow-orange">
              Schedule Discovery Call
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
