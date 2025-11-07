import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Contact Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? Want to request a demo? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <form className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What's this about?" className="mt-2" />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Tell us more..." 
                className="mt-2 min-h-[150px]"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Mail className="mr-2 w-5 h-5" />
              Send Message
            </Button>
          </form>

          <div className="mt-12 p-6 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours. For urgent inquiries, please mention it in your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
