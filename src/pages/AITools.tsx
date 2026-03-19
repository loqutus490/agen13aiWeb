import { ArrowRight, Sparkles, ExternalLink, Scale, FileSearch, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AITools = () => {
  const tools = [
    {
      title: "Legal Document Analyzer",
      description: "Upload contracts or briefs and get instant AI-powered summaries, clause extraction, and key term identification.",
      badge: "Coming Soon",
      features: [
        "Contract clause extraction",
        "Key term identification",
        "Risk flag detection",
        "Plain-language summaries"
      ],
      link: null,
      linkText: "Coming Soon"
    },
    {
      title: "Firm AI Readiness Assessment",
      description: "Answer a few questions about your firm's workflows and get a personalized AI adoption roadmap.",
      badge: "Coming Soon",
      features: [
        "Workflow analysis",
        "ROI projection",
        "Implementation timeline",
        "Priority recommendations"
      ],
      link: null,
      linkText: "Coming Soon"
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO title="AI Tools for Lawyers" description="Free AI tools for law firms — document analysis, readiness assessment, and more from agent13 ai." />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 grid-background-dots opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-background" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-accent text-accent-foreground border-accent-foreground/20">
              <Scale className="w-3 h-3 mr-1" />
              Legal AI Tools
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                AI Tools
              </span>{" "}
              for Legal Professionals
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Purpose-built AI tools to help lawyers draft faster, research smarter, 
              and manage documents more efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className="group relative border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 holographic-border scan-line-effect"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-accent/80 text-accent-foreground">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{tool.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                    disabled={!tool.link}
                  >
                    {tool.link ? (
                      <a href={tool.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {tool.linkText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    ) : (
                      <>
                        {tool.linkText}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {/* Request Tool Card */}
            <Card className="border-border/30 bg-card/30 backdrop-blur-sm border-dashed">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">Suggest a Tool</Badge>
                <CardTitle className="text-2xl text-muted-foreground">Need Something Specific?</CardTitle>
                <CardDescription>
                  Tell us what legal workflows you'd like automated, and we'll build it.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">
                    Request a Tool
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Need a Custom AI Solution for Your Firm?
            </h2>
            <p className="text-lg text-muted-foreground">
              We build custom Document AI and knowledge management systems tailored to your firm's practice areas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground">
                <Link to="/contact">
                  Schedule Discovery Call
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">
                  View Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AITools;
