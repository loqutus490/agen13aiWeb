import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowRight } from "lucide-react";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Secure Document AI",
      questions: [
        {
          q: "What is Secure Document AI?",
          a: "Secure Document AI is our flagship service that helps law firms and professional services reduce repetitive email and document work. The AI is grounded in your existing templates and internal documents, allowing it to generate consistent, accurate responses while maintaining strict data security."
        },
        {
          q: "How does the document indexing work?",
          a: "We securely index your existing templates, procedures, and internal documents. The AI uses these materials to understand your firm's standards and generate responses that match your established practices and voice."
        },
        {
          q: "Is my data secure?",
          a: "Absolutely. Your data is never used to train external AI models. You maintain full ownership and control over all your firm's information. We use enterprise-grade encryption and strict access controls to protect your documents."
        },
        {
          q: "Will AI replace my staff?",
          a: "No. Secure Document AI is designed to support your staff, not replace them. It handles repetitive tasks so your team can focus on higher-value work that requires human judgment, expertise, and client relationships."
        },
        {
          q: "How long does implementation take?",
          a: "Most implementations are completed within 2-4 weeks, depending on the scope and complexity of your document library. We handle the setup, and training is included so your team can start using the system quickly."
        }
      ]
    },
    {
      category: "Getting Started",
      questions: [
        {
          q: "Is AI too expensive for my firm?",
          a: "Our Secure Document AI service starts at $999/month, which typically pays for itself through time savings within the first month. We focus on delivering measurable ROI through reduced time spent on repetitive tasks."
        },
        {
          q: "Do I need technical knowledge to use AI?",
          a: "No technical expertise required. We handle all the technical implementation and setup. The interface is a simple chat that your staff can use without any training on AI or coding."
        },
        {
          q: "What if I'm not sure if AI is right for my firm?",
          a: "Schedule a free discovery call with us. We'll assess your current workflows and honestly tell you whether our solutions would provide value for your specific situation. No pressure, just honest advice."
        }
      ]
    },
    {
      category: "Security & Compliance",
      questions: [
        {
          q: "How do you handle client confidentiality?",
          a: "We treat your client data with the same confidentiality standards you do. Documents are processed in secure, isolated environments. We never share data between clients, and we're happy to sign NDAs and BAAs as required."
        },
        {
          q: "What happens to my documents after processing?",
          a: "Your documents remain under your control. They're securely indexed for AI use but never leave your designated secure environment. You can request deletion at any time."
        },
        {
          q: "Are you compliant with industry regulations?",
          a: "Our infrastructure is designed to meet the compliance requirements of legal and professional services industries. We're happy to discuss specific compliance needs during your discovery call."
        }
      ]
    },
    {
      category: "Pricing & Contracts",
      questions: [
        {
          q: "What's included in the monthly pricing?",
          a: "Monthly pricing includes the AI service, secure hosting, ongoing support, and regular optimization. Setup and initial training are typically handled separately based on your specific needs."
        },
        {
          q: "Are there any setup fees?",
          a: "Setup fees depend on complexity and customization requirements. We'll provide a clear, transparent quote during your discovery call so you know exactly what to expect."
        },
        {
          q: "Can I cancel anytime?",
          a: "Yes. Our services are month-to-month with 30 days notice. We believe in earning your business through results, not locking you into long-term contracts."
        },
        {
          q: "Do you offer custom solutions?",
          a: "Absolutely. Every firm is different, and we tailor our implementation to your specific workflows, documents, and needs. Contact us to discuss your requirements."
        }
      ]
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
            <HelpCircle className="w-4 h-4 mr-1 inline" />
            FAQ
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Your Questions,
            <span className="block text-primary">Answered</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Secure Document AI for professional services.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl space-y-12">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full" />
                {category.category}
              </h2>
              
              <Card className="p-8 border-primary/10 bg-card/50 backdrop-blur-sm">
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, qIndex) => (
                    <AccordionItem 
                      key={qIndex} 
                      value={`${catIndex}-${qIndex}`}
                      className="border-primary/10"
                    >
                      <AccordionTrigger className="text-left hover:text-primary transition-colors">
                        <span className="font-semibold">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule a free discovery call to discuss your specific needs and see if Secure Document AI is right for your firm.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow transition-all">
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

export default FAQ;
