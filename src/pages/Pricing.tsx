import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, FileSearch, Workflow, Bot, BrainCircuit, Cpu } from "lucide-react";

const Pricing = () => {
  const services = [
    {
      icon: FileSearch,
      title: "Secure Document AI",
      description: "Document-grounded AI for law firms and professional services",
      price: "$999",
      period: "/month",
      features: [
        "Document indexing using your templates",
        "Email and document drafting assistance",
        "Enterprise-grade security",
        "Your data never used for training",
        "Human oversight on all outputs",
        "Managed service with ongoing support",
        "Staff training included"
      ],
      popular: true
    },
    {
      icon: Bot,
      title: "AI Chatbot",
      description: "24/7 customer support automation",
      price: "$799",
      period: "/month",
      features: [
        "Custom chatbot development",
        "Multi-channel support",
        "Lead qualification",
        "CRM integration",
        "Monthly optimization"
      ],
      popular: false
    },
    {
      icon: BrainCircuit,
      title: "Customer Analytics",
      description: "AI-powered insights and predictions",
      price: "$699",
      period: "/month",
      features: [
        "Behavior pattern analysis",
        "Predictive analytics",
        "Customer segmentation",
        "Custom dashboards",
        "Monthly reporting"
      ],
      popular: false
    },
    {
      icon: Workflow,
      title: "Process Automation",
      description: "Automate repetitive business tasks",
      price: "$499",
      period: "/month",
      features: [
        "Workflow automation",
        "Data entry automation",
        "Document processing",
        "Integration support",
        "Ongoing maintenance"
      ],
      popular: false
    },
    {
      icon: Cpu,
      title: "Content Generation",
      description: "AI-powered marketing content",
      price: "$399",
      period: "/month",
      features: [
        "Marketing copy generation",
        "Social media content",
        "Email campaigns",
        "Brand voice training",
        "Monthly content planning"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 animated-gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Service-Based
            <span className="block text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for managed AI services. All plans include setup, training, and ongoing support.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Flagship Service */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="p-10 border-2 border-primary shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 text-sm font-semibold rounded-bl-lg">
                Most Popular
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 pointer-events-none" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center mt-4">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/30 flex items-center justify-center mb-4">
                    <FileSearch className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Secure Document AI</h2>
                  <p className="text-muted-foreground mb-6">
                    Document-grounded AI for law firms and professional services. Reduce repetitive email and document work while maintaining security and control.
                  </p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">$999</span>
                    <span className="text-xl text-muted-foreground">/month</span>
                  </div>
                  <Link to="/contact">
                    <Button 
                      size="lg"
                      className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group"
                      onClick={() => {
                        (window as any).dataLayer = (window as any).dataLayer || [];
                        (window as any).dataLayer.push({
                          event: 'cta_click',
                          cta_name: 'Schedule Discovery Call - Pricing',
                          cta_location: 'pricing_flagship',
                          service_type: 'Secure Document AI',
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
                
                <div>
                  <h3 className="font-semibold mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {services[0].features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Other Services */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Additional Services</h2>
            <p className="text-muted-foreground">Complement your AI implementation with these services</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(1).map((service, index) => (
              <Card key={index} className="p-6 border-primary/10 hover:shadow-glow transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                <div className="mb-4">
                  <span className="text-2xl font-bold">{service.price}</span>
                  <span className="text-muted-foreground">{service.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button variant="outline" className="w-full" size="sm">
                    Learn More
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What's included in the monthly price?</h3>
                <p className="text-muted-foreground">
                  All services include initial setup, staff training, managed hosting, ongoing support, and regular optimization. No hidden fees.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a setup fee?</h3>
                <p className="text-muted-foreground">
                  Setup fees depend on complexity and customization needs. We'll provide a clear quote during your discovery call.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes. Our services are month-to-month with 30 days notice. We believe in earning your business through results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How long does implementation take?</h3>
                <p className="text-muted-foreground">
                  Most implementations are completed within 2-4 weeks, depending on scope and document complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a free discovery call to discuss your needs and get a custom quote.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-dark">
              Schedule Discovery Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
