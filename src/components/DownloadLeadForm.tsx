import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(100, { message: "First name must be less than 100 characters" }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(100, { message: "Last name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format" }),
});

type FormData = z.infer<typeof formSchema>;

interface DownloadLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  resourceFileName: string;
  downloadUrl: string;
}

export const DownloadLeadForm = ({
  isOpen,
  onClose,
  resourceTitle,
  resourceFileName,
  downloadUrl,
}: DownloadLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save lead data via rate-limited edge function
      const { data: leadResponse, error: leadError } = await supabase.functions.invoke(
        "submit-lead",
        {
          body: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            downloadedResource: resourceTitle,
          },
        }
      );

      if (leadError) {
        // Check if it's a rate limit error
        if (leadError.message?.includes("429") || leadResponse?.error?.includes("Too many")) {
          throw new Error("Too many submissions. Please try again later.");
        }
        throw leadError;
      }
      
      if (!leadResponse?.success) {
        throw new Error(leadResponse?.error || "Failed to submit");
      }

      // Send thank you email
      const { error: emailError } = await supabase.functions.invoke(
        "send-download-confirmation",
        {
          body: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            resourceTitle: resourceTitle,
          },
        }
      );

      if (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't block download if email fails
      }

      // Trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = resourceFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Push conversion event to GTM dataLayer (hashed PII for privacy)
      const emailBytes = new TextEncoder().encode(data.email.toLowerCase().trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', emailBytes);
      const hashedEmail = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'download_lead_submission',
        form_name: 'Download Lead Form',
        resource_title: resourceTitle,
        lead_email_hash: hashedEmail
      });
      
      toast({
        title: "Success!",
        description: "Your download will begin shortly. Check your email for a confirmation.",
      });

      reset();
      onClose();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download {resourceTitle}</DialogTitle>
          <DialogDescription>
            Please provide your information to download this resource. We'll send you a confirmation email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              placeholder="John"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              placeholder="Doe"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Download"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
