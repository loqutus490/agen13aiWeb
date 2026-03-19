import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, FileSearch, Shield, Lock, Scale, 
  CheckCircle, Workflow, Gavel, BookOpen, Mail
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileSearch,
      title: "RAG-Powered Knowledge Base",
      description: "Your firm's briefs, memos, contracts, and templates are indexed into a secure knowledge base. The AI retrieves relevant precedents and language to generate accurate, firm-specific outputs — not generic boilerplate.",
      benefits: ["Grounded in your firm's own documents", "Retrieves relevant precedents automatically", "Improves with your document library over time"]
    },
    {
      icon: Mail,
      title: "Legal Drafting Assistant",
      description: "Generate first drafts of memos, briefs, correspondence, and contract clauses grounded in your precedent library. Attorneys review and refine — the AI handles the repetitive heavy lifting.",
      benefits: ["First drafts in minutes, not hours", "Consistent voice across all attorneys", "Grounded in your firm's proven language"]
    },
    {
      icon: Shield,
      title: "Privilege-Safe Architecture",
      description: "Built from the ground up for law firms. Data is isolated per client matter, encrypted at rest and in transit, and never leaves your designated environment. Attorney-client privilege is architecturally protected.",
      benefits: ["Per-matter data isolation", "Zero model training on your data", "SOC 2-ready infrastructure"]
    },
    {
      icon: Lock,
      title: "Ethical AI Compliance",
      description: "Our system is designed around ABA Model Rules and state bar ethical guidelines. Full audit trails, citation to source documents, and mandatory human review ensure compliance with professional responsibility standards.",
      benefits: ["ABA Model Rules aligned", "Full audit trail on every output", "Source citations for verification"]
    },
    {
      icon: Gavel,
      title: "Attorney Review Workflow",
      description: "AI never acts autonomously — every output goes through an attorney approval workflow. Lawyers review, edit, and approve before anything goes to a client or a court.",
      benefits: ["Mandatory human review gates", "Edit and approve before use", "Maintains attorney oversight"]
    },
    {
      icon: Workflow,
      title: "Practice Management Integration",
      description: "Works alongside your existing DMS (iManage, NetDocuments), case management (Clio, PracticePanther), and billing systems without disrupting your current workflows.",
      benefits: ["DMS integration (iManage, NetDocuments)", "Case management compatibility", "No workflow disruption"]
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Features" description="RAG-powered knowledge base, legal drafting assistant, privilege-safe architecture, and practice management integration — built for law firms by agent13 ai." />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Document AI
            <span className="block text-primary">Built for Legal Practice</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            RAG-powered AI that uses your firm's own precedents to accelerate drafting, improve consistency, and protect privilege.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm group scan-line-effect holographic-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-primary-glow/20 rounded-lg group-hover:from-primary/20 group-hover:to-primary-glow/30 transition-all">
                      <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">How It Works</Badge>
            <h2 className="text-3xl font-bold mb-4">White-Glove Deployment for Your Firm</h2>
          </div>
          
          <div className="space-y-8">
            {[
              { step: "1", title: "Discovery Call", description: "We learn about your practice areas, document workflows, and specific pain points" },
              { step: "2", title: "Document Indexing", description: "We securely ingest your firm's precedent library, templates, and internal procedures into the RAG knowledge base" },
              { step: "3", title: "Attorney Training", description: "Your team learns to use the AI drafting assistant and review workflows" },
              { step: "4", title: "Ongoing Optimization", description: "Managed service with continuous tuning as your document library grows" }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Modernize Your Firm's Workflows?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a discovery call to see how Document AI can help your attorneys draft faster and more consistently.
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

export default Features;
