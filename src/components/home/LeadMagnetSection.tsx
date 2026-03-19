import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadLeadForm } from "@/components/DownloadLeadForm";
import { FileText, CheckCircle, ArrowRight } from "lucide-react";

const benefits = [
  "Identify which practice areas benefit most from AI",
  "Evaluate your firm's data readiness and security posture",
  "Get a prioritized implementation roadmap",
  "Understand ROI projections for your firm size",
];

const LeadMagnetSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
        <div className="container mx-auto max-w-5xl">
          <Card className="p-10 md:p-14 border-2 border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/10 pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  <FileText className="w-4 h-4 mr-1 inline" />
                  Free Guide
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  AI Readiness Assessment for Law Firms
                </h2>
                <p className="text-muted-foreground mb-6">
                  Not sure if your firm is ready for AI? Download our free assessment checklist 
                  to evaluate your firm's readiness across security, workflows, and ROI potential.
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow"
                  onClick={() => {
                    (window as any).dataLayer = (window as any).dataLayer || [];
                    (window as any).dataLayer.push({
                      event: 'cta_click',
                      cta_name: 'Download AI Readiness Assessment - Home',
                      cta_location: 'home_lead_magnet',
                    });
                    setIsFormOpen(true);
                  }}
                >
                  Download Free Guide
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  {benefits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <DownloadLeadForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        resourceTitle="AI Readiness Assessment for Law Firms"
        resourceFileName="ai-readiness-assessment-law-firms.pdf"
        downloadUrl="/guides/ai-readiness-assessment-law-firms.pdf"
      />
    </>
  );
};

export default LeadMagnetSection;
