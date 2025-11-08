import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Video, Download, BookOpen, 
  CheckSquare, TrendingUp, Youtube, ExternalLink 
} from "lucide-react";

const Resources = () => {
  const guides = [
    {
      icon: FileText,
      title: "AI Readiness Checklist",
      description: "Assess if your business is ready to implement AI solutions with this comprehensive checklist.",
      type: "PDF Download",
      size: "2.1 MB",
      downloadUrl: "/guides/ai-readiness-checklist.pdf",
      fileName: "AI-Readiness-Checklist.pdf"
    },
    {
      icon: BookOpen,
      title: "Small Business AI Implementation Guide",
      description: "Step-by-step guide to planning and executing your first AI project successfully.",
      type: "PDF Download",
      size: "3.5 MB",
      downloadUrl: "/guides/ai-implementation-guide.pdf",
      fileName: "AI-Implementation-Guide.pdf"
    },
    {
      icon: CheckSquare,
      title: "Process Automation Template",
      description: "Identify which tasks in your business are prime candidates for AI automation.",
      type: "Excel Template",
      size: "0.8 MB",
      downloadUrl: "/guides/process-automation-template.xlsx",
      fileName: "Process-Automation-Template.xlsx"
    },
    {
      icon: TrendingUp,
      title: "ROI Calculator for AI Projects",
      description: "Calculate the potential return on investment before implementing AI solutions.",
      type: "Excel Template",
      size: "1.2 MB",
      downloadUrl: "/guides/roi-calculator.xlsx",
      fileName: "ROI-Calculator.xlsx"
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with AI in Your Business",
      duration: "12 min",
      topics: ["AI Basics", "Use Cases", "First Steps"]
    },
    {
      title: "Choosing the Right AI Tools",
      duration: "18 min",
      topics: ["Tool Selection", "Budget Planning", "Integration"]
    },
    {
      title: "Measuring AI Success",
      duration: "15 min",
      topics: ["KPIs", "Analytics", "Optimization"]
    },
    {
      title: "AI Security & Privacy Best Practices",
      duration: "20 min",
      topics: ["Data Protection", "Compliance", "Risk Management"]
    }
  ];

  const articles = [
    {
      title: "5 Ways AI Can Transform Your Customer Service",
      category: "Customer Experience",
      readTime: "8 min read"
    },
    {
      title: "The Real Cost of NOT Using AI in 2025",
      category: "Business Strategy",
      readTime: "10 min read"
    },
    {
      title: "AI Implementation Mistakes to Avoid",
      category: "Best Practices",
      readTime: "12 min read"
    },
    {
      title: "From Manual to Automated: A Case Study",
      category: "Success Stories",
      readTime: "15 min read"
    },
    {
      title: "AI Tools Every Small Business Should Know About",
      category: "Technology",
      readTime: "6 min read"
    },
    {
      title: "Building an AI Strategy on a Budget",
      category: "Planning",
      readTime: "11 min read"
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
            Knowledge Hub
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Learn Everything About
            <span className="block text-primary">AI for Small Business</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Free guides, templates, tutorials, and articles to help you succeed with AI implementation.
          </p>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Free Downloadable Resources</h2>
            <p className="text-xl text-muted-foreground">
              Practical tools and guides to kickstart your AI journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="p-8 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                    <p className="text-muted-foreground mb-4">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {guide.type} • {guide.size}
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary-dark" asChild>
                        <a href={guide.downloadUrl} download={guide.fileName}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Video Tutorials</h2>
            <p className="text-xl text-muted-foreground">
              Watch and learn at your own pace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="p-6 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{tutorial.title}</h3>
                    <div className="text-sm text-muted-foreground mb-3">{tutorial.duration}</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tutorial.topics.map((topic, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <a href="https://youtube.com/@agent13ai" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="w-full">
                        <Youtube className="w-4 h-4 mr-2" />
                        Watch on YouTube
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Articles</h2>
            <p className="text-xl text-muted-foreground">
              Insights, strategies, and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Card key={index} className="p-6 hover:shadow-glow transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm scan-line-effect holographic-border group cursor-pointer">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  {article.category}
                </Badge>
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{article.readTime}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
