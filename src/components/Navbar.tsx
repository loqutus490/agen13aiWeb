import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/services", label: "Services" },
  { to: "/ai-tools", label: "AI Tools" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Blog" },
];

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-primary/10 shadow-tech">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMobile}>
            <div className="relative">
              <img src="/logo.png" alt="agent13 ai logo" className="h-8 w-auto transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">agent13 ai</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-muted-foreground hover:text-primary transition-all relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
              </Link>
            ))}
            {isAdmin && (
              <>
                <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary-dark transition-all relative group flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
                </Link>
                <Link to="/blog-management" className="text-sm font-medium text-primary hover:text-primary-dark transition-all relative group">
                  Manage Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all group-hover:w-full" />
                </Link>
              </>
            )}
          </div>

          {/* Desktop auth + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{user.email}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleSignOut} className="gap-2 border-primary/20 hover:bg-primary/10">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link to="/login">
                      <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10">Sign In</Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow transition-all">Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
            <Link to="/contact">
              <Button size="sm" className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow transition-all">Contact Us</Button>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden relative z-50 p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay - rendered outside nav to avoid backdrop-filter containing block issue */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-[55] bg-background/95 backdrop-blur-lg border-t border-primary/10 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className="text-lg font-medium text-muted-foreground hover:text-primary py-3 px-4 rounded-lg hover:bg-primary/5 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="border-t border-border/40 my-2" />
                <Link to="/admin" onClick={closeMobile} className="text-lg font-medium text-primary py-3 px-4 rounded-lg hover:bg-primary/5 transition-all flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin
                </Link>
                <Link to="/blog-management" onClick={closeMobile} className="text-lg font-medium text-primary py-3 px-4 rounded-lg hover:bg-primary/5 transition-all">
                  Manage Blog
                </Link>
              </>
            )}

            <div className="border-t border-border/40 my-2" />

            {!loading && (
              <>
                {user ? (
                  <div className="flex flex-col gap-3 px-4">
                    <div className="flex items-center gap-2 py-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground truncate">{user.email}</span>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="gap-2 border-primary/20 hover:bg-primary/10 w-full">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-4">
                    <Link to="/login" onClick={closeMobile}>
                      <Button variant="outline" className="border-primary/20 hover:bg-primary/10 w-full">Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={closeMobile}>
                      <Button className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow transition-all w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <div className="px-4 mt-2">
              <Link to="/contact" onClick={closeMobile}>
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground shadow-glow transition-all w-full">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
