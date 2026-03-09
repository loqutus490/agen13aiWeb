import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, FileSearch, Shield, Lock, Users, 
  CheckCircle, Workflow, Bot, RefreshCw, Mail
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileSearch,
      title: "Document Indexing",
      description: "AI trained on your existing templates, procedures, and internal documents. The assistant uses your firm's own materials to generate accurate, consistent responses.",
      benefits: ["Uses your existing templates", "Learns your firm's procedures", "Maintains your document standards"]
    },
    {
      icon: Mail,
      title: "Email & Document Drafting",
      description: "Generate consistent, professional email responses and documents faster. Staff can draft replies in seconds while maintaining your firm's voice and standards.",
      benefits: ["Faster email responses", "Consistent messaging", "Professional tone maintained"]
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Your data stays secure with strict access controls and enterprise-grade encryption. Built for industries that demand the highest security standards.",
      benefits: ["Strict data control", "Enterprise encryption", "Compliance-ready infrastructure"]
    },
    {
      icon: Lock,
      title: "Your Data, Your Control",
      description: "Your documents and data are never used to train external AI models. You maintain full ownership and control over all your firm's information.",
      benefits: ["Never used for training", "Full data ownership", "Complete privacy control"]
    },
    {
      icon: Users,
      title: "Human Oversight",
      description: "AI supports your staff—it never replaces human judgment. All outputs can be reviewed and approved before use, ensuring quality and accuracy.",
      benefits: ["Supports staff, not replaces", "Review before sending", "Quality assurance built-in"]
    },
    {
      icon: Workflow,
      title: "Workflow Integration",
      description: "Works seamlessly with your existing tools and processes. No need to overhaul your current systems—we integrate with what you already use.",
      benefits: ["Works with existing tools", "No workflow disruption", "Simple adoption process"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Secure Document AI
            <span className="block text-primary">Built for Professional Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Document-grounded AI that uses your existing materials to reduce repetitive work while maintaining security and control.
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
            <h2 className="text-3xl font-bold mb-4">Simple, Managed Deployment</h2>
          </div>
          
          <div className="space-y-8">
            {[
              { step: "1", title: "Discovery Call", description: "We learn about your firm's workflows, documents, and specific needs" },
              { step: "2", title: "Document Setup", description: "We securely index your existing templates and internal materials" },
              { step: "3", title: "Staff Training", description: "Your team learns to use the simple chat interface" },
              { step: "4", title: "Ongoing Support", description: "Managed service with continuous optimization and support" }
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
            Ready to Reduce Repetitive Work?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a discovery call to see how Secure Document AI can help your firm.
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
