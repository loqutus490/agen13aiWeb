import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, Zap, Target, TrendingUp, Shield, 
  Globe, Palette, Clock, ArrowRight 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Leverages advanced language models trained on millions of successful product listings to create compelling, conversion-optimized descriptions.",
      benefits: ["Human-quality content", "Context-aware writing", "Continuous learning"]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate complete, polished product descriptions in under 10 seconds. No more writer's block or hours spent crafting the perfect copy.",
      benefits: ["10 second generation", "Batch processing", "Instant previews"]
    },
    {
      icon: Target,
      title: "Platform-Optimized",
      description: "Tailored templates and formatting for Amazon, eBay, Shopify, and other major e-commerce platforms. Each description follows platform best practices.",
      benefits: ["Amazon optimization", "eBay formatting", "Multi-platform support"]
    },
    {
      icon: TrendingUp,
      title: "SEO Optimization",
      description: "Built-in keyword research and placement ensures your products rank higher in search results, driving more organic traffic to your listings.",
      benefits: ["Keyword integration", "Search ranking boost", "Competitor analysis"]
    },
    {
      icon: Palette,
      title: "Custom Brand Voice",
      description: "Train the AI to match your unique brand voice and tone. Maintain consistency across all your product listings automatically.",
      benefits: ["Brand tone training", "Consistent messaging", "Voice customization"]
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Generate descriptions in multiple languages to reach global markets. Perfect for international sellers expanding their reach.",
      benefits: ["20+ languages", "Native translations", "Cultural adaptation"]
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "AI-powered grammar checking, plagiarism detection, and readability scoring ensure every description meets professional standards.",
      benefits: ["Grammar checking", "Plagiarism detection", "Readability scores"]
    },
    {
      icon: Clock,
      title: "Version History",
      description: "Save and compare multiple versions of your descriptions. Roll back to previous versions or A/B test different approaches.",
      benefits: ["Unlimited versions", "Easy comparison", "A/B testing support"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Features
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Everything You Need to
            <span className="block text-primary">Sell More Products</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI features designed specifically for e-commerce sellers who want to scale their business efficiently.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience All Features?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your free trial today. No credit card required.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
