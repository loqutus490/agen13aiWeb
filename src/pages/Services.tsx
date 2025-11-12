import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Workflow, BrainCircuit, Bot, CircuitBoard, 
  Cpu, Network, CheckCircle, ArrowRight 
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Transform repetitive manual tasks into automated workflows that save time and reduce errors.",
      features: [
        "Data entry automation",
        "Email and communication automation",
        "Document processing",
        "Workflow optimization",
        "Integration with existing tools"
      ],
      pricing: "Starting at $499/month",
      popular: false
    },
    {
      icon: Bot,
      title: "AI Chatbot Implementation",
      description: "Deploy intelligent chatbots that handle customer inquiries 24/7, improving satisfaction and reducing workload.",
      features: [
        "Custom chatbot development",
        "Multi-channel support",
        "Natural language processing",
        "Lead qualification",
        "Integration with CRM systems"
      ],
      pricing: "Starting at $799/month",
      popular: true
    },
    {
      icon: BrainCircuit,
      title: "Customer Analytics & Insights",
      description: "Harness AI to understand customer behavior, predict trends, and make data-driven decisions.",
      features: [
        "Behavior pattern analysis",
        "Predictive analytics",
        "Customer segmentation",
        "Personalization recommendations",
        "Custom dashboards"
      ],
      pricing: "Starting at $699/month",
      popular: false
    },
    {
      icon: Cpu,
      title: "Content Generation",
      description: "AI-powered content creation for marketing, social media, emails, and more to scale your output.",
      features: [
        "Marketing copy generation",
        "Social media content",
        "Email campaigns",
        "Blog post assistance",
        "Brand voice training"
      ],
      pricing: "Starting at $399/month",
      popular: false
    },
    {
      icon: CircuitBoard,
      title: "AI Strategy Consulting",
      description: "Expert guidance on implementing AI across your business for maximum ROI and competitive advantage.",
      features: [
        "AI readiness assessment",
        "Custom implementation roadmap",
        "Technology selection",
        "ROI analysis",
        "Ongoing optimization support"
      ],
      pricing: "Custom pricing",
      popular: false
    },
    {
      icon: Network,
      title: "Custom AI Solutions",
      description: "Bespoke AI development tailored to your specific business needs and workflows.",
      features: [
        "Custom model development",
        "API integrations",
        "Proprietary tool creation",
        "Scalable architecture",
        "Dedicated support"
      ],
      pricing: "Custom pricing",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            Our Services
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            AI Solutions Designed for
            <span className="block text-primary">Business Growth</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical, affordable AI services that deliver measurable results for your business.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className={`p-8 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border flex flex-col relative overflow-hidden group ${
                  service.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  {service.popular && (
                    <Badge className="mb-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground w-fit">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/20 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <div className="text-2xl font-bold text-primary mb-4">{service.pricing}</div>
                  <Link to="/contact">
                    <Button className="w-full bg-primary hover:bg-primary-dark transition-all">
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-primary-glow/3 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Not Sure Which Service is Right for You?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book a free 30-minute consultation to discuss your business needs and find the perfect AI solution.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group">
                <span className="relative z-10">Schedule Free Consultation</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
