import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CaseStudies = () => {
  const caseStudies = [
    {
      company: "Mid-Size Litigation Firm",
      industry: "Litigation — 25 Attorneys",
      challenge: "Associates spending 10+ hours per week drafting routine discovery responses, demand letters, and client correspondence using outdated templates scattered across shared drives.",
      solution: "Deployed RAG-powered Document AI trained on the firm's existing brief bank, template library, and internal procedures. Attorneys now draft from a chat interface that pulls relevant precedents automatically.",
      results: [
        { icon: Clock, label: "Drafting Time Saved", value: "12 hrs/week" },
        { icon: DollarSign, label: "Recovered Billable Hours", value: "$18K/mo" },
        { icon: TrendingUp, label: "First-Draft Accuracy", value: "90%+" },
        { icon: Users, label: "Attorney Adoption", value: "100%" }
      ],
      quote: "Our associates went from dreading routine drafting to generating solid first drafts in minutes. The AI pulls from our own precedents, so the quality is consistently on-brand.",
      author: "Managing Partner, Litigation Practice"
    },
    {
      company: "Corporate & Real Estate Practice",
      industry: "Transactional — 12 Attorneys",
      challenge: "Paralegals and junior associates losing hours searching for clause precedents across thousands of past deals. Inconsistent contract language across practice groups causing client confusion.",
      solution: "Implemented document knowledge base covering all executed agreements, clause libraries, and firm playbooks. Staff search and retrieve relevant clauses through natural language queries.",
      results: [
        { icon: Clock, label: "Research Time Cut", value: "70%" },
        { icon: Users, label: "Consistency Improvement", value: "3x better" },
        { icon: TrendingUp, label: "Deals Closed Faster", value: "40%" },
        { icon: DollarSign, label: "Client Satisfaction", value: "+45%" }
      ],
      quote: "We used to have three different versions of the same indemnification clause floating around. Now everyone pulls from a single AI-powered source of truth.",
      author: "Senior Partner, Corporate Practice"
    },
    {
      company: "Family Law Boutique",
      industry: "Family Law — 6 Attorneys",
      challenge: "Small team overwhelmed by volume of routine filings, client intake questionnaires, and correspondence. Staff turnover made institutional knowledge fragile.",
      solution: "Built a firm-specific AI assistant covering intake procedures, court filing templates, standard correspondence, and internal SOPs. New hires onboard faster with AI-guided workflows.",
      results: [
        { icon: TrendingUp, label: "Intake Processing", value: "4x faster" },
        { icon: Users, label: "Onboarding Time", value: "Cut 60%" },
        { icon: DollarSign, label: "Revenue Growth", value: "+35%" },
        { icon: Clock, label: "Admin Hours Saved", value: "20 hrs/week" }
      ],
      quote: "As a small firm, losing one paralegal used to mean losing months of institutional knowledge. Now it's all in the AI system.",
      author: "Founding Partner, Family Law"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Case Studies" description="See how law firms use agent13 ai Document AI to reduce drafting time, improve consistency, and recover billable hours." />
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            Success Stories
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Real Results from
            <span className="block text-primary">Real Law Firms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how firms of all sizes are using Document AI to recover billable hours and improve work product consistency.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl space-y-16">
          {caseStudies.map((study, index) => (
            <Card key={index} className="p-8 md:p-12 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    {study.industry}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">{study.company}</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-2">THE CHALLENGE</h3>
                      <p className="text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-2">THE SOLUTION</h3>
                      <p className="text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {study.results.map((result, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <result.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary mb-1">{result.value}</div>
                    <div className="text-sm text-muted-foreground">{result.label}</div>
                  </div>
                ))}
              </div>

              <div className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
                <p className="text-lg italic mb-2">"{study.quote}"</p>
                <p className="text-sm text-muted-foreground">— {study.author}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to See These Results at Your Firm?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a discovery call to discuss how Document AI can transform your firm's workflows
          </p>
          <Link to="/contact">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group"
              onClick={() => {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({
                  event: 'cta_click',
                  cta_name: 'Get Started Today',
                  cta_location: 'case_studies_cta',
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
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
