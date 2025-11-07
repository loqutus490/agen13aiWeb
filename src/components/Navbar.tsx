import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-primary/10 shadow-tech">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 blur-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">agent13 ai</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
          <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/contact">
            <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group">
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
