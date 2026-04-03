import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "We cut our routine drafting time by more than half. Associates now spend their energy on strategy instead of reformatting templates.",
    name: "Sarah M.",
    title: "Managing Partner",
    firm: "Mid-Size Litigation Firm (45 Attorneys)",
    stars: 5,
  },
  {
    quote:
      "The RAG system pulls exactly the right precedent every time. Our work product consistency across practice groups has never been better.",
    name: "David R.",
    title: "Head of Knowledge Management",
    firm: "Regional Full-Service Firm (80 Attorneys)",
    stars: 5,
  },
  {
    quote:
      "Security was our top concern. The data isolation and zero-training policy gave us confidence to move forward — our clients' data stays ours.",
    name: "Jennifer L.",
    title: "General Counsel & Partner",
    firm: "Boutique IP Firm (12 Attorneys)",
    stars: 5,
  },
  {
    quote:
      "Onboarding was painless. The managed deployment meant zero IT overhead, and we were productive within the first week.",
    name: "Michael T.",
    title: "COO",
    firm: "Corporate Defense Firm (30 Attorneys)",
    stars: 5,
  },
];

const TestimonialsSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Legal Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from attorneys and firm leaders who have transformed their
            practice with AI
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          className="mx-auto max-w-3xl"
        >
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <Card className="p-8 md:p-10 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 pointer-events-none" />
                  <div className="relative z-10 text-center">
                    <Quote className="w-8 h-8 text-primary/40 mx-auto mb-4" />
                    <p className="text-lg md:text-xl italic text-foreground/90 mb-6 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star
                          key={s}
                          className="w-4 h-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.title}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {t.firm}
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                current === i
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
