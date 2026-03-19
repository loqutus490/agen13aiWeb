import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadLeadForm } from "@/components/DownloadLeadForm";
import {
  FileText, CheckCircle, ArrowRight, Shield, Scale, BarChart3,
  Workflow, ClipboardCheck, Lock
} from "lucide-react";

const assessmentAreas = [
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Evaluate your firm's data security posture, encryption practices, and compliance with attorney-client privilege requirements.",
  },
  {
    icon: Workflow,
    title: "Workflow Analysis",
    description: "Identify which practice areas and document types will benefit most from AI-assisted drafting and review.",
  },
  {
    icon: BarChart3,
    title: "ROI Projections",
    description: "Calculate projected time savings and cost reduction based on your firm's size and practice mix.",
  },
  {
    icon: ClipboardCheck,
    title: "Data Readiness",
    description: "Assess whether your existing templates, precedents, and document management systems are ready for AI indexing.",
  },
  {
    icon: Lock,
    title: "Privilege Protection",
    description: "Understand the architecture requirements to maintain attorney-client privilege with AI tools.",
  },
  {
    icon: Scale,
    title: "Implementation Roadmap",
    description: "Get a phased approach to AI adoption tailored to your firm's risk tolerance and resources.",
  },
];

const checklist = [
  "20-point readiness scoring rubric",
  "Practice area prioritization matrix",
  "Security requirements checklist",
  "Vendor evaluation framework",
  "ROI calculation worksheet",
  "Sample implementation timeline",
];

const AIReadinessGuide = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <SEO
        title="Free AI Readiness Assessment for Law Firms"
        description="Download our free AI readiness assessment checklist. Evaluate your law firm's security, workflows, and ROI potential for AI-powered document review and drafting."
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 animated-gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <FileText className="w-4 h-4 mr-1 inline" />
                Free Download
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Is Your Law Firm
                <span className="block text-primary">Ready for AI?</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Our comprehensive assessment checklist helps you evaluate your firm's readiness for
                AI-powered document review and drafting — covering security, workflows, and ROI.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow text-lg px-8"
                onClick={() => {
                  (window as any).dataLayer = (window as any).dataLayer || [];
                  (window as any).dataLayer.push({
                    event: 'cta_click',
                    cta_name: 'Download Assessment - Landing Hero',
                    cta_location: 'ai_readiness_hero',
                  });
                  setIsFormOpen(true);
                }}
              >
                Download Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required — instant PDF download
              </p>
            </div>

            <Card className="p-8 border-primary/20 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">What's Inside</h3>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Areas */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Assessment Areas</Badge>
            <h2 className="text-3xl font-bold mb-4">What the Assessment Covers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six critical areas every law firm should evaluate before adopting AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessmentAreas.map((area) => (
              <Card key={area.title} className="p-6 border-primary/10 hover:shadow-glow transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <area.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-muted-foreground">{area.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Get Your Free Assessment Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join forward-thinking firms that are evaluating AI the right way — with a structured, security-first approach.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-dark text-primary-foreground text-lg px-8 shadow-glow"
            onClick={() => setIsFormOpen(true)}
          >
            Download Free Assessment
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />

      <DownloadLeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        resourceTitle="AI Readiness Assessment for Law Firms"
        resourceFileName="ai-readiness-assessment-law-firms.pdf"
        downloadUrl="/guides/ai-readiness-assessment-law-firms.pdf"
      />
    </div>
  );
};

export default AIReadinessGuide;
