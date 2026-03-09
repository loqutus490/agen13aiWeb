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
      company: "TechRetail Solutions",
      industry: "E-commerce",
      challenge: "Manual order processing consuming 15+ hours weekly, leading to delays and errors.",
      solution: "Implemented AI-powered order automation and customer service chatbot.",
      results: [
        { icon: Clock, label: "Time Saved", value: "18 hours/week" },
        { icon: DollarSign, label: "Cost Reduction", value: "45%" },
        { icon: TrendingUp, label: "Efficiency Gain", value: "3x faster" },
        { icon: Users, label: "Customer Satisfaction", value: "+32%" }
      ],
      quote: "The AI automation paid for itself in the first month. We can now focus on growth instead of admin work.",
      author: "Sarah Chen, CEO"
    },
    {
      company: "LocalHealth Clinic",
      industry: "Healthcare",
      challenge: "Appointment scheduling chaos and missed follow-ups affecting patient care.",
      solution: "Deployed AI scheduling assistant and automated patient communication system.",
      results: [
        { icon: Clock, label: "Time Saved", value: "12 hours/week" },
        { icon: Users, label: "Patient Retention", value: "+28%" },
        { icon: TrendingUp, label: "No-Shows Reduced", value: "65%" },
        { icon: DollarSign, label: "Revenue Increase", value: "$4.2K/month" }
      ],
      quote: "Our patients love the instant responses, and our staff can finally focus on patient care instead of phone calls.",
      author: "Dr. Michael Torres"
    },
    {
      company: "GreenSpace Marketing",
      industry: "Marketing Agency",
      challenge: "Content creation bottleneck limiting client capacity and growth.",
      solution: "Integrated AI content generation tools for social media, emails, and blog posts.",
      results: [
        { icon: TrendingUp, label: "Output Increased", value: "4x more" },
        { icon: Users, label: "New Clients", value: "+12" },
        { icon: DollarSign, label: "Revenue Growth", value: "85%" },
        { icon: Clock, label: "Time Saved", value: "25 hours/week" }
      ],
      quote: "We went from serving 8 clients to 20 without hiring more writers. Game changer.",
      author: "Jessica Park, Founder"
    }
  ];

  return (
    <div className="min-h-screen">
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
            <span className="block text-primary">Real Businesses</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how businesses transformed their operations and boosted profitability with AI solutions.
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
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss how AI can transform your business operations
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
              <span className="relative z-10">Get Started Today</span>
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
