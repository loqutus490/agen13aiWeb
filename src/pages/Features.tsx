import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, Zap, Target, TrendingUp, 
  RefreshCw, CheckCircle, Workflow, BrainCircuit, Cpu, CircuitBoard, Network, Bot
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Eliminate repetitive tasks and free up valuable time for strategic work. Automate data entry, scheduling, and routine workflows.",
      benefits: ["Save 10-20 hours per week", "Reduce human error", "Focus on growth activities"]
    },
    {
      icon: BrainCircuit,
      title: "Customer Analytics",
      description: "Understand your customers better with AI-powered insights. Analyze behavior patterns, predict needs, and identify opportunities.",
      benefits: ["Behavior analysis", "Predictive insights", "Audience segmentation"]
    },
    {
      icon: TrendingUp,
      title: "Revenue Optimization",
      description: "Data-driven strategies to increase sales and profit margins. Get dynamic pricing recommendations and sales forecasting.",
      benefits: ["Pricing optimization", "Sales forecasting", "Inventory management"]
    },
    {
      icon: Cpu,
      title: "Content Creation",
      description: "Generate marketing content, emails, and social media posts instantly. Maintain consistent brand voice across all channels.",
      benefits: ["Marketing copy", "Email automation", "Social media content"]
    },
    {
      icon: Bot,
      title: "24/7 AI Assistants",
      description: "AI-powered chatbots and assistants that work around the clock. Automate customer support and handle multiple conversations.",
      benefits: ["Instant responses", "Multiple conversations", "Improved satisfaction"]
    },
    {
      icon: CircuitBoard,
      title: "Cost Reduction",
      description: "Reduce operational costs while improving quality and efficiency. Lower labor costs and minimize errors through automation.",
      benefits: ["Lower labor costs", "Reduce software expenses", "Minimize errors"]
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
            AI Solutions for
            <span className="block text-primary">Business Growth</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical AI applications that drive productivity and profitability for your business.
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

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss how AI can drive real results for your business.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Get in Touch
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
