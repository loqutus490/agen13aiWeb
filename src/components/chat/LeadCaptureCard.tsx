import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "At least 10 digits")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Invalid format"),
});

type FormData = z.infer<typeof formSchema>;

interface LeadCaptureCardProps {
  onSubmit: (data: FormData) => Promise<boolean>;
  onClose: () => void;
}

export const LeadCaptureCard = ({ onSubmit, onClose }: LeadCaptureCardProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-3 my-2 bg-gradient-to-br from-accent/50 to-accent/30 rounded-2xl border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-primary/20">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="w-4 h-4" />
          Get a Free Consultation
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close form"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground mb-3">
          Share your details and our team will reach out to discuss how AI can help your business.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              {...register("firstName")}
              placeholder="First name"
              disabled={isSubmitting}
              className="h-9 text-sm bg-background/50"
            />
            {errors.firstName && (
              <p className="text-[10px] text-destructive mt-0.5">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Input
              {...register("lastName")}
              placeholder="Last name"
              disabled={isSubmitting}
              className="h-9 text-sm bg-background/50"
            />
            {errors.lastName && (
              <p className="text-[10px] text-destructive mt-0.5">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email address"
            disabled={isSubmitting}
            className="h-9 text-sm bg-background/50"
          />
          {errors.email && (
            <p className="text-[10px] text-destructive mt-0.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("phoneNumber")}
            placeholder="Phone number"
            disabled={isSubmitting}
            className="h-9 text-sm bg-background/50"
          />
          {errors.phoneNumber && (
            <p className="text-[10px] text-destructive mt-0.5">{errors.phoneNumber.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9 text-sm bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Request Consultation"
          )}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          We respect your privacy and won't spam you.
        </p>
      </form>
    </div>
  );
};
