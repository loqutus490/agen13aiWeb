import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
          <Link to="/case-studies" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            Case Studies
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
          <Link to="/resources" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            Resources
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
          <Link to="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{user.email}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSignOut}
                    className="gap-2 border-primary/20 hover:bg-primary/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-primary hover:bg-primary-dark shadow-glow hover:shadow-tech-lg transition-all relative overflow-hidden group">
                      <span className="relative z-10">Sign Up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
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
