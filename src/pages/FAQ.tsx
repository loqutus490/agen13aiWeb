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
      category: "Getting Started",
      questions: [
        {
          q: "Is AI too expensive for my small business?",
          a: "Not at all! AI solutions have become increasingly affordable, with many options starting at just a few hundred dollars per month. Most small businesses see ROI within 3-6 months through time savings and increased efficiency. We offer solutions scaled to your budget and can start with high-impact, low-cost implementations."
        },
        {
          q: "Do I need technical knowledge to use AI?",
          a: "No technical expertise required! We handle all the technical implementation and setup. Our solutions are designed to be user-friendly, with intuitive interfaces that your team can use without any coding or technical background. We provide full training and ongoing support."
        },
        {
          q: "How long does AI implementation take?",
          a: "Implementation timelines vary by project complexity. Simple solutions like chatbots or process automation can be deployed in 2-4 weeks. More complex custom solutions may take 6-12 weeks. We always start with a detailed timeline during the consultation phase so you know exactly what to expect."
        },
        {
          q: "Will AI replace my employees?",
          a: "No, AI is designed to augment your team, not replace them. The goal is to automate repetitive, time-consuming tasks so your employees can focus on higher-value work that requires human judgment, creativity, and relationship-building. Most of our clients report increased job satisfaction as employees spend less time on boring tasks."
        }
      ]
    },
    {
      category: "Implementation & Integration",
      questions: [
        {
          q: "Will AI work with my existing software?",
          a: "In most cases, yes! Modern AI solutions are designed to integrate with popular business tools like CRMs, email platforms, accounting software, and more. During our consultation, we'll assess your current tech stack and ensure seamless integration with your existing systems."
        },
        {
          q: "What if I don't have much data?",
          a: "You don't need massive datasets to benefit from AI. Many solutions work with minimal data or can use pre-trained models. We focus on practical implementations that deliver value regardless of your data situation. As you use the AI systems, they'll improve over time with your specific business data."
        },
        {
          q: "How secure is my business data with AI?",
          a: "Data security is our top priority. We use enterprise-grade encryption, comply with industry standards (GDPR, CCPA), and follow best practices for data handling. Your data stays secure and private. We can also discuss options for on-premise solutions if you have specific security requirements."
        },
        {
          q: "Can I customize the AI to match my brand?",
          a: "Absolutely! All our AI solutions can be customized to match your brand voice, tone, and specific business processes. For chatbots and content generation, we train the AI on your brand guidelines and examples to ensure consistency across all customer interactions."
        }
      ]
    },
    {
      category: "ROI & Results",
      questions: [
        {
          q: "How quickly will I see results?",
          a: "Most clients see immediate benefits once AI is deployed. Time savings and efficiency improvements are typically noticeable within the first week. Financial ROI usually becomes clear within 3-6 months, depending on the solution. We provide regular analytics reports so you can track your progress and ROI."
        },
        {
          q: "What kind of ROI can I expect?",
          a: "While results vary by business and implementation, our clients typically see: 15-25 hours saved per week, 30-50% reduction in operational costs, 25-40% increase in customer satisfaction, and 2-3x improvement in task efficiency. We'll help you set realistic expectations based on your specific situation during the consultation."
        },
        {
          q: "What if the AI doesn't work for my business?",
          a: "We start every project with a thorough assessment to ensure AI is a good fit for your specific needs. If during implementation we discover the solution isn't delivering expected results, we'll work with you to adjust the approach or refund your investment according to our satisfaction guarantee terms."
        },
        {
          q: "Do you provide ongoing support?",
          a: "Yes! All our service packages include ongoing support and maintenance. We provide regular check-ins, performance optimization, troubleshooting, and updates to ensure your AI solutions continue delivering value. Support is available via email, phone, and video calls."
        }
      ]
    },
    {
      category: "Pricing & Contracts",
      questions: [
        {
          q: "What's included in the monthly pricing?",
          a: "Monthly pricing typically includes: the AI solution itself, hosting and infrastructure, regular updates and improvements, ongoing support, performance monitoring, and monthly analytics reports. Custom projects may have different inclusions, which we'll detail in your proposal."
        },
        {
          q: "Are there any setup fees?",
          a: "Some projects may have a one-time setup fee depending on complexity and customization requirements. This covers initial consultation, system design, development, integration, testing, and training. We're transparent about all costs upfront—no hidden fees."
        },
        {
          q: "Can I cancel anytime?",
          a: "Most of our service packages are month-to-month with 30 days notice required for cancellation. Custom development projects may have different terms, which we'll outline clearly in your contract. We believe in earning your business every month through results, not locking you into long-term contracts."
        },
        {
          q: "Do you offer free trials or demos?",
          a: "Yes! We offer free 30-minute consultations where we'll assess your needs and demonstrate relevant solutions. For some services, we can provide a limited pilot program so you can experience the benefits before committing to a full implementation."
        }
      ]
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
            <HelpCircle className="w-4 h-4 mr-1 inline" />
            FAQ
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Your Questions,
            <span className="block text-primary">Answered</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about implementing AI in your small business.
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
            Let's talk! Schedule a free consultation to discuss your specific needs and concerns.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group">
              <span className="relative z-10">Schedule Free Consultation</span>
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

export default FAQ;
