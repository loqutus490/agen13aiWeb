import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { FileSearch, Youtube, Shield, Users, Scale, Gavel } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO title="About Us" description="Learn about agent13 ai — our mission to help law firms leverage secure, RAG-powered AI for document automation, legal research, and practice efficiency." />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 animated-gradient-bg">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            About Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Document AI
            <span className="block text-primary">Built for the Legal Industry</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Helping law firms of all sizes work smarter with secure, RAG-powered AI that understands legal practice
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-8">
          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              At agent13 ai, we exist to help law firms — from solo practitioners to mid-size firms — reduce the burden 
              of repetitive legal work. We build RAG-powered AI assistants that are grounded in your firm's own 
              precedents, templates, and procedures. Our solutions help attorneys draft faster, research more 
              efficiently, and deliver more consistent work product — all while maintaining the security and 
              privilege protections that legal practice demands.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <FileSearch className="w-8 h-8 text-primary" />
              Why RAG for Law Firms
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Retrieval-Augmented Generation (RAG) is the ideal AI approach for legal work because it grounds 
              every AI output in your firm's actual documents — not generic internet data. When an attorney asks 
              the AI to draft a motion to compel, it pulls from your firm's successful motions, not someone else's.
            </p>
            <p className="text-lg text-muted-foreground">
              This means higher accuracy, consistent firm voice, and outputs that reflect your proven strategies 
              and standards. It's the difference between a generic AI chatbot and a purpose-built legal tool.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Security & Privilege
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              We understand that law firms handle some of the most sensitive information in any industry. 
              Attorney-client privilege isn't just a feature requirement — it's a professional obligation. 
              That's why our architecture includes per-matter data isolation, encryption at rest and in transit, 
              and a strict policy that your documents are never used for AI model training.
            </p>
            <p className="text-lg text-muted-foreground">
              Our infrastructure is designed to meet ABA Model Rules requirements and is built for firms 
              that need SOC 2-ready security posture.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Gavel className="w-8 h-8 text-primary" />
              Attorney-First Design
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Our AI is built to support attorneys, not replace them. Every output includes source citations 
              back to the original documents, enabling attorneys to verify and validate before use. Mandatory 
              review workflows ensure that no AI-generated content reaches a client or court without human oversight.
            </p>
            <p className="text-lg text-muted-foreground">
              We provide white-glove deployment including setup, training, and ongoing optimization. Your firm 
              gets the benefits of AI without the IT burden.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border/40">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Our YouTube channel is coming soon! We'll share insights on AI for legal practice, practical 
              tutorials on document automation, and strategies for implementing AI at your firm ethically and effectively.
            </p>
            <span className="inline-flex items-center gap-2 text-muted-foreground text-lg opacity-70">
              <Youtube className="w-6 h-6" />
              Coming Soon
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
