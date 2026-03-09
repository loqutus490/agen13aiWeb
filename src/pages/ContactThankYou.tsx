import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const ContactThankYou = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 mr-1 inline" />
            Submission Received
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Thank You for
            <span className="block text-primary">Your Submission!</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We have received your message and will contact you as soon as possible. 
            Our team typically responds within 24 hours during business days.
          </p>

          <Card className="p-8 border-primary/10 bg-card/50 backdrop-blur-sm max-w-xl mx-auto mb-8">
            <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
            <ul className="text-left text-muted-foreground space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Our team will review your inquiry</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>We'll reach out to schedule your discovery call</span>
              </li>
            </ul>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-dark shadow-glow">
              <Link to="/">
                <Home className="mr-2 w-5 h-5" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/resources">
                Explore Resources
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactThankYou;
