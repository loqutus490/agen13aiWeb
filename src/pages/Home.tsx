import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, Zap, Target, TrendingUp, 
  Check, ArrowRight, Play, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 Introducing ProdScript AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Perfect Product Descriptions
            <span className="block text-primary">In Seconds</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered description generator for Amazon & eBay sellers. 
            Create compelling, SEO-optimized listings that convert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 shadow-lg hover:shadow-xl transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 5 free descriptions to start
          </p>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Stop Wasting Hours on Product Descriptions
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                As an online seller, you know the struggle: writing unique, compelling descriptions 
                for dozens or hundreds of products eats up valuable time you could spend growing your business.
              </p>
              <ul className="space-y-4">
                {["Writer's block for every listing", "Inconsistent brand voice", "Poor SEO performance", "Time-consuming revisions"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive text-sm">✕</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">AI-Powered Solution</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate professional descriptions in seconds with our advanced AI
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Platform-Optimized</h3>
                    <p className="text-sm text-muted-foreground">
                      Tailored for Amazon, eBay, and major marketplaces
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">SEO-Friendly</h3>
                    <p className="text-sm text-muted-foreground">
                      Built-in optimization for better search rankings
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create compelling product descriptions that drive sales
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate complete descriptions in under 10 seconds"
              },
              {
                icon: Target,
                title: "Platform-Specific",
                description: "Optimized templates for Amazon, eBay, and more"
              },
              {
                icon: TrendingUp,
                title: "SEO Optimized",
                description: "Built-in keyword optimization for better rankings"
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Advanced language models for human-quality content"
              },
              {
                icon: Check,
                title: "Unlimited Use",
                description: "No restrictions on the Pro plan"
              },
              {
                icon: Star,
                title: "Brand Voice",
                description: "Consistent tone across all your listings"
              }
            ].map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-2">
              <h3 className="text-2xl font-bold mb-2">Free Trial</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>5 free descriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>All features included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>No credit card required</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </Card>

            <Card className="p-8 border-2 border-primary shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Unlimited descriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Advanced SEO optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Custom brand voice</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Product Listings?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join sellers who are saving hours every week with ProdScript AI
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
