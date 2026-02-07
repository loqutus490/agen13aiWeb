import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  company: z.string()
    .trim()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must be less than 100 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const { data: responseData, error } = await supabase.functions.invoke(
        "send-contact-email",
        {
          body: data,
        }
      );

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      
      // Push conversion event to GTM dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'contact_form_submission',
        form_name: 'Contact Form',
        contact_email: data.email,
        company_name: data.company
      });
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form after successful submission
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 relative overflow-hidden animated-gradient-bg">
        <div className="absolute inset-0 grid-background opacity-40" />
        <div className="absolute inset-0 grid-background-dots opacity-20" />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
            <Mail className="w-4 h-4 mr-1 inline" />
            Contact Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Let's Transform Your
            <span className="block text-primary">Business Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch to discuss how AI can drive productivity and profitability for your business.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 md:p-12 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Smith"
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-base">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@company.com"
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-base">
                  Company Name *
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Your Company Inc."
                  className="mt-2"
                  disabled={isSubmitting}
                />
                {errors.company && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message" className="text-base">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Tell us about your business needs and how we can help..."
                  className="mt-2 min-h-[180px]"
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin relative z-10" />
                    <span className="relative z-10">Sending...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5 relative z-10" />
                    <span className="relative z-10">Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 w-5 h-5 relative z-10" />
                    <span className="relative z-10">Send Message</span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </form>
          </Card>

          <Card className="mt-8 p-6 bg-muted/30 border-primary/10 scan-line-effect">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Quick Response Guarantee</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We typically respond within 24 hours during business days. For urgent inquiries, please mention it in your message.
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>📧 Email: RoyBernales@agent13.ai</p>
                  <p>📺 YouTube: <a href="https://youtube.com/@agent13ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@agent13ai</a></p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
