import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, CheckCircle, Youtube, RefreshCw,
  FileSearch, Shield, Users, Lock, Scale, Gavel, BookOpen
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import LeadMagnetSection from "@/components/home/LeadMagnetSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <SEO title="AI Solutions for Law Firms" description="agent13 ai helps law firms automate document review, reduce repetitive drafting, and scale with secure AI solutions built specifically for legal professionals." />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl glow-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl glow-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm text-sm">
            <Scale className="w-4 h-4 mr-1 inline animate-pulse" />
            Built Exclusively for Law Firms
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Document AI
            <span className="block text-primary">for Law Firms</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop drowning in repetitive drafting and document review. Our secure, RAG-powered AI assistants 
            use your firm's own precedents and templates to deliver faster, more consistent legal work.
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
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 cursor-default opacity-70"
              disabled
            >
              <Youtube className="mr-2 w-5 h-5" />
              Coming Soon
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Attorney-client privilege preserved — your data is never used for model training
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
                Your Attorneys Are Drowning in Repetitive Work
              </h2>
              <ul className="space-y-4">
                {[
                  "Associates spending hours drafting routine correspondence and memos",
                  "Inconsistent work product across attorneys and practice groups",
                  "Time wasted searching for precedents, templates, and firm procedures",
                  "Client data security and attorney-client privilege must be maintained"
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
                <h3 className="text-2xl font-bold mb-6">RAG-Powered Legal AI</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileSearch className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Precedent-Grounded Drafting</h3>
                      <p className="text-sm text-muted-foreground">
                        AI that only uses your firm's own briefs, memos, contracts, and templates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Consistent Legal Work Product</h3>
                      <p className="text-sm text-muted-foreground">
                        Uniform quality across all attorneys and practice groups
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Privilege-Safe Architecture</h3>
                      <p className="text-sm text-muted-foreground">
                        Data isolation, encryption at rest, and zero model training on your documents
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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why Law Firms Choose Us</Badge>
            <h2 className="text-4xl font-bold mb-4">Built Specifically for Legal Practice</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure, RAG-powered AI that understands legal workflows and protects attorney-client privilege
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Knowledge Base RAG",
                description: "Your firm's precedents, templates, and procedures become a searchable AI knowledge base"
              },
              {
                icon: Shield,
                title: "Privilege-Safe Security",
                description: "SOC 2-ready infrastructure with data isolation between matters and clients"
              },
              {
                icon: Scale,
                title: "Legal-Specific AI",
                description: "Purpose-built for legal document review, drafting, and research workflows"
              },
              {
                icon: Sparkles,
                title: "Memo & Brief Drafting",
                description: "Generate first drafts of memos, briefs, and correspondence grounded in your precedents"
              },
              {
                icon: RefreshCw,
                title: "Managed Deployment",
                description: "White-glove setup with ongoing support — no IT burden on your firm"
              },
              {
                icon: CheckCircle,
                title: "Practice Management Integration",
                description: "Works alongside your existing DMS, case management, and billing tools"
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

      {/* Social Proof / Stats */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Results</Badge>
            <h2 className="text-4xl font-bold mb-4">What Firms Experience</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { stat: "60%", label: "Reduction in routine drafting time" },
              { stat: "3x", label: "Faster internal document search" },
              { stat: "100%", label: "Data stays within your control" },
            ].map((item) => (
              <Card key={item.label} className="p-8 text-center border-primary/10 bg-card/50">
                <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                <p className="text-muted-foreground">{item.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <LeadMagnetSection />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Modernize Your Firm's Workflows?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a discovery call to see how RAG-powered Document AI can help your attorneys work smarter
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground text-lg px-8 shadow-glow">
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
