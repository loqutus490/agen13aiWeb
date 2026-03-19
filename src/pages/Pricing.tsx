import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, FileSearch, Workflow, Bot, BrainCircuit, Scale } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Client Intake AI",
    description: "Automated intake and conflict checks",
    price: "$799",
    period: "/month",
    features: [
      "AI-powered intake questionnaires",
      "Conflict check integration",
      "Attorney routing logic",
      "Client portal integration",
      "Follow-up automation"
    ],
  },
  {
    icon: BrainCircuit,
    title: "Matter Analytics",
    description: "AI-powered caseload insights",
    price: "$699",
    period: "/month",
    features: [
      "Case outcome pattern analysis",
      "Timeline predictions",
      "Workload balancing",
      "Billing optimization insights",
      "Custom dashboards"
    ],
  },
  {
    icon: Workflow,
    title: "Legal Workflow Automation",
    description: "Automate routine legal processes",
    price: "$499",
    period: "/month",
    features: [
      "Deadline & calendar automation",
      "Court filing preparation",
      "Document assembly workflows",
      "Task delegation & tracking",
      "Practice management integration"
    ],
  },
  {
    icon: Scale,
    title: "AI Strategy Consulting",
    description: "Expert guidance for your firm",
    price: "Custom",
    period: "",
    features: [
      "Firm AI readiness assessment",
      "Ethics & compliance review",
      "Implementation roadmap",
      "ROI analysis by practice area",
      "Change management support"
    ],
  },
];

const faqs = [
  {
    q: "What's included in the monthly price?",
    a: "All services include initial setup, staff training, managed hosting, ongoing support, and regular optimization. No hidden fees."
  },
  {
    q: "Is there a setup fee?",
    a: "Setup fees depend on complexity and customization needs. We'll provide a clear quote during your discovery call."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Our services are month-to-month with 30 days notice. We believe in earning your business through results."
  },
  {
    q: "How long does implementation take?",
    a: "Most implementations are completed within 2-4 weeks, depending on scope and document complexity."
  },
  {
    q: "Is my client data secure?",
    a: "Absolutely. We use enterprise-grade encryption, isolated environments per firm, and your data is never used for model training. We're built for attorney-client privilege."
  },
];

const flagshipFeatures = [
  "RAG indexing of your firm's precedent library and templates",
  "AI-assisted memo, brief, and correspondence drafting",
  "Privilege-safe architecture with data isolation",
  "Your documents never used for model training",
  "Attorney review workflow with approval gates",
  "Integration with your DMS (iManage, NetDocuments)",
  "Staff training included"
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <SEO title="Pricing — AI for Law Firms" description="Transparent pricing for agent13 ai legal services. Secure Document AI, client intake automation, matter analytics, and workflow automation for law firms." />
      <Navbar />

      <section className="pt-32 pb-20 px-4 animated-gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Pricing</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Service-Based
            <span className="block text-primary">Pricing for Law Firms</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for managed AI services — purpose-built for legal professionals. All plans include setup, training, and ongoing support.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Flagship */}
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
                  <h2 className="text-3xl font-bold mb-2">Document AI & RAG</h2>
                  <p className="text-muted-foreground mb-6">
                    Reduce repetitive drafting and research with RAG-powered AI that only uses your firm's own briefs, memos, contracts, and templates.
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
                          service_type: 'Document AI & RAG',
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
                    {flagshipFeatures.map((feature, i) => (
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

          {/* Additional Services */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Additional Legal AI Services</h2>
            <p className="text-muted-foreground">Complement your Document AI with these law-firm-specific solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
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
                  <Button variant="outline" className="w-full" size="sm">Learn More</Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Modernize Your Firm?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a free discovery call to discuss how AI can reduce repetitive work at your firm.
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