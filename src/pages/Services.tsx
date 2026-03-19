import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Workflow, BrainCircuit, Bot, Scale,
  CheckCircle, ArrowRight, FileSearch, Shield, Lock, Gavel, BookOpen
} from "lucide-react";

const Services = () => {
  const additionalServices = [
    {
      icon: Bot,
      title: "Client Intake AI",
      description: "Automate client intake with an AI-powered questionnaire that collects case details, generates conflict checks, and routes to the right attorney.",
      features: [
        "Automated intake questionnaires",
        "Conflict check integration",
        "Attorney routing logic",
        "Client portal integration",
        "Follow-up automation"
      ],
      pricing: "Starting at $799/month"
    },
    {
      icon: BrainCircuit,
      title: "Matter Analytics & Insights",
      description: "AI-powered analytics across your caseload to identify trends, predict timelines, and optimize resource allocation.",
      features: [
        "Case outcome pattern analysis",
        "Timeline predictions",
        "Workload balancing",
        "Billing optimization insights",
        "Custom dashboards"
      ],
      pricing: "Starting at $699/month"
    },
    {
      icon: Workflow,
      title: "Legal Workflow Automation",
      description: "Automate routine legal processes — from deadline tracking to court filing preparation — so your team focuses on substantive work.",
      features: [
        "Deadline and calendar automation",
        "Court filing preparation",
        "Document assembly workflows",
        "Task delegation & tracking",
        "Practice management integration"
      ],
      pricing: "Starting at $499/month"
    },
    {
      icon: Scale,
      title: "AI Strategy for Law Firms",
      description: "Expert guidance on implementing AI at your firm for maximum ROI while maintaining ethical compliance and client trust.",
      features: [
        "Firm AI readiness assessment",
        "Ethics & compliance review",
        "Implementation roadmap",
        "ROI analysis by practice area",
        "Change management support"
      ],
      pricing: "Custom pricing"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Services for Law Firms" description="Document AI, client intake automation, matter analytics, and AI strategy consulting — purpose-built services for law firms from agent13 ai." />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            Our Services
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            AI Services
            <span className="block text-primary">Built for Law Firms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From document drafting to client intake — we help law firms reduce repetitive work with secure, privilege-safe AI.
          </p>
        </div>
      </section>

      {/* Flagship Service */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="p-10 md:p-12 border-2 border-primary shadow-2xl relative overflow-hidden scan-line-effect">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 text-sm font-semibold rounded-bl-lg">
              Flagship Service
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 pointer-events-none" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/30 flex items-center justify-center mb-6">
                  <FileSearch className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Document AI & RAG</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We help law firms reduce repetitive drafting and research by implementing RAG-powered AI assistants trained on your firm's own briefs, memos, contracts, and templates — improving speed, consistency, and accuracy without replacing attorney judgment.
                </p>
                <div className="text-3xl font-bold text-primary mb-6">Starting at $999/month</div>
                <Link to="/contact">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group"
                    onClick={() => {
                      (window as any).dataLayer = (window as any).dataLayer || [];
                      (window as any).dataLayer.push({
                        event: 'cta_click',
                        cta_name: 'Schedule Discovery Call - Flagship',
                        cta_location: 'services_flagship',
                        service_type: 'Document AI & RAG',
                        destination: '/contact'
                      });
                    }}
                  >
                    <span className="relative z-10">Schedule Discovery Call</span>
                    <ArrowRight className="ml-2 w-5 h-5 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                {[
                  { icon: FileSearch, text: "RAG indexing of your firm's precedent library and templates" },
                  { icon: BookOpen, text: "AI-assisted memo, brief, and correspondence drafting" },
                  { icon: Shield, text: "Privilege-safe architecture with data isolation" },
                  { icon: Lock, text: "Your documents never used for model training" },
                  { icon: Gavel, text: "Attorney review workflow with approval gates" },
                  { icon: Workflow, text: "Integration with your DMS and practice management tools" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Additional Services</Badge>
            <h2 className="text-3xl font-bold mb-4">More AI Solutions for Your Firm</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complement your Document AI with these legal-specific services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {additionalServices.map((service, index) => (
              <Card 
                key={index} 
                className="p-8 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border flex flex-col relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{service.description}</p>
                
                  <ul className="space-y-3 mb-6">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                
                  <div className="mt-auto">
                    <div className="text-xl font-bold text-primary mb-4">{service.pricing}</div>
                    <Link to="/contact">
                      <Button className="w-full bg-primary hover:bg-primary-dark transition-all">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-primary-glow/3 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Firm?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Book a free discovery call to discuss how Document AI can help your attorneys work smarter.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group">
                  <span className="relative z-10">Schedule Discovery Call</span>
                  <ArrowRight className="ml-2 w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
