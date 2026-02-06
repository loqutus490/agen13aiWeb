import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { FileSearch, Youtube, Shield, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 animated-gradient-bg">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            About Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Secure Document AI
            <span className="block text-primary">for Professional Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Helping law firms and professional services reduce repetitive work with secure, document-grounded AI
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <FileSearch className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              At agent13 ai, we specialize in Secure Document AI for professional services. We help law firms 
              and document-heavy businesses reduce repetitive email and document work by implementing 
              AI assistants that are grounded in their existing materials. Our solutions improve efficiency, 
              consistency, and response times—without replacing staff or compromising data security.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Security First
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              We understand that professional services firms handle sensitive client information. That's why 
              security is at the core of everything we build. Your data is never used to train external 
              AI models. You maintain full ownership and control over all your firm's information.
            </p>
            <p className="text-lg text-muted-foreground">
              Our enterprise-grade security infrastructure meets the strict requirements of legal and 
              professional services industries.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Supporting Your Team
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Our AI is designed to support your staff, not replace them. We believe the best results come 
              from combining AI efficiency with human expertise and judgment. All AI outputs can be reviewed 
              and approved before use.
            </p>
            <p className="text-lg text-muted-foreground">
              We provide a managed, low-risk service that includes setup, training, and ongoing support. 
              Your team can start using the system quickly without disrupting existing workflows.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Subscribe to our YouTube channel for insights on AI for professional services, practical 
              tutorials, and strategies for implementing AI in your practice.
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
